import { useState, useEffect, useRef } from 'react'

export function Members({ task, setIsEditMembers, boardMembers }) {


    return (
        <div className="modal-option task-members">
            <div className="task-members-header option-modal-header">
                <h2>Members</h2>
                <i className="btn fa-solid fa-xmark left-side" onClick={() => setIsEditMembers(prev => !prev)}></i>
            </div>

            <div className="board-member-list">
                <h3>Card members</h3>
                {/* <ul className="member-list">
                    {task.member && task.member.length !==0 && task.memberIds.map(member =>
                        <li key={member.id}>
                            <img src={member.imgUrl} />
                            <span>{member.fullname}</span>
                        </li>
                    )}
                </ul> */}
            </div>

            <div className="board-member-list">
                <h3>Board members</h3>
                <ul className="member-list">
                    {boardMembers && boardMembers.map(member =>
                        <li key={member.id}>
                            <img src={member.imgUrl} />
                            <span className="member-name">{member.fullname}</span>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    )
}