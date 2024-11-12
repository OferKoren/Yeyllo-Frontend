export function Dropdown({ title = 'dropdown' }) {
    return (
        <div className="dropdown">
            <header className="dropdown-header">
                <h2>{title}</h2>
            </header>
        </div>
    )
}
