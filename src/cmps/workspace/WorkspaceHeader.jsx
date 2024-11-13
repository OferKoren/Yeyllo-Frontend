export function WorkspaceHeader({ workspace, onSetWorkspace }) {
    const { title } = workspace
    return (
        <header className="workspace-header">
            <button className="logo">
                <div>{title[0].toUpperCase()}</div>
            </button>
            <h2>{title}</h2>
        </header>
    )
}
