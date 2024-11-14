import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { loadBoards, addBoard, updateBoard, removeBoard, loadWorkspace } from '../../store/actions/board.actions'

import { showSuccessMsg, showErrorMsg } from '../../services/event-bus.service'
import { workspaceService } from '../../services/workspace/workspace.service'
import { boardService } from '../../services/board'
import { userService } from '../../services/user'
import { Modal } from '../../cmps/Modal'
import { BoardList } from '../../cmps/workspace/BoardList'
import { AddBoard } from '../../cmps/workspace/modals/AddBoard'
import { useNavigate } from 'react-router'
import ClickOutside from '../../cmps/ClickOutside'
import { WorkspaceAside } from '../../cmps/workspace/aside/WorkspaceAside'
import { WorkspaceHeader } from '../../cmps/workspace/WorkspaceHeader'

// import { BoardFilter } from '../cmps/BoardFilter'

//* boardIndex is the personal workspace of someone in the workspace
export function BoardIndex() {
    const [filterBy, setFilterBy] = useState(boardService.getDefaultFilter())
    const [isModalOpen, setIsModalOpen] = useState(false)
    const boards = useSelector((storeState) => storeState.boardModule.boards)
    const workspace = useSelector((storeState) => storeState.boardModule.workspace)

    const navigate = useNavigate()
    useEffect(() => {
        loadWorkspace()
    }, [])
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
    function onCloseModal() {
        setIsModalOpen(false)
    }
    function onOpenModal() {
        setIsModalOpen(true)
    }

    async function onAddBoard(board) {
        if (!board) {
            const board = boardService.getEmptyBoard()
            board.title = prompt('TITLE?')
        }

        try {
            const savedBoard = await addBoard(board)
            navigate(`/board/${savedBoard._id}`)
            // showSuccessMsg(`Board added (id: ${savedBoard._id})`)
        } catch (err) {
            showErrorMsg('Cannot add board')
        } finally {
            setIsModalOpen(false)
            // nav
        }
    }

    async function onUpdateBoard(board) {
        const boardToSave = { ...board }
        try {
            const savedBoard = await updateBoard(boardToSave)
            console.log(savedBoard)
        } catch (err) {
            showErrorMsg('Cannot update board')
        }
    }
    if (!boards || !workspace)
        return (
            <div className="trello-loader">
                <img src="\img\general\trello-loader.svg" alt="" />
            </div>
        )
    console.log(workspace)
    return (
        <main className="board-index workspace-layout">
            {/* <BoardFilter filterBy={filterBy} setFilterBy={setFilterBy} /> */}
            <WorkspaceAside />
            <div className="main-section">
                <WorkspaceHeader workspace={workspace} />
                <hr />
                <BoardList boards={boards} onAddBoard={onAddBoard} onOpenModal={onOpenModal} onUpdateBoard={onUpdateBoard} />
            </div>

            <ClickOutside onClick={onCloseModal}>
                <Modal title="Create board" onCloseModal={onCloseModal} isOpen={isModalOpen} isBlur={false} isBackDrop={false}>
                    <AddBoard onAddBoard={onAddBoard} />
                </Modal>
            </ClickOutside>
        </main>
    )
}
