import { useState } from "react"
import { GroupPreview } from "./GroupPreview";

export function GroupList({ board }) {
    const {groups} = board
    console.log(groups);

    if (!board) return <div>Loading...</div>
    return (
        <section>
            <ul className="group-list flex">
                {groups.map(group =>
                    <li key={group.id}>
                        {/* <pre>{JSON.stringify(group, null, 2)}</pre> */}
                        <GroupPreview group={group}/>
                    </li>)
                }
            </ul>
        </section>
    )
}
