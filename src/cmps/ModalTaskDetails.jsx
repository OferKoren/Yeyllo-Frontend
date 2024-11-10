
export function ModalTaskDetails({ children, isOpen = false, onCloseModal = () => { }, title, isBlur = true }) {
    if (!isOpen) return null
    const blur = isBlur ? 'blur' : ''
    return (
        <section className="modal">
            <section onClick={onCloseModal} className={`modal-backdrop ${blur}`}>

            </section>
            <section className="modal-task-details-content">
                {children}
            </section>
        </section>
    )
}
