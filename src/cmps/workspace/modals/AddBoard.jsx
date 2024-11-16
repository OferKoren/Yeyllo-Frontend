import { useEffect, useState } from 'react'
import { boardService } from '../../../services/board'
import { MoreBgs } from './MoreBgs'
import { Modal } from '../../Modal'
export function AddBoard({ onAddBoard, position = null }) {
    const [boardToAdd, setBoardToAdd] = useState(boardService.getEmptyBoard())
    const [boardBg, setBoardBg] = useState({ options: boardService.getBackgroundPallet(), selected: '' })
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [menu, setMenu] = useState('board background')

    useEffect(() => {}, [boardToAdd])

    useEffect(() => {
        setBoardBg((prev) => ({ ...prev, selected: boardBg.options.photos[0] }))
    }, [])
    function onSubmit(ev) {
        ev.preventDefault()
        onAddBoard(boardToAdd)
    }
    function onChangeBg(selectedBg, isSingleColor = false) {
        setBoardBg((prev) => ({ ...prev, selected: selectedBg }))
        setBoardToAdd((prevBoard) => {
            const style = isSingleColor ? { backgroundColor: selectedBg } : { ...prevBoard.style, backgroundImage: `url(${selectedBg})` }
            const urls = { regular: selectedBg }
            return { ...prevBoard, style, urls }
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
        setBoardToAdd({ ...boardToAdd, [field]: value })
    }
    function onCloseModal() {
        setIsModalOpen(false)
    }
    function onOpenModal() {
        setIsModalOpen(true)
    }
    function onSetMenu(menu) {
        setMenu(() => menu)
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
                    {boardBg.options.photos.map((photo, idx) => {
                        if (idx > 3) return
                        return (
                            <li key={photo}>
                                <button
                                    type="button"
                                    style={{ backgroundImage: `url('${photo}')` }}
                                    className={selected === photo ? 'bg-btn active' : 'bg-btn'}
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
                                    style={{ backgroundImage: `url('${color}')` }}
                                    onClick={() => {
                                        onChangeBg(color)
                                    }}
                                    className={selected === color ? 'bg-btn active' : 'bg-btn'}
                                >
                                    {selected === color && <img src="/img/add-board/v-icon.svg" />}
                                </button>
                            </li>
                        )
                    })}
                    <button type="button" className="bg-btn more-bg-btn" onClick={onOpenModal}></button>
                </ul>

                <label htmlFor="title">
                    Board title <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                    type="text"
                    className={title !== '' ? 'title-input has-title' : 'title-input'}
                    id="title"
                    required
                    name="title"
                    value={title}
                    onChange={handleChange}
                />
                {title === '' && (
                    <div className="field-error">
                        👋 <span>Board title is required</span>
                    </div>
                )}
                <button disabled={title === '' || !title}>Create</button>
            </form>
            <Modal title={menu} onCloseModal={onCloseModal} isOpen={isModalOpen} isBlur={false} position={position}>
                <MoreBgs boardBg={boardBg} onChangeBg={onChangeBg} menu={menu} onSetMenu={onSetMenu} />
            </Modal>
        </section>
    )
}
