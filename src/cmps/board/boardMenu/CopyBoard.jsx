import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { addBoard, updateBoard } from '../../../store/actions/board.actions'
import { useEffect, useState } from 'react'

export function CopyBoard({ onToggleMenu }) {
    const [boardToCopy, setBoardToCopy] = useState({ ...useSelector((storeState) => storeState.boardModule.board) })
    useEffect(() => {
        setBoardToCopy((prevBoard) => ({ ...prevBoard, _id: null, createdAt: null }))
    }, [])
    const navigate = useNavigate()

    async function onCopyBoard(ev) {
        ev.preventDefault()
        try {
            console.log(boardToCopy)
            const savedBoard = await addBoard(boardToCopy)
            onToggleMenu()
            navigate(`/board/${savedBoard._id}`)
            // showSuccessMsg(`Board added (id: ${savedBoard._id})`)
        } catch (err) {
            console.log(err)
            // showErrorMsg('Cannot copy board')
        }
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
        setBoardToCopy({ ...boardToCopy, [field]: value })
    }
    const { title } = boardToCopy
    if (!boardToCopy) return
    return (
        <div className="copy-board">
            <form action="" onSubmit={onCopyBoard}>
                <label htmlFor="title">title</label>
                <input
                    required
                    id="title"
                    type="text"
                    name="title"
                    value={title}
                    onChange={handleChange}
                    placeholder='Like "Vaction Planning" for example'
                />
                <p>Activity, comments, and members will not be copied to the new board.</p>

                <button disabled={title === ''} className="menu-btn btn1">
                    create
                </button>
            </form>
        </div>
    )
}
