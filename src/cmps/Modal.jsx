import { useEffect, useRef, useState } from 'react'

export function Modal({
    children,
    isOpen = false,
    onCloseModal = () => { },
    title = '',
    isBlur = true,
    isBackDrop = true,
    position = null,
    style = {},
    above = false,
}) {
    if (!isOpen) return null
    const modalRef = useRef()
    const [modalHeihgt, setModalHeight] = useState(0)
    useEffect(() => {
        setModalHeight(modalRef.current.clientHeight * -1)
    }, [isOpen])

    const blur = isBlur ? 'blur' : ''
    let contentStyle = position ? { inset: 'auto', ...position } : {}
    contentStyle = above ? { ...contentStyle, transform: `translateY(${modalHeihgt}px)` } : contentStyle

    return (
        <section className="modal">
            {isBackDrop && <section onClick={onCloseModal} className={`modal-backdrop ${blur}`}></section>}
            <section ref={modalRef} className="modal-content" style={{ ...contentStyle, ...style }}>
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
