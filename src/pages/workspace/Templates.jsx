import { useState, useEffect } from 'react'
import { WorkspaceAside } from '../../cmps/workspace/aside/WorkspaceAside'

//* boardIndex is the personal workspace of someone in the workspace
export function Templates() {
    return (
        <main className="workspace-layout">
            {/* <BoardFilter filterBy={filterBy} setFilterBy={setFilterBy} /> */}
            <WorkspaceAside />
            <div className="main-section">
                <header>
                    <h1>Template WIP</h1>
                    <hr />
                </header>
            </div>
        </main>
    )
}
