const { DEV, VITE_LOCAL } = import.meta.env

import { boardData } from '../../../data/board'
import { getRandomIntInclusive, makeId } from '../util.service'

import { boardService as local } from './board.service.local'
import { boardService as remote } from './board.service.remote'

function getEmptyBoard() {
    return {
        title: '',
        isStarred: false,
        createdBy: {},
        style: {
            // backgroundSize: '100% 100%',
            backgroundImage: 'url(https://res.cloudinary.com/dkckt1l7i/image/upload/v1731148744/starry-night_ggz5qa.jpg)',
            // backgroundColor: 'green',
        },
        labels: [],
        members: [],
        groups: [],
        activites: [],
    }
}
function getBackgroundPallet() {
    return boardData.backgroundPallet
}
function getDefaultFilter() {
    return {
        // txt: '',
        // minSpeed: '',
        // sortField: '',
        // sortDir: '',
    }
}

const service = VITE_LOCAL === 'true' ? local : remote
// if (VITE_LOCAL === 'true') console.log('hiiiii')
export const boardService = { getEmptyBoard, getDefaultFilter, getBackgroundPallet, ...service }

// Easy access to this service from the dev tools console
// when using script - dev / dev:local

if (DEV) window.boardService = boardService
