import { useState } from "react"
import { GroupPreview } from "./GroupPreview";
import { makeId } from "../services/util.service";
import { updateBoard } from "../store/actions/board.actions";

export function GroupList({ onUpdateBoard, board }) {
    const [isAddGroupClicked, setIsAddGroupClicked] = useState(false)
    const [title, setTitle] = useState('')

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
            setIsAddGroupClicked(isClicked => !isClicked)
        } catch (err) {
            console.log('err: ', err);
        }
        // updateBoard(newBoard)
    }

    console.log(isAddGroupClicked);

    if (!board) return <div>Loading...</div>
    return (
        <section>
            <ul className="group-list flex">
                {groups.map(group =>
                    <li key={group.id}>
                        {/* <pre>{JSON.stringify(group, null, 2)}</pre> */}
                        <GroupPreview group={group} />
                    </li>)
                }
                {isAddGroupClicked ?
                    <div className="add-group-container">
                        <form onSubmit={onAddGroup}>
                            <input type="text" id="title" name="title" value={title} onChange={handleChange} />
                            <button>Add list</button>
                            <button onClick={() => setIsAddGroupClicked(isClicked => !isClicked)} type="button">X</button>
                        </form>
                    </div>
                    : <button onClick={() => setIsAddGroupClicked(isClicked => !isClicked)} className="add-group-btn flex align-center"><img style={{ width: "1.5em", marginRight: "0.5em" }} src="/img/add-group/plus-icon.png" alt="" />Add another list</button>}
            </ul>
        </section >
    )
}
