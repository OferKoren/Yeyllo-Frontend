import { useParams } from 'react-router'
import { loadBoard, unloadBoard, updateBoard } from '../store/actions/board.actions'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { GroupList } from '../cmps/GroupList'
import { BoardHeader } from '../cmps/BoardHeader'

export function BoardDetails({ rootRef }) {
    const { boardId } = useParams()
    const board = useSelector((storeState) => storeState.boardModule.board)
    // console.log(board)
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

    // style={{backgroundImage:`url(${board.style.backgroundImage})`}}
    if (!board) return <div>Loading...</div>
    return (
        <article className="board-details full" /* style={board.style} */>
            {/* <header className="board-header flex">
                <div>{board.title}</div>
                <div>
                    {board.members.map((member) => (
                        <img className="member-img" key={member._id} src={member.imgUrl} alt="" />
                    ))}
                </div>
            </header> */}
            <BoardHeader board={board} onUpdateBoard={onUpdateBoard} />
            <section className="board-details">
                <GroupList onUpdateBoard={onUpdateBoard} board={board} />
            </section>
        </article>
    )
}
