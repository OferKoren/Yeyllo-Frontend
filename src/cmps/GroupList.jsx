import { useState } from "react"
import { GroupPreview } from "./GroupPreview";
import { makeId } from "../services/util.service";
import { updateBoard } from "../store/actions/board.actions";
import ClickOutside from "./ClickOutside";

export function GroupList({ onUpdateBoard, board }) {
    const [isAddGroupClicked, setIsAddGroupClicked] = useState(false)
    const [title, setTitle] = useState('')
    const [isGroupDeleted, setIsGroupDeleted] = useState(false)
    const [isLabelsClicked, setIsLabelsClicked] = useState(false)

    const { groups } = board
    console.log(groups);

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
        console.log(value)
        setTitle(value)
    }

    async function onAddGroup(ev) {
        ev.preventDefault()
        if (!title) return alert('Text field is required')

        const group = {
            id: makeId(),
            style: {},
            tasks: [],
            title: title
        }
        try {
            board.groups.push(group)
            await onUpdateBoard(board)
            // setTitle('')
            onCloseEditTitle()
            setIsAddGroupClicked(isClicked => !isClicked)
        } catch (err) {
            console.log('err: ', err);
        }
        // updateBoard(newBoard)
    }

    function onCloseEditTitle() {
        setIsAddGroupClicked(isClicked => !isClicked)
        setTitle('')
    }

    console.log(isAddGroupClicked);

    if (!board) return <div>Loading...</div>
    return (
        <section>
            <ul className="group-list flex">
                {groups.map(group =>
                    <li key={group.id}>
                        {/* <pre>{JSON.stringify(group, null, 2)}</pre> */}
                        <GroupPreview isLabelsClicked={isLabelsClicked} setIsLabelsClicked={setIsLabelsClicked} setIsGroupDeleted={setIsGroupDeleted} onUpdateBoard={onUpdateBoard} board={board} group={group} />
                    </li>)
                }
                {isAddGroupClicked ?
                    <ClickOutside onClick={() => setIsAddGroupClicked(isClicked => !isClicked)}>
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
