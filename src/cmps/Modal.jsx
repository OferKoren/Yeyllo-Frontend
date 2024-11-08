export function Modal({ children, isOpen = false, onCloseModal = () => {}, title, isBlur = true }) {
    if (!isOpen) return null
    const blur = isBlur ? 'blur' : ''
    return (
        <>
            <section onClick={onCloseModal} className={`modal-backdrop ${blur}`}></section>
            <section className="modal-content">
                <h3>{title}</h3>
                <button className="close-btn" onClick={onCloseModal}>
                    x
                </button>
                {children}
            </section>
        </>
    )
}
