export const SET_BOARDS = 'SET_BOARDS'
export const SET_BOARD = 'SET_BOARD'
export const REMOVE_BOARD = 'REMOVE_BOARD'
export const ADD_BOARD = 'ADD_BOARD'
export const UPDATE_BOARD = 'UPDATE_BOARD'

export const ADD_BOARD_LABELS = 'SET_BOARD_LABELS'
export const SET_LABELS = 'SET_LABELS'
// export const ADD_BOARD_MSG = 'ADD_BOARD_MSG'

const defaultLabels = [
    { id: 'l101', color: '#4BCE97', title: '' },
    { id: 'l102', color: '#F5CD47', title: '' },
    { id: 'l103', color: '#FEA362', title: '' },
    { id: 'l104', color: '#F87168', title: '' },
    { id: 'l105', color: '#9F8FEF', title: '' },
    { id: 'l106', color: '#579DFF', title: '' },
]

const initialState = {
    boards: [],
    board: null,
    filterBy: {},
    labels: defaultLabels,
    members: []
}

export function boardReducer(state = initialState, action) {
    var newState = state
    var boards
    switch (action.type) {
        case SET_BOARDS:
            newState = { ...state, boards: action.boards }
            break
        case SET_BOARD:
            const updatedLabels = state.labels.map(label => {
                const existingLabel = action.board.labels.find(l => l.id === label.id)
                if (existingLabel) {
                    return { ...existingLabel }
                }
                else {
                    return label
                }
            })
            newState = { ...state, board: action.board, labels: updatedLabels, members: action.board.members || [] }
            // newState = { ...state, board: action.board, labels: action.board.labels.length ? action.board.labels : defaultLabels }
            break
        case REMOVE_BOARD:
            const lastRemovedBoard = state.boards.find((board) => board._id === action.boardId)
            boards = state.boards.filter((board) => board._id !== action.boardId)
            newState = { ...state, boards, lastRemovedBoard }
            break
        case ADD_BOARD:
            newState = { ...state, boards: [...state.boards, action.board] }
            break
        case UPDATE_BOARD:
            boards = state.boards.map((board) => (board._id === action.board._id ? action.board : board))
            newState = { ...state, boards, board: action.board }
            break
        case ADD_BOARD_LABELS:
            newState = { ...state, board: { ...state.board, labels: [...(state.board.labels || []), action.label] } }
            break
        case SET_LABELS:
            newState = { ...state, labels: action.labels }
            break
        default:
    }
    return newState
}

// unitTestReducer()

/* function unitTestReducer() {
    var state = initialState
    const board1 = { _id: 'b101', vendor: 'Board ' + parseInt(Math.random() * 10), msgs: [] }
    const board2 = { _id: 'b102', vendor: 'Board ' + parseInt(Math.random() * 10), msgs: [] }

    state = boardReducer(state, { type: SET_BOARDS, boards: [board1] })
    console.log('After SET_BOARDS:', state)

    state = boardReducer(state, { type: ADD_BOARD, board: board2 })
    console.log('After ADD_BOARD:', state)

    state = boardReducer(state, { type: UPDATE_BOARD, board: { ...board2, vendor: 'Good' } })
    console.log('After UPDATE_BOARD:', state)

    state = boardReducer(state, { type: REMOVE_BOARD, boardId: board2._id })
    console.log('After REMOVE_BOARD:', state)

    const msg = { id: 'm' + parseInt(Math.random() * 100), txt: 'Some msg' }
    state = boardReducer(state, { type: ADD_BOARD_MSG, boardId: board1._id, msg })
    console.log('After ADD_BOARD_MSG:', state)

    state = boardReducer(state, { type: REMOVE_BOARD, boardId: board1._id })
    console.log('After REMOVE_BOARD:', state)
}
 */
