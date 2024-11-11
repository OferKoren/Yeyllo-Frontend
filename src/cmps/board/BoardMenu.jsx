import { useEffect, useRef, useState } from 'react'
import { Modal } from '../Modal'

export function BoardMenu({ isShrink, onToggleMenu }) {
    const [width, setWidth] = useState('0px')
    useEffect(() => {
        setWidth('340px')
    }, [])
    useEffect(() => {
        if (isShrink) setWidth('0px')
    }, [isShrink])
    const dynamicClass = isShrink ? 'shrink' : ''
    return (
        <div className={`board-menu-wrapper`}>
            <div className={`placeholder-div ${dynamicClass}`} style={{ width: width }}></div>
            <section className={`board-menu  ${dynamicClass}`}>
                <header className="menu-header header">
                    <h3>
                        <span>board menu</span>
                    </h3>
                    <button className="modal-btn" onClick={onToggleMenu}>
                        <img src="/img/general/x-icon.svg" alt="" />
                    </button>
                </header>
            </section>
        </div>
    )
}
