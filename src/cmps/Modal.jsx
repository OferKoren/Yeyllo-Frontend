import { useEffect } from 'react'

export function Modal({ children, isOpen = false, onCloseModal = () => {}, title = '', isBlur = true, isBackDrop = true, position = null }) {
    if (!isOpen) return null
    /*  useEffect(() => {
        if (position) {
            console.log(position)
        }
    }, []) */
    const blur = isBlur ? 'blur' : ''
    const style = position ? { inset: 'auto', ...position } : {}
    return (
        <section className="modal">
            {isBackDrop && <section onClick={onCloseModal} className={`modal-backdrop ${blur}`}></section>}
            <section className="modal-content" style={style}>
                <header className="modal-header">
                    <h3>
                        <span>{title}</span>
                    </h3>
                    <button className="modal-btn" onClick={onCloseModal}>
                        <img src="/img/general/x-icon.svg" alt="" />
                    </button>
                </header>

                {children}
            </section>
        </section>
    )
}
