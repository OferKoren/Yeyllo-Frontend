import { storageService } from '../async-storage.service.js'
import { loadFromStorage, makeId, saveToStorage } from '../util.service.js'
import { userService } from '../user'
import { boardData } from '../../../data/board.js'
const STORAGE_KEY = 'workspace'
_CreateWorkspace()
export const workspaceService = {
    query,
    save,
}

async function query() {
    var workspace = await storageService.query(STORAGE_KEY)
    return workspace
}

// todo need to update the save on what to do with board to save
async function save(workspace) {
    updatedWorkspace = await storageService.post(STORAGE_KEY, workspace)
    return updatedWorkspace
}

//* only for dev purposes
function _CreateWorkspace() {
    let workspace = loadFromStorage(STORAGE_KEY)
    if (!workspace) {
        workspace = boardData.workspace
        saveToStorage(STORAGE_KEY, workspace)
    }
}
