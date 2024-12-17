import { boardService } from '../../services/board'
import { store } from '../store'
//removed from the import below ADD_BOARD_MSG
import {
    ADD_BOARD,
    REMOVE_BOARD,
    SET_BOARDS,
    SET_BOARD,
    UPDATE_BOARD,
    UNLOAD_BOARD,
    SET_WORKSPACE,
    BOARD_UNDO,
    SET_DYNAMIC_BG,
    SET_BRIGHTNESS,
    SET_FILTER_BY,
} from '../reducers/board.reducer'
import { batch } from 'react-redux'
import { workspaceService } from '../../services/workspace/workspace.service'

export async function loadBoards() {
    const filterBy = store.getState().boardModule.filterBy
    try {
        const boards = await boardService.query(filterBy)
        store.dispatch(getCmdSetBoards(boards))
    } catch (err) {
        console.log('Cannot load boards', err)
        throw err
    }
}

export async function loadBoard(boardId) {
    try {
        const board = await boardService.getById(boardId)
        store.dispatch(getCmdSetBoard(board))
    } catch (err) {
        console.log('Cannot load board', err)
        throw err
    }
}

export async function loadWorkspace() {
    try {
        const workspace = await workspaceService.query()
        store.dispatch(getCmdSetWorkspace(workspace))
    } catch (err) {
        console.log('Cannot load workspace', err)
        throw err
    }
}
export function unloadBoard() {
    store.dispatch(getCmdUnloadBoard())
}
export function setDynamicBg(dynamicBg) {
    store.dispatch(getCmdSetDynamicBg(dynamicBg))
}
export function setFilterBy(filterBy) {
    store.dispatch(getCmdSetFilterBy(filterBy))
}
export function setBrightness(brightness) {
    store.dispatch(getCmdSetBrightness(brightness))
}

export async function removeBoard(boardId) {
    try {
        await boardService.remove(boardId)
        store.dispatch(getCmdRemoveBoard(boardId))
    } catch (err) {
        console.log('Cannot remove board', err)
        throw err
    }
}

export async function addBoard(board) {
    const user = store.getState().userModule.user
    try {
        const savedBoard = await boardService.save(board)

        const activity = {
            txt: `created this board`,
            boardId: savedBoard._id,
            groupId: null,
            taskId: null,
            byMember: { _id: user._id, fullname: user.fullname, imgUrl: user.imgUrl },
            createdAt: Date.now(),
        }

        try {
            await boardService.addActivity(activity)
        } catch (err) {
            console.error('Failed to add activity:', err)
        }

        store.dispatch(getCmdAddBoard(savedBoard.activities.unshift(activity)))

        return savedBoard
    } catch (err) {
        console.log('Cannot add board', err)
        throw err
    }
}

export async function updateBoard(board, activity = null) {
    try {

        if (activity) {
            // Push the activity to the saved board's activities
            await boardService.addActivity(activity).catch((err) => {
                console.error('Failed to add activity:', err)
            })
        }

        const { activities, ...boardWithoutActivities } = board
        const savedBoard = await boardService.save(boardWithoutActivities)

        store.dispatch(getCmdUpdateBoard(savedBoard))
        return savedBoard
    } catch (err) {
        console.log('Cannot save board', err)
        throw err
    }
}

export async function updateBoardOptimistic(board) {
    console.log(board)
    store.dispatch(getCmdUpdateBoard(board))
    // store.dispatch(getCmdUpdateBoard(savedBoard))
    try {
        await boardService.save(board)
        // return savedBoard
    } catch (err) {
        store.dispatch(getCmdUndoBoard(board))
        console.log('Cannot update board', err)
        throw err
    }
}

/* export async function addBoardMsg(boardId, txt) {
    try {
        const msg = await boardService.addBoardMsg(boardId, txt)
        store.dispatch(getCmdAddBoardMsg(msg))
        return msg
    } catch (err) {
        console.log('Cannot add board msg', err)
        throw err
    }
}
 */
// Command Creators:
function getCmdSetBoards(boards) {
    return {
        type: SET_BOARDS,
        boards,
    }
}
function getCmdSetWorkspace(workspace) {
    return {
        type: SET_WORKSPACE,
        workspace,
    }
}
function getCmdSetBoard(board) {
    return {
        type: SET_BOARD,
        board,
    }
}
function getCmdSetDynamicBg(dynmaicBg) {
    return {
        type: SET_DYNAMIC_BG,
        dynmaicBg,
    }
}
function getCmdSetFilterBy(filterBy) {
    return {
        type: SET_FILTER_BY,
        filterBy,
    }
}
function getCmdSetBrightness(brightness) {
    return {
        type: SET_BRIGHTNESS,
        brightness,
    }
}
function getCmdUnloadBoard() {
    return {
        type: UNLOAD_BOARD,
    }
}
function getCmdRemoveBoard(boardId) {
    return {
        type: REMOVE_BOARD,
        boardId,
    }
}
function getCmdAddBoard(board) {
    return {
        type: ADD_BOARD,
        board,
    }
}
function getCmdUpdateBoard(board) {
    return {
        type: UPDATE_BOARD,
        board,
    }
}

function getCmdUndoBoard() {
    return {
        type: BOARD_UNDO,
    }
}
/* function getCmdAddBoardMsg(msg) {
    return {
        type: ADD_BOARD_MSG,
        msg
    }
} */

// unitTestActions()
/* async function unitTestActions() {
    await loadBoards()
    await addBoard(boardService.getEmptyBoard())
    await updateBoard({
        _id: 'm1oC7',
        title: 'Board-Good',
    })
    await removeBoard('m1oC7')
    // TODO unit test addBoardMsg
}
 */
