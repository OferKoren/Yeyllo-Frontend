import { useEffect, useState } from 'react'

import { EndlessPhotos } from './EndlessPhotos'

export function MoreBgs({ boardBg, menu, onChangeBg, onSetMenu }) {
    const { selected } = boardBg
    useEffect(() => {
        return () => {
            onSetMenu('board background')
        }
    }, [])
    switch (menu) {
        case 'colors':
            return ColorsMenu()
        case 'photos':
            return PhotosMenu()
        default:
            return MainMenu()
    }
    function MainMenu() {
        return (
            <section className="more-bgs">
                <header className="bgs-header">
                    <span>photos</span>
                    <button className="btn1" onClick={() => onSetMenu('photos')}>
                        see more
                    </button>
                </header>
                <ul className="">
                    {boardBg.options.photos.map((photo) => {
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
                <header className="bgs-header">
                    <span>colors</span>
                    <button className="btn1" onClick={() => onSetMenu('colors')}>
                        see more
                    </button>
                </header>
                <ul className="">
                    {boardBg.options.colors.map((color, idx) => {
                        if (idx > 5) return
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
                </ul>
            </section>
        )
    }

    function ColorsMenu() {
        console.log(boardBg)
        return (
            <div className="more-bgs">
                <button
                    className="modal-btn return-btn"
                    onClick={() => {
                        onSetMenu('board background')
                    }}
                >
                    <img src="/img/general/arrow-left.svg" alt="" />
                </button>
                <ul className="colors-menu">
                    {boardBg.options.colors.map((color, idx) => {
                        if (idx > 8) return null
                        const style = { backgroundImage: `url('${color}')` }
                        return (
                            <li key={color}>
                                <button
                                    type="button"
                                    style={style}
                                    onClick={() => {
                                        if (idx < 9) onChangeBg(color)
                                        else onChangeBg(color, true)
                                    }}
                                    className={selected === color ? 'bg-btn active' : 'bg-btn'}
                                >
                                    {selected === color && <img src="/img/add-board/v-icon.svg" />}
                                </button>
                            </li>
                        )
                    })}
                </ul>
                <hr />
                <ul className="colors-menu">
                    {boardBg.options.colors.map((color, idx) => {
                        if (idx <= 8) return null
                        const style = { backgroundColor: color }
                        return (
                            <li key={color}>
                                <button
                                    type="button"
                                    style={style}
                                    onClick={() => {
                                        onChangeBg(color, true)
                                    }}
                                    className={selected === color ? 'bg-btn active' : 'bg-btn'}
                                >
                                    {selected === color && <img src="/img/add-board/v-icon.svg" />}
                                </button>
                            </li>
                        )
                    })}
                </ul>
            </div>
        )
    }
    function PhotosMenu() {
        return (
            <div className="more-bgs">
                <button
                    className="modal-btn return-btn"
                    onClick={() => {
                        onSetMenu('board background')
                    }}
                >
                    <img src="/img/general/arrow-left.svg" alt="" />
                </button>
                <EndlessPhotos boardBg={boardBg} onChangeBg={onChangeBg} />
            </div>
        )
    }
}
