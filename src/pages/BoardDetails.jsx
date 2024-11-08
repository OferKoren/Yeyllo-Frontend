import { useParams } from "react-router"
import { loadBoard } from "../store/actions/board.actions"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { GroupList } from "../cmps/GroupList"

export function BoardDetails() {

    const { boardId } = useParams()
    const board = useSelector(storeState => storeState.boardModule.board)
    console.log(board);

    useEffect(() => {
        loadBoard(boardId)
    }, [boardId])

    


    if (!board) return <div>Loading...</div>
    return (
        <article className="board-details" style={{backgroundImage:`url(${board.style.backgroundImage})`}}>
            <header className="board-header flex">
                <div>
                    {board.title}
                </div>
                <div>
                    {board.members.map(member=> 
                        <img className="member-img" key={member._id} src={member.imgUrl} alt="" />
                    )}
                </div>
            </header>
            <section className="board-details">
                <GroupList board={board} />
            </section>
        </article>
    )
}
