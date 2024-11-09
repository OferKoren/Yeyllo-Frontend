import { useEffect, useState } from 'react'
import { boardService } from '../../../services/board'
export function AddBoard({ onAddBoard }) {
    const [boardToAdd, setBoardToAdd] = useState(boardService.getEmptyBoard())
    const [boardBg, setBoardBg] = useState({ options: boardService.getBackgroundPallet(), type: 'photos', selected: '' })

    useEffect(() => {
        console.log(boardToAdd)
    }, [boardToAdd])

    useEffect(() => {
        setBoardBg((prev) => ({ ...prev, selected: boardBg.options.photos[0] }))
    }, [])
    function onSubmit(ev) {
        ev.preventDefault()
        onAddBoard(boardToAdd)
    }
    function onChangeBg(selectedBg) {
        setBoardBg((prev) => ({ ...prev, selected: selectedBg }))
        setBoardToAdd((prevBoard) => {
            const style = { ...prevBoard.style, backgroundImage: `url(../${selectedBg})` }
            return { ...prevBoard, style }
        })
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
        console.log(type)
        setBoardToAdd({ ...boardToAdd, [field]: value })
    }
    if (!boardBg) return
    const { title, style } = boardToAdd
    const { selected } = boardBg
    return (
        <section className="add-board">
            <div className={'mini-board-preview'} style={boardToAdd.style}>
                <img src="/img/add-board/board-preview.svg" alt="" />
            </div>

            <form action="" onSubmit={onSubmit} className="add-board-form">
                <span>background</span>
                <ul className="photos-list">
                    {boardBg.options.photos.map((photo) => {
                        return (
                            <li key={photo}>
                                <button
                                    type="button"
                                    style={{ backgroundImage: `url('../public/${photo}')` }}
                                    className="bg-btn"
                                    onClick={() => {
                                        onChangeBg(photo)
                                    }}
                                >
                                    {selected === photo && <img src="/img/add-board/v-icon.svg" />}
                                </button>
                            </li>
                        )
                    })}
                </ul>

                <ul className="colors-list">
                    {boardBg.options.colors.map((color, idx) => {
                        if (idx > 4) return
                        return (
                            <li key={color}>
                                <button
                                    type="button"
                                    style={{ backgroundImage: `url('../public/${color}')` }}
                                    onClick={() => {
                                        onChangeBg(color)
                                    }}
                                    className="bg-btn"
                                >
                                    {selected === color && <img src="/img/add-board/v-icon.svg" />}
                                </button>
                            </li>
                        )
                    })}
                </ul>

                {}
                <label htmlFor="title">
                    Board title <span style={{ color: 'red' }}>*</span>
                </label>
                <input type="text" id="title" required name="title" value={title} onChange={handleChange} />

                <button>Create</button>
            </form>
        </section>
    )
}
