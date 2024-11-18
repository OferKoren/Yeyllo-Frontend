import { httpService } from '../http.service'

export const boardService = {
    query,
    getById,
    save,
    remove,
    addBoardMsg,
    uploadImg,
    addActivity
}

async function query(filterBy = {}) {
    return httpService.get(`board`, filterBy)
}

function getById(boardId) {
    return httpService.get(`board/${boardId}`)
}

async function remove(boardId) {
    return httpService.delete(`board/${boardId}`)
}
async function save(board) {
    var savedBoard
    if (board._id) {
        savedBoard = await httpService.put(`board/${board._id}`, board)
    } else {
        savedBoard = await httpService.post('board', board)
    }
    return savedBoard
}

async function addBoardMsg(boardId, txt) {
    const savedMsg = await httpService.post(`board/${boardId}/msg`, { txt })
    return savedMsg
}

async function addActivity(activity) {
    return httpService.post(`board/${activity.boardId}/activity`, activity)
}

async function uploadImg(imgData) {
    const CLOUD_NAME = 'webify'
    const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`
    const formData = new FormData()
    formData.append('file', imgData)
    formData.append('upload_preset', 'webify')
    try {
        const res = await fetch(UPLOAD_URL, {
            method: 'POST',
            body: formData,
        })
        const data = await res.json()
        return data.secure_url
    } catch (err) {
        console.log(err)
    }
}
