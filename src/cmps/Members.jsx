import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

export function Members({ task, setTask, setIsEditMembers, boardMembers, onRemoveMember }) {

    const gMembers = useSelector((storeState) => storeState.boardModule.members)

    function onAddMember(memberId) {
        setTask(prevTask => ({ ...prevTask, memberIds: [...prevTask.memberIds, memberId] }))
    }

    return (
        <div className="modal-option task-members">
            <div className="task-members-header option-modal-header">
                <h2>Members</h2>
                <i className="btn fa-solid fa-xmark left-side" onClick={() => setIsEditMembers(prev => !prev)}></i>
            </div>

            <div className="members">
                {
                    task.memberIds && task.memberIds.length !== 0 &&
                    <div className="task-member-list">
                        <h3>Card members</h3>
                        <ul className="member-list">
                            {task.memberIds && task.memberIds.length !== 0 && task.memberIds.map(memberId => {

                                const memberDetails = gMembers.find(m => m._id === memberId)
                                return (
                                    <li key={memberDetails._id}>
                                        <img src={memberDetails.imgUrl} />
                                        <span className="member-name">{memberDetails.fullname}</span>
                                        <i className="btn fa-solid fa-xmark left-side" onClick={() => onRemoveMember(memberId)}></i>
                                    </li>
                                )
                            }
                            )}
                        </ul>
                    </div>
                }

                {
                    task.memberIds && task.memberIds.length !== gMembers.length &&
                    <div className="board-member-list">
                        <h3>Board members</h3>
                        <ul className="member-list">
                            {boardMembers && boardMembers.map(member => {
                                if (task.memberIds && task.memberIds.length !== 0 && task.memberIds.includes(member._id)) return
                                else {
                                    return (
                                        <li key={member._id} onClick={() => onAddMember(member._id)}>
                                            <img src={member.imgUrl} />
                                            <span className="member-name">{member.fullname}</span>
                                        </li>
                                    )
                                }
                            }
                            )}
                        </ul>
                    </div>
                }
            </div>
        </div>
    )
}