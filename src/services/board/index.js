const { DEV, VITE_LOCAL } = import.meta.env

import { useSelector } from 'react-redux'
import { boardData } from '../../../data/board'
import { getRandomIntInclusive, makeId } from '../util.service'

import { boardService as local } from './board.service.local'
import { boardService as remote } from './board.service.remote'

function getEmptyBoard() {
    const user = useSelector((storeState) => storeState.userModule.user)
    console.log(user)

    return {
        title: '',
        isStarred: false,
        createdBy: user,
        style: {
            // backgroundSize: '100% 100%',
            backgroundImage: 'url(https://res.cloudinary.com/dkckt1l7i/image/upload/v1731148744/starry-night_ggz5qa.jpg)',
            // backgroundColor: 'green',
        },
        urls: { regular: 'https://res.cloudinary.com/dkckt1l7i/image/upload/v1731148744/starry-night_ggz5qa.jpg' },
        labels: [],
        members: [user],
        groups: [],
        activities: [],
    }
}
function getBackgroundPallet() {
    return boardData.backgroundPallet
}
function getBackgroundEmoji() {
    return boardData.backgroundEmoj
}
function getArchivedItems(board) {
    const archivedItems = board.groups.reduce((acc, group) => {
        const archivedTasks = group.tasks
            .filter((task) => task.archivedAt)
            .map((task) => {
                return { ...task, groupId: group.id }
            })

        acc = [...acc, ...archivedTasks]
        return acc
    }, [])
    return archivedItems
}
function getDefaultFilter() {
    return {
        // txt: '',
        // minSpeed: '',
        // sortField: '',
        // sortDir: '',
    }
}

export function getEmptyGroup() {
    return {
        id: makeId(),
        style: {},
        tasks: [],
        title: '',
    }
}

const service = VITE_LOCAL === 'true' ? local : remote
// if (VITE_LOCAL === 'true') console.log('hiiiii')
export const boardService = { getEmptyBoard, getDefaultFilter, getBackgroundPallet, getBackgroundEmoji, getArchivedItems, ...service }

// Easy access to this service from the dev tools console
// when using script - dev / dev:local

if (DEV) window.boardService = boardService
