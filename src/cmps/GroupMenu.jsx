import { useState } from "react"
import { makeId } from "../services/util.service"

export function GroupMenu({ onUpdateBoard, board, group, setIsMenuOpen, onRemoveGroup, setIsAddTaskClicked, isCopyGroupClicked, setIsCopyGroupClicked }) {

    const [newTitle, setNewTitle] = useState(group.title)


    function onAddTaskMenu() {
        setIsAddTaskClicked(isOpen => !isOpen)
        setIsMenuOpen(isOpen => !isOpen)
    }

    function onCopyTaskMenu() {
        setIsCopyGroupClicked(isOpen => !isOpen)
    }

    function onBlurGroupMenu() {
        setIsCopyGroupClicked(false)
        setIsMenuOpen(false)
    }

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
        setNewTitle(value)
    }

    async function onCopyTitle(ev) {
        ev.preventDefault()
        if (!newTitle) return alert('Text field is required')
        const newGroup = {
            id: makeId(),
            style: group.style,
            tasks: group.tasks,
            title: newTitle
        }
        try {
            board.groups.push(newGroup)
            await onUpdateBoard(board)
            setNewTitle('')
            setIsMenuOpen(isOpen => !isOpen)
        } catch (err) {
            console.log('err: ', err);
        }
    }

    return (
        <>
            {isCopyGroupClicked ?
                <div className="group-menu">
                    <header >Copy list</header>
                    <button className="close-btn" onClick={() => setIsMenuOpen(isOpen => !isOpen)}><img src="\img\board-details\close-icon.png" alt="" /></button>
                    <h4>Name</h4>
                    <div className="group-menu-copy">
                        {/* <textarea name="" id="" value=""></textarea> */}
                        <form onSubmit={onCopyTitle}>
                            <input autoFocus className="group-title-input" type="text" id="title" name="title" value={newTitle} onChange={handleChange} />
                        </form>
                    </div>

                </div>
                :

                <div onBlur={onBlurGroupMenu} className="group-menu">
                    <header >List actions</header>
                    <button className="close-btn" onClick={() => setIsMenuOpen(isOpen => !isOpen)}><img src="\img\board-details\close-icon.png" alt="" /></button>
                    <section className="group-menu-btns">
                        <button onClick={onAddTaskMenu} >Add card</button>
                        <button onClick={onCopyTaskMenu}>Copy list</button>
                        <hr style={{
                            borderColor: "gray", width: "16em"
                        }} />
                        <button onClick={onRemoveGroup}>Delete this list</button>
                    </section>
                </div>}
        </>
    )
}