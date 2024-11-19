import { httpService } from '../http.service'

export const boardService = {
    query,
    getById,
    save,
    remove,
    addBoardMsg,
    uploadImg,
    addActivity,
    generateAiBoard,
}

async function query(filterBy = {}, board) {
    return httpService.get(`board`, filterBy)
}

async function getById(boardId, filterBy = {}) {
    console.log(filterBy)
    let board = await httpService.get(`board/${boardId}`)
    if (filterBy.keyword) {
        console.log('filtering, ', board)
        const regExp = new RegExp(filterBy.keyword, 'i')
        const labels = board.labels

        board.groups = board.groups.map((group) => {
            group.tasks = group.tasks.filter((task) => {
                const filterByCardTitle = regExp.test(task.title)

                if (task.labelIds) {
                    const filterByLabels = task.labelIds.some((labelId) => {
                        const label = labels.find((label) => label.id === labelId)

                        if (label) return regExp.test(label.title)
                        return false
                    })

                    return filterByLabels || filterByCardTitle
                }
                return filterByCardTitle
            })
            return group
        })
    }
    return board
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

async function generateAiBoard(topic) {
    return httpService.post(`board/generate-board`, topic)
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
