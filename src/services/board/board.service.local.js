import { storageService } from '../async-storage.service.js'
import { loadFromStorage, makeId, saveToStorage } from '../util.service.js'
import { userService } from '../user'
import { boardData } from '../../../data/board.js'
const STORAGE_KEY = 'board'
_createBoard()
export const boardService = {
    query,
    getById,
    save,
    remove,
}
window.cs = boardService

async function query(filterBy = { txt: '' }) {
    var boards = await storageService.query(STORAGE_KEY)
    const { txt, sortField, sortDir } = filterBy

    if (txt) {
        const regex = new RegExp(filterBy.txt, 'i')
        boards = boards.filter((board) => regex.test(board.vendor) || regex.test(board.description))
    }
    // if(sortField === 'vendor' || sortField === 'owner'){
    //     boards.sort((board1, board2) =>
    //         board1[sortField].localeCompare(board2[sortField]) * +sortDir)
    // }
    // if(sortField === 'price' || sortField === 'speed'){
    //     boards.sort((board1, board2) =>
    //         (board1[sortField] - board2[sortField]) * +sortDir)
    // }

    // boards = boards.map(({ _id, vendor, price, speed, owner }) => ({ _id, vendor, price, speed, owner }))
    return boards
}

function getById(boardId) {
    return storageService.get(STORAGE_KEY, boardId)
}

async function remove(boardId) {
    // throw new Error('Nope')
    await storageService.remove(STORAGE_KEY, boardId)
}

// todo need to update the save on what to do with board to save
async function save(board) {
    var savedBoard
    if (board._id) {
        const boardToSave = {
            _id: board._id,
        }
        savedBoard = await storageService.put(STORAGE_KEY, boardToSave)
    } else {
        const boardToSave = {
            vendor: board.vendor,
            // Later, owner is set by the backend
            owner: userService.getLoggedinUser(),
            msgs: [],
        }
        savedBoard = await storageService.post(STORAGE_KEY, boardToSave)
    }
    return savedBoard
}

//* think not relevent
/* async function addBoardMsg(boardId, txt) {
    // Later, this is all done by the backend
    const board = await getById(boardId)

    const msg = {
        id: makeId(),
        by: userService.getLoggedinUser(),
        txt,
    }
    board.msgs.push(msg)
    await storageService.put(STORAGE_KEY, board)

    return msg
} */

//* only for dev purposes
function _createBoard() {
    let board = loadFromStorage(STORAGE_KEY)
    if (!board || !board.length) {
        board = boardData.board
        saveToStorage(STORAGE_KEY, board)
    }
}
