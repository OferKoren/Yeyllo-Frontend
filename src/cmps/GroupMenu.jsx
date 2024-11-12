import { useState } from "react"
import { makeId } from "../services/util.service"
import ClickOutside from "./ClickOutside"

export function GroupMenu({ onUpdateBoard, board, group, setIsMenuOpen, onRemoveGroup, setIsAddTaskClicked, isCopyGroupClicked, setIsCopyGroupClicked }) {

    const [newTitle, setNewTitle] = useState(group.title)

    const groupColorPalette = [
        { color: '#4BCE97', realColor: '#BAF3DB', title: 'green' },
        { color: '#f5cd47', realColor: '#F8E6A0', title: 'yellow' },
        { color: '#fea362', realColor: '#FEDEC8', title: 'orange' },
        { color: '#f87168', realColor: '#FFD5D2', title: 'red' },
        { color: '#9f8fef', realColor: '#DFD8FD', title: 'purple' },
        { color: '#579dff', realColor: '#CCE0FF', title: 'blue' },
        { color: '#6cc3e0', realColor: '#C6EDFB', title: 'teal' },
        { color: '#94c748', realColor: '#D3F1A7', title: 'lime' },
        { color: '#e774bb', realColor: '#FDD0EC', title: 'magenta' },
        { color: '#8590a2', realColor: '', title: 'gray (Default)' }
    ]

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
        setNewTitle(value)
    }

    async function onCopyGroup(ev) {
        ev.preventDefault()
        if (!newTitle) return /*alert('Text field is required')*/
        const newGroup = {
            id: makeId(),
            style: group.style,
            tasks: group.tasks,
            title: newTitle
        }
        try {
            const groupIdx = board.groups.findIndex(currGroup => currGroup.id === group.id)
            board.groups.splice(groupIdx + 1, 0, newGroup)
            await onUpdateBoard(board)
            setNewTitle('')
            setIsMenuOpen(isOpen => !isOpen)
        } catch (err) {
            console.log('err: ', err);
        }
    }

    async function onChangeGroupColor(ev, color) {
        // ev.preventDefault()

        try {
            const groupIdx = board.groups.findIndex(currGroup => currGroup.id === group.id)
            board.groups[groupIdx].style.backgroundColor = color
            // group.style.backgroundColor = color
            await onUpdateBoard(board)
            // setIsMenuOpen(isOpen => !isOpen)
        } catch (err) {
            console.log('err: ', err);
        }
    }

    return (
        <ClickOutside
            onClick={() => setIsMenuOpen(false)}
        >
            {isCopyGroupClicked ?
                <div className="group-menu">
                    <header >Copy list</header>
                    <button className="close-btn" onClick={() => setIsMenuOpen(isOpen => !isOpen)}><img src="\img\board-details\close-icon.png" alt="" /></button>
                    <h5>Name</h5>
                    <div className="group-menu-copy">
                        <form onSubmit={onCopyGroup}>
                            <textarea autoFocus className="group-copy-input" type="text" id="title" name="title" value={newTitle} onChange={handleChange}></textarea>
                            {/* <input autoFocus className="group-copy-input" type="text" id="title" name="title" value={newTitle} onChange={handleChange} /> */}
                            <button>Create list</button>
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
                        <h5>Change list color</h5>
                        <div className="group-palette-colors">
                            {groupColorPalette?.map(colorObj =>
                                <div key={colorObj.title} onClick={() => onChangeGroupColor(event, colorObj.realColor)} className="group-palette-color" title={colorObj.title} style={{ outline: group.style.backgroundColor === colorObj.realColor ? '#0C66E4 solid 2px' : '', border: group.style.backgroundColor === colorObj.realColor ? 'solid white 2px' : '', backgroundColor: colorObj.color, width: '50px', height: '32px', padding: '6px 12px' }}></div>
                            )}
                        </div>
                        <hr style={{
                            borderColor: "gray", width: "16em"
                        }} />
                        <button onClick={onRemoveGroup}>Delete this list</button>
                    </section>
                </div>}
        </ClickOutside>

    )
}