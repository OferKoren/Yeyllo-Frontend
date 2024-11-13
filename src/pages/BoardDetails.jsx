import { useParams } from 'react-router'
import { loadBoard, unloadBoard, updateBoard } from '../store/actions/board.actions'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { GroupList } from '../cmps/GroupList'
import { BoardHeader } from '../cmps/board/BoardHeader'
import { BoardMenu } from '../cmps/board/BoardMenu'

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
    
    return (
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
                <section className="board-details">
                    <GroupList onUpdateBoard={onUpdateBoard} board={board} />
                </section>
            </article>
            {isMenuOpen && <BoardMenu isShrink={isShrink} onToggleMenu={onToggleMenu} />}
            {/* <BoardMenu /> */}
        </section>
    )
}
