
export function Modal({ children, isOpen = false, onCloseModal = () => { } }) {

    if (!isOpen) return null
    return (
        <>
            <section onClick={onCloseModal} className='modal-backdrop'></section>
            <section className='modal-content'>
                {children}
            </section>
        </>
    )
}