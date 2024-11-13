import { useState } from "react"
import { GroupPreview } from "./GroupPreview";
import { makeId } from "../services/util.service";
import { updateBoard } from "../store/actions/board.actions";
import ClickOutside from "./ClickOutside";
import { getEmptyGroup } from "../services/board";
import { Draggable } from "react-beautiful-dnd";

export function GroupList({ onUpdateBoard, board }) {
    const [isAddGroupClicked, setIsAddGroupClicked] = useState(false)
    const [title, setTitle] = useState('')
    const [isGroupDeleted, setIsGroupDeleted] = useState(false)
    const [isLabelsClicked, setIsLabelsClicked] = useState(false)

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
        if (!title) return alert('Text field is required')

        const group = getEmptyGroup()
        group.title = title

        // const group = {
        //     id: makeId(),
        //     style: {},
        //     tasks: [],
        //     title: title
        // }

        try {
            const changeBoard = board
            changeBoard.groups.push(group)
            await onUpdateBoard(changeBoard)
            onCloseEditTitle()
            setIsAddGroupClicked(isClicked => !isClicked)
        } catch (err) {
            console.log('err: ', err);
        }
    }

    function onCloseEditTitle() {
        setIsAddGroupClicked(isClicked => !isClicked)
        setTitle('')
    }


    if (!board) return <div className='trello-loader'><img src="\img\general\trello-loader.svg" alt="" /></div>
    return (
        <section>
            <ul className="group-list flex">
                {groups.map((group, index) =>
                    <Draggable draggableId={group.id} key={group.id} index={index}>
                        {(provided) => (
                            <div  {...provided.dragHandleProps} {...provided.draggableProps} ref={provided.innerRef}>
                                <li className="group-list-li" style={{...group.style }} className={group.id} key={group.id}>
                                    {/* <pre>{JSON.stringify(group, null, 2)}</pre> */}
                                    <GroupPreview isLabelsClicked={isLabelsClicked} setIsLabelsClicked={setIsLabelsClicked} setIsGroupDeleted={setIsGroupDeleted} onUpdateBoard={onUpdateBoard} board={board} group={group} />
                                </li>
                            </div>
                        )}
                    </Draggable>)
                }                
                {isAddGroupClicked ?
                    <ClickOutside className="container-first-add-group" onClick={() => setIsAddGroupClicked(isClicked => !isClicked)}>
                        <div className="add-group-container">
                            <form onSubmit={onAddGroup}>
                                <input autoFocus type="text" id="title" name="title" value={title} placeholder="Enter list name..." onChange={handleChange} />
                                <div className="add-group-btns">
                                    <button>Add list</button>
                                    <button className="close-btn-x" onClick={onCloseEditTitle} type="button"><img src="\img\board-details\close-icon.png" alt="" /></button>
                                </div>
                            </form>
                        </div>
                    </ClickOutside>
                    : <button onClick={() => setIsAddGroupClicked(isClicked => !isClicked)} className="add-group-btn flex align-center"><img style={{ width: "1.5em", marginRight: "0.5em" }} src="/img/add-group/plus-icon.png" alt="" />Add another list</button>}
            </ul>
        </section >
    )
}
