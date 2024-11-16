
export function ModalTaskDetails({ children, isOpen = false, onCloseModal = () => { }, isBlur = true }) {
    if (!isOpen) return null
    const blur = isBlur ? 'blur' : ''
    return (
        <section style={{ zIndex: '8' }} className="modal-task-details">
            <section onClick={onCloseModal} className={`modal-backdrop ${blur}`}>

            </section>
            <section className="modal-task-details-content">
                {children}
            </section>
        </section>
    )
}
