// Guidelines
// boardStore (no need for groupStore, taskStore), boardService
// *. Support saving the entire board and also on the task level,
// *. No need for saving an activities array per task,
// *. those activities are easily filtered from the board activities

// *. activites - when board is updated, the frontend does not send the activities
//    array within the board
//    instead it only sends a new activity object: {txt, boardId, groupId, taskId}
//    the backend adds this activity to the board with $push and can also emit socket notificatios

// *. D & D Guidelines - vue-smooth-dnd / vuedraggable / react-beutiful-dnd
// *. Same model for Monday style app (do not implement a generic columns feature)
// *. We do not handle concurrent editing - needs versioning
import { makeId } from '../src/services/util.service.js'
// Rendering performance:
// Store Mutation - saveBoard
// As start - you can replace the entire board
// Later, support switching a specific task

// <BoardDetails> => <BoardGroup v-for / map>
// <BoardGroup> => <TaskPreview v-for / map>

// <TaskDetails> (supports edit)
// To facilitate working in a team, you can
// initially make this a seperate route
// (later on we can place it in a modal and nested route)

// Activities are board / group / task related
// The comment feature can be implemented with activity

/* const activity = {
    id: makeId(),
    txt: 'Changed Color',
    createdAt: Date.now(),
    byMember: userService.getLoggedinUser(),
    group: group, // optional
    task: task, // optional
} */

// Store - saveTask
function storeSaveTask(boardId, groupId, task, activity) {
    board = boardService.saveTask(boardId, groupId, task, activity)
    // commit(ACTION) // dispatch(ACTION)
}

// boardService
function saveTask(boardId, groupId, task, activity) {
    const board = getById(boardId)
    // PUT /api/board/b123/task/t678

    // TODO: find the task, and update
    board.activities.unshift(activity)
    saveBoard(board)
    // return board
    // return task
}
const backgroundPallet = {
    photos: [
        'img/board-background-img/starry-night.jpeg',
        'img/board-background-img/mountains.jpeg',
        'img/board-background-img/trees.jpeg',
        'img/board-background-img/mountain_storm.jpeg',
    ],
    colors: [
        'img/board-background-img/gradiant-snow.svg',
        'img/board-background-img/gradiant-ocean.svg',
        'img/board-background-img/gradiant-crystal.svg',
        'img/board-background-img/gradiant-rainbow.svg',
        'img/board-background-img/gradiant-peach.svg',
        'img/board-background-img/gradiant-flower.svg',
        'img/board-background-img/gradiant-earth.svg',
        'img/board-background-img/gradiant-alien.svg',
        'img/board-background-img/gradiant-volcano.svg',
    ],
}
const board = [
    {
        _id: 'b101',
        title: 'Robot dev proj',
        isStarred: false,
        archivedAt: null,
        createdBy: {
            _id: 'u101',
            fullname: 'Abi Abambi',
            imgUrl: 'http://some-img',
        },
        style: {
            backgroundSize: 'contain',
            backgroundImage: 'url(../img/board-background-img/gradiant-snow.svg)',
            backgroundColor: '',
        },
        labels: [
            {
                id: 'l101',
                title: 'Done',
                color: '#61bd4f',
            },
            {
                id: 'l102',
                title: 'Progress',
                color: '#61bd33',
            },
        ],
        members: [
            {
                _id: 'u101',
                fullname: 'Tal Taltal',
                imgUrl: 'https://www.google.com',
            },
            {
                _id: 'u102',
                fullname: 'Josh Ga',
                imgUrl: 'https://www.google.com',
            },
        ],
        groups: [
            {
                id: 'g101',
                title: 'Group 1',
                archivedAt: 1589983468418,
                tasks: [
                    {
                        id: 'c101',
                        title: 'Replace logo',
                    },
                    {
                        id: 'c102',
                        title: 'Add Samples',
                    },
                ],
                style: {},
            },
            {
                id: 'g102',
                title: 'Group 2',
                tasks: [
                    {
                        id: 'c103',
                        title: 'Do that',
                        archivedAt: 1589983468418,
                    },
                    {
                        id: 'c104',
                        title: 'Help me',
                        status: 'inProgress', // monday / both
                        priority: 'high', // monday / both
                        dueDate: '2024-09-24',
                        description: 'description',
                        comments: [
                            // in Trello this is easier implemented as an activity
                            {
                                id: 'ZdPnm',
                                title: 'also @yaronb please CR this',
                                createdAt: 1590999817436,
                                byMember: {
                                    _id: 'u101',
                                    fullname: 'Tal Tarablus',
                                    imgUrl: '',
                                },
                            },
                        ],
                        checklists: [
                            {
                                id: 'YEhmF',
                                title: 'Checklist',
                                todos: [
                                    {
                                        id: '212jX',
                                        title: 'To Do 1',
                                        isDone: false,
                                    },
                                ],
                            },
                        ],
                        memberIds: ['u101'],
                        labelIds: ['l101', 'l102'],
                        byMember: {
                            _id: 'u101',
                            fullname: 'Tal Tarablus',
                            imgUrl: '',
                        },
                        style: {
                            backgroundColor: '#26de81',
                        },
                    },
                ],
                style: {},
            },
        ],
        activities: [
            {
                id: 'a101',
                title: 'Changed Color',
                createdAt: 154514,
                byMember: {
                    _id: 'u101',
                    fullname: 'Abi Abambi',
                    imgUrl: 'http://some-img',
                },
                group: {
                    id: 'g101',
                    title: 'Urgent Stuff',
                },
                task: {
                    id: 'c101',
                    title: 'Replace Logo',
                },
            },
        ],

        // For Monday draggable columns (optional)
        cmpsOrder: ['StatusPicker', 'MemberPicker', 'DatePicker'],
    },
    {
        _id: 'ascasc',
        title: 'vacation to prag',
        isStarred: false,
        archivedAt: null,
        createdBy: {
            _id: 'u101',
            fullname: 'Abi Abambi',
            imgUrl: 'http://some-img',
        },
        style: {
            backgroundSize: 'contain',
            backgroundImage: 'url(../img/board-background-img/starry-night.jpeg)',
            backgroundColor: 'green',
        },
        labels: [
            {
                id: 'l101',
                title: 'Done',
                color: '#61bd4f',
            },
            {
                id: 'l102',
                title: 'Progress',
                color: '#61bd33',
            },
        ],
        members: [
            {
                _id: 'u101',
                fullname: 'Tal Taltal',
                imgUrl: 'https://www.google.com',
            },
            {
                _id: 'u102',
                fullname: 'Josh Ga',
                imgUrl: 'https://www.google.com',
            },
        ],
        groups: [
            {
                id: 'g101',
                title: 'Group 1',
                archivedAt: 1589983468418,
                tasks: [
                    {
                        id: 'c101',
                        title: 'Replace logo',
                    },
                    {
                        id: 'c102',
                        title: 'Add Samples',
                    },
                ],
                style: {},
            },
            {
                id: 'g102',
                title: 'Group 2',
                tasks: [
                    {
                        id: 'c103',
                        title: 'Do that',
                        archivedAt: 1589983468418,
                    },
                    {
                        id: 'c104',
                        title: 'Help me',
                        status: 'inProgress', // monday / both
                        priority: 'high', // monday / both
                        dueDate: '2024-09-24',
                        description: 'description',
                        comments: [
                            // in Trello this is easier implemented as an activity
                            {
                                id: 'ZdPnm',
                                title: 'also @yaronb please CR this',
                                createdAt: 1590999817436,
                                byMember: {
                                    _id: 'u101',
                                    fullname: 'Tal Tarablus',
                                    imgUrl: '',
                                },
                            },
                        ],
                        checklists: [
                            {
                                id: 'YEhmF',
                                title: 'Checklist',
                                todos: [
                                    {
                                        id: '212jX',
                                        title: 'To Do 1',
                                        isDone: false,
                                    },
                                ],
                            },
                        ],
                        memberIds: ['u101'],
                        labelIds: ['l101', 'l102'],
                        byMember: {
                            _id: 'u101',
                            fullname: 'Tal Tarablus',
                            imgUrl: '',
                        },
                        style: {
                            backgroundColor: '#26de81',
                        },
                    },
                ],
                style: {},
            },
        ],
        activities: [
            {
                id: 'a101',
                title: 'Changed Color',
                createdAt: 154514,
                byMember: {
                    _id: 'u101',
                    fullname: 'Abi Abambi',
                    imgUrl: 'http://some-img',
                },
                group: {
                    id: 'g101',
                    title: 'Urgent Stuff',
                },
                task: {
                    id: 'c101',
                    title: 'Replace Logo',
                },
            },
        ],

        // For Monday draggable columns (optional)
        cmpsOrder: ['StatusPicker', 'MemberPicker', 'DatePicker'],
    },
    {
        _id: '1asdaasdasd',
        title: 'budget managment',
        isStarred: false,
        archivedAt: null,
        createdBy: {
            _id: 'u101',
            fullname: 'Abi Abambi',
            imgUrl: 'http://some-img',
        },
        style: {
            backgroundSize: 'contain',
            backgroundImage: 'url(../img/board-background-img/gradiant-volcano.svg)',
            backgroundColor: 'purple',
        },
        labels: [
            {
                id: 'l101',
                title: 'Done',
                color: '#61bd4f',
            },
            {
                id: 'l102',
                title: 'Progress',
                color: '#61bd33',
            },
        ],
        members: [
            {
                _id: 'u101',
                fullname: 'Tal Taltal',
                imgUrl: 'https://www.google.com',
            },
            {
                _id: 'u102',
                fullname: 'Josh Ga',
                imgUrl: 'https://www.google.com',
            },
        ],
        groups: [
            {
                id: 'g101',
                title: 'Group 1',
                archivedAt: 1589983468418,
                tasks: [
                    {
                        id: 'c101',
                        title: 'Replace logo',
                    },
                    {
                        id: 'c102',
                        title: 'Add Samples',
                    },
                ],
                style: {},
            },
            {
                id: 'g102',
                title: 'Group 2',
                tasks: [
                    {
                        id: 'c103',
                        title: 'Do that',
                        archivedAt: 1589983468418,
                    },
                    {
                        id: 'c104',
                        title: 'Help me',
                        status: 'inProgress', // monday / both
                        priority: 'high', // monday / both
                        dueDate: '2024-09-24',
                        description: 'description',
                        comments: [
                            // in Trello this is easier implemented as an activity
                            {
                                id: 'ZdPnm',
                                title: 'also @yaronb please CR this',
                                createdAt: 1590999817436,
                                byMember: {
                                    _id: 'u101',
                                    fullname: 'Tal Tarablus',
                                    imgUrl: '',
                                },
                            },
                        ],
                        checklists: [
                            {
                                id: 'YEhmF',
                                title: 'Checklist',
                                todos: [
                                    {
                                        id: '212jX',
                                        title: 'To Do 1',
                                        isDone: false,
                                    },
                                ],
                            },
                        ],
                        memberIds: ['u101'],
                        labelIds: ['l101', 'l102'],
                        byMember: {
                            _id: 'u101',
                            fullname: 'Tal Tarablus',
                            imgUrl: '',
                        },
                        style: {
                            backgroundColor: '#26de81',
                        },
                    },
                ],
                style: {},
            },
        ],
        activities: [
            {
                id: 'a101',
                title: 'Changed Color',
                createdAt: 154514,
                byMember: {
                    _id: 'u101',
                    fullname: 'Abi Abambi',
                    imgUrl: 'http://some-img',
                },
                group: {
                    id: 'g101',
                    title: 'Urgent Stuff',
                },
                task: {
                    id: 'c101',
                    title: 'Replace Logo',
                },
            },
        ],

        // For Monday draggable columns (optional)
        cmpsOrder: ['StatusPicker', 'MemberPicker', 'DatePicker'],
    },
    {
        _id: '1asdaasdasdsd',
        title: 'renovating the house',
        isStarred: false,
        archivedAt: null,
        createdBy: {
            _id: 'u101',
            fullname: 'Abi Abambi',
            imgUrl: 'http://some-img',
        },
        style: {
            backgroundImage: '',
        },
        labels: [
            {
                id: 'l101',
                title: 'Done',
                color: '#61bd4f',
            },
            {
                id: 'l102',
                title: 'Progress',
                color: '#61bd33',
            },
        ],
        members: [
            {
                _id: 'u101',
                fullname: 'Tal Taltal',
                imgUrl: 'https://res.cloudinary.com/dw6sluje4/image/upload/v1731063220/person-icon_uctjec.png',
            },
            {
                _id: 'u102',
                fullname: 'Josh Ga',
                imgUrl: 'https://res.cloudinary.com/dw6sluje4/image/upload/v1731063220/person-icon_uctjec.png',
            },
        ],
        groups: [
            {
                id: 'g101',
                title: 'Group 1',
                archivedAt: 1589983468418,
                tasks: [
                    {
                        id: 'c101',
                        title: 'Replace logo',
                    },
                    {
                        id: 'c102',
                        title: 'Add Samples',
                    },
                ],
                style: {},
            },
            {
                id: 'g102',
                title: 'Group 2',
                tasks: [
                    {
                        id: 'c103',
                        title: 'Do that',
                        archivedAt: 1589983468418,
                    },
                    {
                        id: 'c104',
                        title: 'Help me',
                        status: 'inProgress', // monday / both
                        priority: 'high', // monday / both
                        dueDate: '2024-09-24',
                        description: 'description',
                        comments: [
                            // in Trello this is easier implemented as an activity
                            {
                                id: 'ZdPnm',
                                title: 'also @yaronb please CR this',
                                createdAt: 1590999817436,
                                byMember: {
                                    _id: 'u101',
                                    fullname: 'Tal Tarablus',
                                    imgUrl: '',
                                },
                            },
                        ],
                        checklists: [
                            {
                                id: 'YEhmF',
                                title: 'Checklist',
                                todos: [
                                    {
                                        id: '212jX',
                                        title: 'To Do 1',
                                        isDone: false,
                                    },
                                ],
                            },
                        ],
                        memberIds: ['u101'],
                        labelIds: ['l101', 'l102'],
                        byMember: {
                            _id: 'u101',
                            fullname: 'Tal Tarablus',
                            imgUrl: '',
                        },
                        style: {
                            backgroundColor: '#26de81',
                        },
                    },
                ],
                style: {},
            },
        ],
        activities: [
            {
                id: 'a101',
                title: 'Changed Color',
                createdAt: 154514,
                byMember: {
                    _id: 'u101',
                    fullname: 'Abi Abambi',
                    imgUrl: 'http://some-img',
                },
                group: {
                    id: 'g101',
                    title: 'Urgent Stuff',
                },
                task: {
                    id: 'c101',
                    title: 'Replace Logo',
                },
            },
        ],

        // For Monday draggable columns (optional)
        cmpsOrder: ['StatusPicker', 'MemberPicker', 'DatePicker'],
    },
]

export const boardData = {
    board,
    backgroundPallet,
}
const user = {
    _id: 'u101',
    fullname: 'Abi Abambi',
    username: 'abi@ababmi.com',
    password: 'aBambi123',
    imgUrl: 'http://some-img.jpg',
    mentions: [
        {
            //optional
            id: 'm101',
            boardId: 'm101',
            taskId: 't101',
        },
    ],
}

// <LabelPicker info={} onUpdate={} />
// <MemberPicker info={} onUpdate={} />
// <DatePicker info={} onUpdate={} />

// <DynamicPicker info={} onUpdate={} >

// For Monday Mostly:
// Dynamic Components:

function updateTask(cmpType, data) {
    // Switch by cmpType
    // case MEMBERS:
    //    task.members = data
    //    activity = boardService.getEmptyActivity()
    //    activity.txt = `Members changed for task ${}`
    //    activity.task = '{mini-task}'
    // case STATUS:
    //    task.status = data
    // dispatch to store: updateTask(task, activity)
}

const cmp1 = {
    type: 'StatusPicker',
    info: {
        selectedStatus: 'pending',
        statuses: [{}, {}],
    },
}

const cmp2 = {
    type: 'MemberPicker',
    info: {
        selectedMembers: ['m1', 'm2'],
        members: ['m1', 'm2', 'm3'],
    },
}

const cmp3 = {
    type: 'DatePicker',
    info: {
        selectedDate: '2022-09-07',
    },
}

// Code Ideas in React
/* export function TaskPreview({ task }) {
    const cmpsOrder = ['StatusPicker', 'MemberPicker', 'DatePicker', 'PriorityPicker']
    return (
        <section>
            <h5>{task.txt}</h5>
            {cmpsOrder.map((cmp, idx) => {
                return (
                    <DynamicCmp
                        cmp={cmp}
                        key={idx}
                        onUpdate={(data) => {
                            console.log('Updating: ', cmp, 'with data:', data)
                            // make a copy, update the task, create an action
                            // Call action: updateTask(task, action)
                        }}
                    />
                )
            })}
        </section>
    )
}

export function DynamicCmp({ cmp, info, onUpdate }) {
    switch (cmp) {
        case 'StatusPicker':
            return <StatusPicker info={info} onUpdate={onUpdate} />
        case 'MemberPicker':
            return <MemberPicker info={info} onUpdate={onUpdate} />
        default:
            return <p>UNKNOWN {cmp}</p>
    }
}
 */
// Vue.js Syntax:
// <TaskPreview> => <tr>
//    <td v-for="(cmpType) in cmpsOrder">
//         <Component :is="cmpType" :info="getCmpInfo(cmpType)" @updated="updateTask(cmpType, $event)">
//    </td>
// </tr>
