import { useState } from 'react'
import { GroupPreview } from './GroupPreview'
import { makeId } from '../services/util.service'
import { updateBoard } from '../store/actions/board.actions'
import ClickOutside from './ClickOutside'
import { getEmptyGroup } from '../services/board'
import { Draggable } from 'react-beautiful-dnd'
import { useSelector } from 'react-redux'
import { showErrorMsg } from '../services/event-bus.service'

export function GroupList({ placeholder, onUpdateBoard, board, originBoard }) {
    const [isAddGroupClicked, setIsAddGroupClicked] = useState(false)
    const [title, setTitle] = useState('')
    const [isGroupDeleted, setIsGroupDeleted] = useState(false)
    const [isLabelsClicked, setIsLabelsClicked] = useState(false)
    const user = useSelector((storeState) => storeState.userModule.user)

    const [isModalOpen, setIsModalOpen] = useState(false)

    const { groups } = board

    function handleChange(ev) {
        const type = ev.target.type
        const field = ev.target.name
        let value = ev.target.value

        switch (type) {
            case 'text':
                break
            case 'number': {
                value = +ev.target.value || ''
                break
            }
        }
        setTitle(value)
    }

    async function onAddGroup(ev) {
        ev.preventDefault()
        if (!title) return showErrorMsg('Text field is required')

        const group = getEmptyGroup()
        group.title = title

        // const group = {
        //     id: makeId(),
        //     style: {},
        //     tasks: [],
        //     title: title
        // }

        const activity = {
            txt: `added list "${group.title}" to this board`,
            boardId: board._id,
            groupId: group.id,
            taskId: null,
            byMember: { _id: user._id, fullname: user.fullname, imgUrl: user.imgUrl },
            createdAt: Date.now(),
        }

        try {
            // const changeBoard = board
            const changeBoard = board
            changeBoard.groups.push(group)
            await onUpdateBoard(changeBoard, activity)
            onCloseEditTitle()
            setIsAddGroupClicked((isClicked) => !isClicked)
        } catch (err) {
            console.log('err: ', err)
        }
    }

    function onCloseEditTitle() {
        setIsAddGroupClicked((isClicked) => !isClicked)
        setTitle('')
    }

    if (!board._id)
        return (
            <div className="trello-loader">
                <img src="\img\general\trello-loader.svg" alt="" />
            </div>
        )
    return (
        <section>
            <ul className="group-list flex">
                {groups.map((group, index) => (
                    <Draggable isDragDisabled={isModalOpen} draggableId={group.id} key={group.id} index={index}>
                        {(provided, snapshot) => (
                            <div className="group" {...provided.dragHandleProps} {...provided.draggableProps} ref={provided.innerRef}>
                                <li
                                    style={{ ...group.style, rotate: snapshot.isDragging ? '5deg' : '', opacity: snapshot.isDragging ? '0.5' : '' }}
                                    className={group.isCollapse ? `collapse ${group.id} ${group?.style?.backgroundColor?.substr(1)}` : group.id}
                                    key={group.id}
                                >
                                    {/* <pre>{JSON.stringify(group, null, 2)}</pre> */}
                                    <GroupPreview
                                        isModalOpen={isModalOpen}
                                        setIsModalOpen={setIsModalOpen}
                                        isLabelsClicked={isLabelsClicked}
                                        setIsLabelsClicked={setIsLabelsClicked}
                                        setIsGroupDeleted={setIsGroupDeleted}
                                        onUpdateBoard={onUpdateBoard}
                                        board={board}
                                        originBoard={originBoard}
                                        originGroup={originBoard.groups[index]}
                                        group={group}
                                    />
                                </li>
                            </div>
                        )}
                    </Draggable>
                ))}
                {placeholder}

                {isAddGroupClicked ? (
                    <ClickOutside className="container-first-add-group" onClick={() => setIsAddGroupClicked((isClicked) => !isClicked)}>
                        <div className="add-group-container">
                            <form onSubmit={onAddGroup}>
                                <input
                                    autoFocus
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={title}
                                    placeholder="Enter list name..."
                                    onChange={handleChange}
                                />
                                <div className="add-group-btns">
                                    <button>Add list</button>
                                    <button className="close-btn-x" onClick={onCloseEditTitle} type="button">
                                        <img src="\img\board-details\close-icon.png" alt="" />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </ClickOutside>
                ) : (
                    <button onClick={() => setIsAddGroupClicked((isClicked) => !isClicked)} className="add-group-btn flex align-center">
                        <img style={{ width: '1.5em', marginRight: '0.5em' }} src="/img/add-group/plus-icon.png" alt="" />
                        Add another list
                    </button>
                )}
            </ul>
        </section>
    )
}
