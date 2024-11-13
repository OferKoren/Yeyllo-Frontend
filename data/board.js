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
        'https://res.cloudinary.com/dkckt1l7i/image/upload/v1731148744/starry-night_ggz5qa.jpg',
        'https://res.cloudinary.com/dkckt1l7i/image/upload/v1731148744/mountains_ti0hmy.jpg',
        'https://res.cloudinary.com/dkckt1l7i/image/upload/v1731148744/trees_xhkuwr.jpg',
        'https://res.cloudinary.com/dkckt1l7i/image/upload/v1731148744/mountain_storm_hlf9te.jpg',
        'https://res.cloudinary.com/dkckt1l7i/image/upload/v1731216492/single_tree_h1h5fd.jpg',
        'https://res.cloudinary.com/dkckt1l7i/image/upload/v1731216497/sand_pvhh3h.jpg',
    ],
    colors: [
        'https://res.cloudinary.com/dkckt1l7i/image/upload/v1731148744/gradiant-snow_r7bxjj.svg',
        'https://res.cloudinary.com/dkckt1l7i/image/upload/v1731148742/gradiant-ocean_so8gk6.svg',
        'https://res.cloudinary.com/dkckt1l7i/image/upload/v1731148742/gradiant-crystal_bkqsso.svg',
        'https://res.cloudinary.com/dkckt1l7i/image/upload/v1731148742/gradiant-rainbow_phdwu0.svg',
        'https://res.cloudinary.com/dkckt1l7i/image/upload/v1731148742/gradiant-peach_xpkizy.svg',
        'https://res.cloudinary.com/dkckt1l7i/image/upload/v1731148744/gradiant-flower_eij2e0.svg',
        'https://res.cloudinary.com/dkckt1l7i/image/upload/v1731148742/gradiant-earth_aqwhww.svg',
        'https://res.cloudinary.com/dkckt1l7i/image/upload/v1731148742/gradiant-alien_eyltth.svg',
        'https://res.cloudinary.com/dkckt1l7i/image/upload/v1731148744/gradiant-volcano_mherm3.svg',
        'rgb(0, 121, 191)',
        'rgb(210, 144, 52)',
        'rgb(81, 152, 57)',
        'rgb(176, 70, 50)',
        'rgb(137, 96, 158)',
        'rgb(205, 90, 145)',
        'rgb(75, 191, 107)',
        'rgb(0, 174, 204)',
        'rgb(131, 140, 145)',
    ],
}

let boards = [
    {
        _id: 'b101',
        title: 'Robot dev proj',
        isStarred: true,
        archivedAt: null,
        createdBy: {
            _id: 'u101',
            fullname: 'Abi Abambi',
            imgUrl: '/img/user/gal.png',
        },
        style: {
            // backgroundSize: 'contain',
            backgroundImage: 'url(https://res.cloudinary.com/dkckt1l7i/image/upload/v1731148744/starry-night_ggz5qa.jpg)',
            backgroundColor: '',
        },
        labels: [
            {
                id: 'l101',
                title: 'Done',
                color: '#4BCE97',
            },
            {
                id: 'l102',
                title: 'Progress',
                color: '#F5CD47',
            },
        ],
        members: [
            {
                _id: 'u101',
                fullname: 'Abi Abambi',
                imgUrl: '/img/user/gal.png',
            },
            {
                _id: 'u102',
                fullname: 'Josh Ga',
                imgUrl: '/img/user/user-gal.png',
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
                        dueDate: '2024-11-11',
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
                                    imgUrl: '/img/user/gal.png',
                                },
                            },
                        ],
                        attachments: ['https://fonts.google.com/', 'https://trello.com/'],
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
                            imgUrl: '/img/user/gal.png',
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
                    imgUrl: '/img/user/gal.png',
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
            imgUrl: '/img/user/gal.png',
        },
        style: {
            // backgroundSize: 'contain',
            backgroundImage: 'url(https://res.cloudinary.com/dkckt1l7i/image/upload/v1731148744/trees_xhkuwr.jpg)',
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
                imgUrl: '/img/user/gal.png',
            },
            {
                _id: 'u102',
                fullname: 'Josh Ga',
                imgUrl: '/img/user/gal.png',
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
                                    imgUrl: '/img/user/gal.png',
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
                            imgUrl: '/img/user/gal.png',
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
                    imgUrl: '/img/user/gal.png',
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
            imgUrl: '/img/user/gal.png',
        },
        style: {
            // backgroundSize: 'contain',
            backgroundImage: 'url(https://res.cloudinary.com/dkckt1l7i/image/upload/v1731148742/gradiant-rainbow_phdwu0.svg)',
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
                imgUrl: '/img/user/gal.png',
            },
            {
                _id: 'u102',
                fullname: 'Josh Ga',
                imgUrl: '/img/user/gal.png',
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
                                    imgUrl: '/img/user/gal.png',
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
                            imgUrl: '/img/user/gal.png',
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
                    imgUrl: '/img/user/gal.png',
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
            imgUrl: '/img/user/gal.png',
        },
        style: {
            backgroundImage: 'url(https://res.cloudinary.com/dkckt1l7i/image/upload/v1731148744/gradiant-volcano_mherm3.svg)',
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
                imgUrl: '/img/user/gal.png',
            },
            {
                _id: 'u102',
                fullname: 'Josh Ga',
                imgUrl: '/img/user/gal.png',
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
                                    imgUrl: '/img/user/gal.png',
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
                            imgUrl: '/img/user/gal.png',
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
                    imgUrl: '/img/user/gal.png',
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
        title: "gal's board 2.0",
        isStarred: false,
        createdBy: {
            _id: 'u101',
            fullname: 'Abi Abambi',
            imgUrl: '/img/user/gal.png',
        },
        style: {
            backgroundImage: 'url(https://res.cloudinary.com/dkckt1l7i/image/upload/v1731148742/gradiant-crystal_bkqsso.svg)',
        },
        urls: {
            regular: 'https://res.cloudinary.com/dkckt1l7i/image/upload/v1731148742/gradiant-crystal_bkqsso.svg',
        },
        labels: [],
        members: [
            {
                _id: 'u101',
                fullname: 'Abi Abambi',
                imgUrl: '/img/user/gal.png',
            },
        ],
        groups: [
            {
                id: '5vULUA',
                style: {},
                tasks: [
                    {
                        id: 'U5fuzk',
                        title: 'sds',
                        memberIds: ['u101'],
                    },
                ],
                title: 'asda',
            },
        ],
        activites: [],
        createdAt: 1731412138862,
        _id: 'EkXjV',
    },
    {
        title: 'Demo trello',
        isStarred: true,
        createdBy: {
            _id: 'u101',
            fullname: 'Abi Abambi',
            imgUrl: '/img/user/gal.png',
        },
        style: {
            backgroundImage:
                'url(https://images.unsplash.com/photo-1547483238-f400e65ccd56?crop=entropy&cs=srgb&fm=jpg&ixid=M3w2NzM1Nzl8MHwxfHNlYXJjaHw1fHxwYXRhZ29uaWF8ZW58MHx8fHwxNzMxNDEyOTk3fDA&ixlib=rb-4.0.3&q=85)',
        },
        urls: {
            regular:
                'https://images.unsplash.com/photo-1547483238-f400e65ccd56?crop=entropy&cs=srgb&fm=jpg&ixid=M3w2NzM1Nzl8MHwxfHNlYXJjaHw1fHxwYXRhZ29uaWF8ZW58MHx8fHwxNzMxNDEyOTk3fDA&ixlib=rb-4.0.3&q=85',
        },
        labels: [],
        members: [
            {
                _id: 'u101',
                fullname: 'Abi Abambi',
                imgUrl: '/img/user/gal.png',
            },
        ],
        groups: [
            {
                id: 'lOJYox',
                style: {},
                tasks: [
                    {
                        id: '8pj5Fw',
                        title: 'Create backend services',
                    },
                    {
                        id: '9Cb5A2',
                        title: 'Routing Directory',
                        dueDate: '11/28/2024',
                        dueTime: '02:10 PM',
                        status: 'inProgress',
                        labelIds: ['l105'],
                        description: 'decasdkasdasdasdas',
                        memberIds: ['u101'],
                    },
                    {
                        id: 'RSnLHo',
                        title: 'Database implemention',
                        description: 'asdasdasdas',
                        labelIds: ['l102', 'l104'],
                        checklists: [
                            {
                                id: 'HTeaQl',
                                title: 'Checklist',
                                todos: [
                                    {
                                        id: '9wJbMJ',
                                        title: 'asdasd',
                                        isDone: false,
                                    },
                                ],
                                doneTodosPercent: 0,
                            },
                        ],
                    },
                    {
                        id: 'MhEmBr',
                        title: 'Data model approvel',
                        dueDate: '11/21/2024',
                        dueTime: '02:12 PM',
                        status: 'done',
                        checklists: [
                            {
                                id: 'W5ORF7',
                                title: 'Checklissadt',
                                todos: [
                                    {
                                        id: 'MY9Mdr',
                                        title: 'asd',
                                        isDone: true,
                                    },
                                    {
                                        id: 'kPvV2T',
                                        title: 'asfdasfsdafas',
                                        isDone: false,
                                    },
                                    {
                                        id: 'bpWksA',
                                        title: 'asdasdasdasd',
                                        isDone: false,
                                    },
                                ],
                                doneTodosPercent: 33.33333333333333,
                            },
                        ],
                    },
                    {
                        id: 'v6HQXx',
                        title: 'Create a server with expresss',
                    },
                    {
                        id: '32dzTA',
                        title: 'implement Sass',
                        memberIds: ['u101'],
                    },
                    {
                        id: 'gl96s1',
                        title: 'more stuff to do',
                        memberIds: ['u101'],
                    },
                ],
                title: 'Backlog-server',
            },
            {
                id: 'wo1iMD',
                style: {
                    backgroundColor: '#F8E6A0',
                },
                tasks: [
                    {
                        id: 'dXuCti',
                        title: 'Planning the components tree',
                        style: {
                            backgroundColor: '#4BCE97',
                        },
                        labelIds: ['l101', 'l102', 'l104'],
                        dueDate: '11/24/2024',
                        dueTime: '02:15 PM',
                        status: 'inProgress',
                    },
                    {
                        id: 'ngNJ3Q',
                        title: 'Add taskDetails',
                        checklists: [
                            {
                                id: '419fSR',
                                title: 'Checklist',
                                todos: [
                                    {
                                        id: 'qJAExJ',
                                        title: 'sdasd',
                                        isDone: false,
                                    },
                                    {
                                        id: 'L8fvtw',
                                        title: 'asda',
                                        isDone: false,
                                    },
                                    {
                                        id: 'U8J4xD',
                                        title: 'asdasd',
                                        isDone: true,
                                    },
                                    {
                                        id: 'hgDzqp',
                                        title: 'asdasd',
                                        isDone: false,
                                    },
                                    {
                                        id: '4kmo3O',
                                        title: 'vsv',
                                        isDone: true,
                                    },
                                    {
                                        id: 'DQmICe',
                                        title: 'wewe',
                                        isDone: false,
                                    },
                                ],
                                doneTodosPercent: 33.33333333333333,
                            },
                        ],
                        memberIds: ['u101'],
                    },
                    {
                        id: 'EGFoNf',
                        title: 'Adding npm libararies',
                    },
                    {
                        id: 'jR0Fuf',
                        title: 'Build basic temlate',
                    },
                    {
                        id: 'EepCsp',
                        title: 'Connect sockets',
                    },
                ],
                title: 'Backlog-client',
            },
            {
                id: 'AFWVnp',
                style: {
                    backgroundColor: '#D3F1A7',
                },
                tasks: [
                    {
                        id: 'hMUm67',
                        title: 'Sanity test for new componenet',
                        labelIds: ['l102'],
                        dueDate: '11/07/2024',
                        dueTime: '02:35 PM',
                        status: 'inProgress',
                        style: {
                            backgroundColor: '#4BCE97',
                        },
                    },
                    {
                        id: 'qZSPMN',
                        title: 'function testing for app header',
                        style: {
                            backgroundColor: '#F5CD47',
                        },
                        dueDate: '12/01/2024',
                        dueTime: '02:35 PM',
                        status: 'done',
                        description: 'asdasd',
                        labelIds: ['l102', 'l103'],
                    },
                    {
                        id: 'lJKkIh',
                        title: 'connect to pwa',
                        description: 'asasdas',
                        style: {
                            backgroundColor: '#E774BB',
                        },
                        checklists: [
                            {
                                id: 'e4pyoS',
                                title: 'Checklistas',
                                todos: [
                                    {
                                        id: 'nEwHRt',
                                        title: 'ad',
                                        isDone: false,
                                    },
                                    {
                                        id: '29gBJi',
                                        title: 'asdasd',
                                        isDone: false,
                                    },
                                    {
                                        id: 'R8LJz5',
                                        title: 'asdasd',
                                        isDone: false,
                                    },
                                ],
                                doneTodosPercent: 0,
                            },
                        ],
                    },
                    {
                        id: 'OwGCCv',
                        title: 'more stuff ',
                    },
                ],
                title: 'In Development',
            },
            {
                id: 'AaddpC',
                style: {},
                tasks: [
                    {
                        id: 'rZbRMb',
                        title: 'Css variables',
                        style: {
                            backgroundColor: '#579DFF',
                        },
                        labelIds: ['l102', 'l103'],
                        memberIds: ['u101'],
                        description: 'asdasd',
                    },
                    {
                        id: 'e9FZ4o',
                        title: 'Making functions and mixins',
                        checklists: [
                            {
                                id: 'o00Hhj',
                                title: 'Checklist',
                                todos: [
                                    {
                                        id: 'HSA8j3',
                                        title: 'dw',
                                        isDone: true,
                                    },
                                    {
                                        id: 'cRisLn',
                                        title: 'two',
                                        isDone: true,
                                    },
                                    {
                                        id: 'kPY8BI',
                                        title: 'three',
                                        isDone: true,
                                    },
                                ],
                                doneTodosPercent: 100,
                            },
                        ],
                        description: 'asasdasdasd',
                        style: {
                            backgroundColor: '#8590A2',
                        },
                    },
                    {
                        id: 'BU3rIw',
                        title: 'Css directory',
                        dueDate: '11/12/2024',
                        dueTime: '02:37 PM',
                        status: 'inProgress',
                        description: 'more stiff\n',
                        memberIds: ['u101'],
                    },
                    {
                        id: '6T8kBL',
                        title: 'Creating node.js server',
                    },
                    {
                        id: 'sLc4ao',
                        title: 'https://www.npmjs.com/package/@material-ui/core',
                    },
                ],
                title: 'Done',
            },
            {
                id: 'iWgacm',
                style: {
                    backgroundColor: '#CCE0FF',
                },
                tasks: [
                    {
                        id: 'PksJtR',
                        title: 'Metting with head manager for planning the code progress',
                        labelIds: ['l106', 'l104'],
                    },
                    {
                        id: 'BRHjLp',
                        title: 'End day code review with all member',
                        labelIds: ['l103'],
                        dueDate: '11/26/2024',
                        dueTime: '02:39 PM',
                        status: 'inProgress',
                    },
                    {
                        id: 'UNXZv2',
                        title: 'taking a break in the woods',
                        style: {
                            backgroundColor: '#9F8FEF',
                        },
                    },
                    {
                        id: 'UwjTvd',
                        title: 'Advice from head manager',
                        checklists: [
                            {
                                id: 'TKJSdB',
                                title: 'Checklist',
                                todos: [
                                    {
                                        id: 'LfI4tN',
                                        title: 'ds',
                                        isDone: false,
                                    },
                                    {
                                        id: 'lDJNW0',
                                        title: 'sdss',
                                        isDone: true,
                                    },
                                ],
                                doneTodosPercent: 50,
                            },
                        ],
                    },
                ],
                title: 'QA',
            },
            {
                id: 'lqb7Ei',
                style: {},
                tasks: [
                    {
                        id: 'xc4e1r',
                        title: 'Creating db with mongo',
                        style: {
                            backgroundColor: '#F5CD47',
                        },
                    },
                    {
                        id: 'yrJaSn',
                        title: 'App header',
                        style: {
                            backgroundColor: '#94C748',
                        },
                    },
                ],
                title: 'Ready for production',
            },
            {
                id: 'xnk4Hm',
                style: {
                    backgroundColor: '#BAF3DB',
                },
                tasks: [],
                title: 'Sales',
            },
        ],
        activites: [],
        createdAt: 1731413007790,
        _id: 'xHEdg',
    },
]
const workspace = { title: 'workspace of awesome', memebers: [] }
export const boardData = {
    workspace,
    boards,
    backgroundPallet,
}
const user = {
    _id: 'u101',
    fullname: 'Abi Abambi',
    username: 'abi@ababmi.com',
    password: 'aBambi123',
    imgUrl: '/img/user/gal.png',
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
