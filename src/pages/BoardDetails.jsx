import { useParams } from 'react-router'
import { loadBoard, setBrightness, unloadBoard, updateBoard, updateBoardOptimistic } from '../store/actions/board.actions'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { GroupList } from '../cmps/GroupList'
import { BoardHeader } from '../cmps/board/BoardHeader'
import { BoardMenu } from '../cmps/board/boardMenu/BoardMenu'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import { socketService, SOCKET_EVENT_BOARD_UPDATED } from '../services/socket.service.js'
import { UPDATE_BOARD } from '../store/reducers/board.reducer.js'

export function BoardDetails({ rootRef }) {
    const { boardId } = useParams()
    const board = useSelector((storeState) => storeState.boardModule.board)
    const brightness = useSelector((storeState) => storeState.boardModule.brightness)
    const [isMenuOpen, setMenuOpen] = useState(false)
    const [isShrink, setIsShrink] = useState(false)
    const [isAsideOpen, setAsideOpen] = useState(false)

    const dispatch = useDispatch()

    useEffect(() => {
        socketService.on(SOCKET_EVENT_BOARD_UPDATED, (updatedBoard) => {
            console.log('GOT from socket', 'board')
            dispatch({ type: UPDATE_BOARD, board: updatedBoard })
        })
        // boardTheme()
        return () => {
            socketService.off(SOCKET_EVENT_BOARD_UPDATED)

            baseTheme()
        }
    }, [])
    useEffect(() => {
        if (!!brightness) boardTheme(brightness)
    }, [brightness])
    useEffect(() => {
        socketService.emit('join-board', boardId)
        console.log('joined to board', boardId)

        return () => {
            socketService.emit('leave-board', boardId)
            console.log('left the board', boardId)
        }
    }, [])

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

    function boardTheme(brightness) {
        console.log(brightness)
        if (brightness === 1) {
            document.documentElement.style.setProperty('--dynmaic-create-btn-color', ' #172B4D')
            document.documentElement.style.setProperty('--dynmaic-create-btn', '#00000029')
            document.documentElement.style.setProperty('--dynmaic-create-btn-hover', '#00000052')

            document.documentElement.style.setProperty('--dynamic-board-header-color', ' #172B4D')
            document.documentElement.style.setProperty('--dynamic-board-header-hover', ' #00000029')
            document.documentElement.style.setProperty('--dynamic-board-header-background', '#ffffff3d')
            document.documentElement.style.setProperty('--dynamic-star-color', '#172B4D')

            document.documentElement.style.setProperty('--dynamic-nav-hover1', '#00000029')
        } else {
            document.documentElement.style.setProperty('--dynmaic-create-btn-color', ' #ffffff')
            document.documentElement.style.setProperty('--dynmaic-create-btn', '#ffffff33')
            document.documentElement.style.setProperty('--dynmaic-create-btn-hover', '#ffffff5c')

            document.documentElement.style.setProperty('--dynamic-nav-hover1', '#ffffff33')

            if (brightness === 2) {
                document.documentElement.style.setProperty('--dynamic-star-color', '#ffffff')
            } else {
                document.documentElement.style.setProperty('--dynamic-star-color', '#e2b203')
            }
        }
    }
    function baseTheme() {
        setBrightness(2)
        document.documentElement.style.setProperty('--dynamic-nav-hover1', '#091e4224')
        document.documentElement.style.setProperty('--dynmaic-create-btn-color', ' #ffffff')
        document.documentElement.style.setProperty('--dynmaic-create-btn', '#0c66e4')
        document.documentElement.style.setProperty('--dynmaic-create-btn-hover', '#0055cc')
    }
    async function onUpdateBoard(board) {
        await updateBoard(board)
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
    if (!board)
        return (
            <div className="trello-loader">
                <img src="\img\general\trello-loader.svg" alt="" />
            </div>
        )
    let dynamicClass = 'full'
    if (isMenuOpen || isAsideOpen) {
        if (!isMenuOpen) dynamicClass = 'full-right'
        else if (!isAsideOpen) dynamicClass = 'full-left'
        else dynamicClass = ''
    }

    const handleDragDrop = async (results) => {
        const { source, destination, type } = results
        if (!destination) return

        if (source.droppableId === destination.droppableId && source.index === destination.index) return

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
                console.log('err: ', err)
            }
        } else {
            const taskSourceIndex = source.index
            const taskDestinationIndex = destination.index

            const groupSourceIndex = board.groups.findIndex((group) => group.id === source.droppableId)
            const groupDestinationIndex = board.groups.findIndex((group) => group.id === destination.droppableId)

            const newSourceTasks = [...board.groups[groupSourceIndex].tasks]
            const newDestinationTasks =
                source.droppableId !== destination.droppableId ? [...board.groups[groupDestinationIndex].tasks] : newSourceTasks

            const [deletedTask] = newSourceTasks.splice(taskSourceIndex, 1)
            newDestinationTasks.splice(taskDestinationIndex, 0, deletedTask)

            const newGroups = [...board.groups]

            newGroups[groupSourceIndex] = {
                ...board.groups[groupSourceIndex],
                tasks: newSourceTasks,
            }
            newGroups[groupDestinationIndex] = {
                ...board.groups[groupDestinationIndex],
                tasks: newDestinationTasks,
            }

            board.groups = newGroups

            try {
                await updateBoardOptimistic(board)
                // await updateBoard(board)
            } catch {
                console.log('err: ', err)
            }
        }
    }
    // if (board) console.log(board)
    return (
        <DragDropContext onDragEnd={handleDragDrop}>
            <section className="full horizontal-container">
                {isAsideOpen && <div style={{ width: '200px' }}>aside</div>}
                <article className={`board-details ${dynamicClass}`} /* style={board.style} */>
                    <BoardHeader
                        board={board}
                        onUpdateBoard={onUpdateBoard}
                        isMenuOpen={isMenuOpen}
                        onToggleMenu={onToggleMenu}
                        setIsShrink={setIsShrink}
                    />
                    <Droppable droppableId="ROOT" type="group" direction="horizontal">
                        {(provided) => (
                            <section {...provided.droppableProps} ref={provided.innerRef} className="board-details">
                                <GroupList placeholder={provided.placeholder} onUpdateBoard={onUpdateBoard} board={board} />
                                {provided.placeholder}
                            </section>
                        )}
                    </Droppable>
                </article>
                {/* <BoardMenu /> */}
                {isMenuOpen && <BoardMenu isShrink={isShrink} onToggleMenu={onToggleMenu} board={board} onUpdateBoard={onUpdateBoard} />}
            </section>
        </DragDropContext>
    )
}
