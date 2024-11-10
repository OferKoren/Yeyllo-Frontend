export function Modal({ children, isOpen = false, onCloseModal = () => {}, title, isBlur = true }) {
    if (!isOpen) return null
    const blur = isBlur ? 'blur' : ''
    return (
        <section className="modal">
            <section onClick={onCloseModal} className={`modal-backdrop ${blur}`}></section>
            <section className="modal-content">
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
