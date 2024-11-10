export function GroupMenu({ setIsMenuOpen, onRemoveGroup }) {

    return (
        <div className="group-menu">
            <header>List actions</header>
            <button className="close-btn" onClick={() => setIsMenuOpen(isOpen => !isOpen)}>X</button>
            <section>
                {/* <button>Add card</button>
                <button>Copy list</button> */}
                <hr style={{
                    borderColor: "gray",
                }} />
                <button onClick={onRemoveGroup}>Delete this list</button>
            </section>
        </div>
    )
}