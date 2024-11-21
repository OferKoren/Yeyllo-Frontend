import { useEffect, useState } from 'react'
import { makeId } from '../services/util.service'
import ClickOutside from './ClickOutside'
import { groupColorPalette } from '../store/reducers/board.reducer'
import { showErrorMsg } from '../services/event-bus.service'

export function GroupMenu({
    onChangeGroupColor,
    onUpdateBoard,
    board,
    group,
    setIsMenuOpen,
    onRemoveGroup,
    setIsAddTaskClicked,
    isCopyGroupClicked,
    setIsCopyGroupClicked,
    originBoard,
}) {
    const [newTitle, setNewTitle] = useState(group.title)

    function onAddTaskMenu() {
        setIsAddTaskClicked((isOpen) => !isOpen)
        setIsMenuOpen((isOpen) => !isOpen)
    }

    function onCopyTaskMenu() {
        setIsCopyGroupClicked(true)
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
        if (!newTitle) return showErrorMsg('Text field is required')

        const newTasks = group.tasks.map((task) => {
            return (task = { ...task, id: makeId() })
        })

        const newStyle = { ...group.style }

        const newGroup = {
            ...group,
            id: makeId(),
            style: newStyle,
            tasks: newTasks,
            title: newTitle,
            archivedAt: Date.now(),
        }

        try {
            const groupIdx = board.groups.findIndex((currGroup) => currGroup.id === group.id)
            const changeBoard = board
            // changeBoard.groups.push(newGroup)
            changeBoard.groups.splice(groupIdx + 1, 0, newGroup)
            console.log(...changeBoard.groups)

            // changeBoard.groups.map(currGroup => currGroup.id === group.id? newGroup )
            await onUpdateBoard(changeBoard)
            setNewTitle('')
            setIsMenuOpen((isOpen) => !isOpen)
        } catch (err) {
            console.log('err: ', err)
        }
    }

    return (
        <ClickOutside onClick={() => setIsMenuOpen(false)}>
            {isCopyGroupClicked ? (
                <div className="group-menu">
                    <header>Copy list</header>
                    <button className="back-btn" onClick={() => setIsCopyGroupClicked(false)}>
                        <img src="\img\board-details\arrow-left.svg" alt="back" />
                    </button>
                    <button className="close-btn" onClick={() => setIsMenuOpen((isOpen) => !isOpen)}>
                        <img src="\img\board-details\close-icon.png" alt="close" />
                    </button>
                    <h5>Name</h5>
                    <div className="group-menu-copy">
                        <form onSubmit={onCopyGroup}>
                            <textarea
                                autoFocus
                                className="group-copy-input"
                                type="text"
                                id="title"
                                name="title"
                                value={newTitle}
                                onChange={handleChange}
                            ></textarea>
                            {/* <input autoFocus className="group-copy-input" type="text" id="title" name="title" value={newTitle} onChange={handleChange} /> */}
                            <button>Create list</button>
                        </form>
                    </div>
                </div>
            ) : (
                <div /*onBlur={onBlurGroupMenu}*/ className="group-menu">
                    <header>List actions</header>
                    <button className="close-btn" onClick={() => setIsMenuOpen((isOpen) => !isOpen)}>
                        <img src="\img\board-details\close-icon.png" alt="" />
                    </button>
                    <section className="group-menu-btns">
                        <button onClick={onAddTaskMenu}>Add card</button>
                        <button onClick={onCopyTaskMenu}>Copy list</button>
                        <hr
                            style={{
                                borderColor: 'gray',
                                width: '16em',
                            }}
                        />
                        <h5>Change list color</h5>
                        <div className="group-palette-colors">
                            {groupColorPalette?.map((colorObj) => (
                                <div
                                    key={colorObj.title}
                                    onClick={() => onChangeGroupColor(event, colorObj.realColor)}
                                    className="group-palette-color"
                                    title={colorObj.title}
                                    style={{
                                        outline: group.style.backgroundColor === colorObj.realColor ? '#0C66E4 solid 2px' : '',
                                        border: group.style.backgroundColor === colorObj.realColor ? 'solid white 2px' : '',
                                        backgroundColor: colorObj.color,
                                        width: '50px',
                                        height: '32px',
                                        padding: '6px 12px',
                                    }}
                                ></div>
                            ))}
                        </div>
                        <hr
                            style={{
                                borderColor: 'gray',
                                width: '16em',
                            }}
                        />
                        <button onClick={onRemoveGroup}>Delete this list</button>
                    </section>
                </div>
            )}
        </ClickOutside>
    )
}
