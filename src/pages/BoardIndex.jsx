import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { loadBoards, addBoard, updateBoard, removeBoard, addBoardMsg } from '../store/actions/board.actions'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { boardService } from '../services/board'
import { userService } from '../services/user'

import { BoardList } from '../cmps/BoardList'
// import { BoardFilter } from '../cmps/BoardFilter'

export function BoardIndex() {
    const [filterBy, setFilterBy] = useState(boardService.getDefaultFilter())
    const boards = useSelector((storeState) => storeState.boardModule.boards)

    useEffect(() => {
        loadBoards(filterBy)
    }, [filterBy])

    // async function onRemoveBoard(boardId) {
    //     try {
    //         await removeBoard(boardId)
    //         showSuccessMsg('Board removed')
    //     } catch (err) {
    //         showErrorMsg('Cannot remove board')
    //     }
    // }

    async function onAddBoard() {
        const board = boardService.getEmptyBoard()
        board.vendor = prompt('Vendor?')
        try {
            const savedBoard = await addBoard(board)
            showSuccessMsg(`Board added (id: ${savedBoard._id})`)
        } catch (err) {
            showErrorMsg('Cannot add board')
        }
    }

    // async function onUpdateBoard(board) {
    //     const speed = +prompt('New speed?', board.speed)
    //     if(speed === 0 || speed === board.speed) return

    //     const boardToSave = { ...board, speed }
    //     try {
    //         const savedBoard = await updateBoard(boardToSave)
    //         showSuccessMsg(`Board updated, new speed: ${savedBoard.speed}`)
    //     } catch (err) {
    //         showErrorMsg('Cannot update board')
    //     }
    // }
    if (!boards) return <div>loading...</div>
    return (
        <main className="board-index">
            <header>
                <h2>Boards</h2>
                {userService.getLoggedinUser() && <button onClick={onAddBoard}>Add a Board</button>}
            </header>
            {/* <BoardFilter filterBy={filterBy} setFilterBy={setFilterBy} /> */}
            <BoardList boards={boards} />
        </main>
    )
}
