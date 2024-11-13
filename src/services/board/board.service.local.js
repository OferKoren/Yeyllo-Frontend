import { storageService } from '../async-storage.service.js'
import { loadFromStorage, makeId, saveToStorage } from '../util.service.js'
import { userService } from '../user'
import { boardData } from '../../../data/board.js'
import { workspaceService } from '../workspace/workspace.service.js'
const STORAGE_KEY = 'board'
_createBoards()
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
    console.log('hi-get')
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
            ...board,
            _id: board._id,
            labels: board.labels,
        }
        savedBoard = await storageService.put(STORAGE_KEY, boardToSave)
    } else {
        const boardToSave = {
            ...board,
            createdAt: Date.now(),
        }
        savedBoard = await storageService.post(STORAGE_KEY, boardToSave)
    }
    return savedBoard
}

//* only for dev purposes
function _createBoards() {
    let boards = loadFromStorage(STORAGE_KEY)
    if (!boards || !boards.length) {
        boards = boardData.boards
        saveToStorage(STORAGE_KEY, boards)
    }
}
