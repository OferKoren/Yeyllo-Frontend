import { useParams } from 'react-router'
import { loadBoard, unloadBoard, updateBoard } from '../store/actions/board.actions'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { GroupList } from '../cmps/GroupList'
import { BoardHeader } from '../cmps/board/BoardHeader'
import { BoardMenu } from '../cmps/board/BoardMenu'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'

export function BoardDetails({ rootRef }) {
    const { boardId } = useParams()
    const board = useSelector((storeState) => storeState.boardModule.board)
    const [isMenuOpen, setMenuOpen] = useState(false)
    const [isShrink, setIsShrink] = useState(false)
    const [isAsideOpen, setAsideOpen] = useState(false)

    useEffect(() => {
        if (rootRef.current && board) {
            Object.assign(rootRef.current.style, board.style)
        }
        return () => {
            rootRef.current.style.cssText = ''
        }
    }, [board])
    useEffect(() => {
        loadBoard(boardId)
        return () => {
            unloadBoard()
        }
    }, [boardId])

    function onUpdateBoard(board) {
        updateBoard(board)
    }
    function onToggleMenu() {
        if (isMenuOpen) {
            setIsShrink(true)
            setTimeout(() => {
                setMenuOpen((prev) => !prev)
                setIsShrink(false)
            }, 600)
        } else setMenuOpen((prev) => !prev)
    }
    // style={{backgroundImage:`url(${board.style.backgroundImage})`}}
    if (!board) return <div className='trello-loader'><img src="\img\general\trello-loader.svg" alt="" /></div>
    let dynamicClass = 'full'
    if (isMenuOpen || isAsideOpen) {
        if (!isMenuOpen) dynamicClass = 'full-right'
        else if (!isAsideOpen) dynamicClass = 'full-left'
        else dynamicClass = ''
    }

    const handleDragDrop = async (results) => {
        const { source, destination, type } = results
        if (!destination) return

        if (source.droppableId === destination.droppableId &&
            source.index === destination.index) return

        if (type === 'group') {
            const reorderGroups = [...board.groups]
            const sourceIndex = source.index
            const destinationIndex = destination.index

            const [removedGroup] = reorderGroups.splice(sourceIndex, 1)
            reorderGroups.splice(destinationIndex, 0, removedGroup)
            board.groups = reorderGroups

            try {
                onUpdateBoard(board)

            } catch {
                console.log('err: ', err);
            }
        } else {

            const taskSourceIndex = source.index;
            const taskDestinationIndex = destination.index;

            const groupSourceIndex = board.groups.findIndex(
                (group) => group.id === source.droppableId
            );
            const groupDestinationIndex = board.groups.findIndex(
                (group) => group.id === destination.droppableId
            );

            const newSourceTasks = [...board.groups[groupSourceIndex].tasks];
            const newDestinationTasks =
                source.droppableId !== destination.droppableId
                    ? [...board.groups[groupDestinationIndex].tasks]
                    : newSourceTasks;

            const [deletedTask] = newSourceTasks.splice(taskSourceIndex, 1);
            newDestinationTasks.splice(taskDestinationIndex, 0, deletedTask);

            const newGroups = [...board.groups];

            newGroups[groupSourceIndex] = {
                ...board.groups[groupSourceIndex],
                tasks: newSourceTasks,
            };
            newGroups[groupDestinationIndex] = {
                ...board.groups[groupDestinationIndex],
                tasks: newDestinationTasks,
            };

            board.groups = newGroups

            try {
                await onUpdateBoard(board)

            } catch {
                console.log('err: ', err);
            }

        }

    }

    return (
        <>
            <DragDropContext onDragEnd={handleDragDrop} className="full horizontal-container">
                {isAsideOpen && <div style={{ width: '200px' }}>aside</div>}
                <article className={`board-details ${dynamicClass}`} /* style={board.style} */>
                    <BoardHeader
                        board={board}
                        onUpdateBoard={onUpdateBoard}
                        isMenuOpen={isMenuOpen}
                        onToggleMenu={onToggleMenu}
                        setIsShrink={setIsShrink}
                    />
                    <Droppable droppableId='ROOT' type='group' direction="horizontal">
                        {(provided) => (
                            <section {...provided.droppableProps} ref={provided.innerRef} className="board-details">
                                <GroupList placeholder={provided.placeholder} onUpdateBoard={onUpdateBoard} board={board} />
                                {provided.placeholder}
                            </section>
                        )}
                    </Droppable>
                </article>
                {/* <BoardMenu /> */}
            </DragDropContext>
            {isMenuOpen && <BoardMenu isShrink={isShrink} onToggleMenu={onToggleMenu} />}
        </>
    )
}
