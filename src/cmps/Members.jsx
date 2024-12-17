import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { boardService } from '../services/board'

export function Members({ task, setTask, onRemoveMember, handleCloseModal, addActivity }) {

    const gMembers = useSelector((storeState) => storeState.boardModule.members)
    const [filteredMembers, setFilteredMembers] = useState([...gMembers])

    function onAddMember(memberId, memberFullname) {
        setTask(prevTask => ({ ...prevTask, memberIds: (!prevTask.memberIds) ? [memberId] : [...prevTask.memberIds, memberId] }))

        addActivity(`added ${memberFullname} to card "${task.title}"`)
    }

    function handleFilterByMember({ target }) {
        const regExp = new RegExp(target.value, 'i')
        setFilteredMembers(gMembers.filter(member => regExp.test(member.fullname)))
    }

    return (
        <div className="modal-option task-members">
            <div className="task-members-header option-modal-header">
                <h2>Members</h2>
                <i className="btn fa-solid fa-xmark left-side" onClick={handleCloseModal}></i>
            </div>

            <div className="members">
                <input
                    type="text"
                    onChange={handleFilterByMember}
                    placeholder="Search members"
                />
                {
                    task.memberIds && task.memberIds.length !== 0 &&
                    <div className="task-member-list">
                        <h3>Card members</h3>
                        <ul className="member-list">
                            {task.memberIds && task.memberIds.length !== 0 && filteredMembers && filteredMembers.map(member => {
                                if (task.memberIds.includes(member._id)) {
                                    const memberDetails = member
                                    return (
                                        <li key={memberDetails._id} className="member">
                                            <img src={memberDetails.imgUrl || ''} />
                                            <span className="member-name">{memberDetails.fullname}</span>
                                            <i className="btn fa-solid fa-xmark left-side" onClick={() => onRemoveMember(memberDetails._id, memberDetails.fullname)}></i>
                                        </li>
                                    )
                                }
                            }
                            )}
                        </ul>
                    </div>
                }


                {(task.memberIds && task.memberIds.length === gMembers.length) || gMembers.length > 0 &&
                    <div className="board-member-list">
                        <h3>Board members</h3>
                        <ul className="member-list">
                            {filteredMembers && filteredMembers.map(member => {
                                if (task.memberIds && task.memberIds.length !== 0 && task.memberIds.includes(member._id)) return
                                else {
                                    return (
                                        <li className="member" key={member._id} onClick={() => onAddMember(member._id, member.fullname)}>
                                            <img src={member.imgUrl} />
                                            <span className="member-name">{member.fullname}</span>
                                        </li>
                                    )
                                }
                            }
                            )}
                        </ul>
                    </div>}

            </div>
        </div>
    )
}