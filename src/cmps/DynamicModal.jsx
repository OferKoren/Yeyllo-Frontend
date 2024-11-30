import { Labels } from '../cmps/Labels.jsx'
import { Dates } from '../cmps/Dates.jsx'
import { AddChecklist } from '../cmps/AddChecklist.jsx'
import { Members } from '../cmps/Members.jsx'
import { Cover } from '../cmps/Cover.jsx'
import { Canvas } from '../cmps/Canvas.jsx'
import { AddAttachment } from '../cmps/Attachment/AddAttachment.jsx'
import { ModalTaskDetails } from '../cmps/ModalTaskDetails.jsx'

export function DynamicModal({ cmpType, modalProps, modalPosition }) {
    if (!cmpType) return null

    // const style = {
    //     position: 'absolute',
    //     top: modalPosition.top, // Position below the button with padding
    //     left: modalPosition.left,
    // }

    const {
        task,
        setTask,
        handleCloseModal,
        boardMembers,
        onRemoveMember,
        boardToEdit,
        setBoardToEdit,
        handleInfoChange,
        groupId,
        user,
        openModal,
        onCloseModal,
        handleOpenModal
    } = modalProps

    switch (cmpType) {
        case 'members':
        case 'members-plusBtn':
            return (
                <Members
                    // style={style}
                    task={task}
                    setTask={setTask}
                    handleCloseModal={handleCloseModal}
                    boardMembers={boardMembers}
                    onRemoveMember={onRemoveMember}
                    boardToEdit={boardToEdit}
                    groupId={groupId}
                    user={user}
                />
            )
        case 'labels':
            return (
                <div className="modal" /*style={style}*/>
                    <Labels
                        setTask={setTask}
                        handleChange={handleInfoChange}
                        boardToEdit={boardToEdit}
                        setBoardToEdit={setBoardToEdit}
                        handleCloseModal={handleCloseModal}
                        task={task}
                    />
                </div>
            )
        case 'checklist':
            return (
                <div className="modal" /*style={style}*/>
                    <AddChecklist
                        task={task}
                        setTask={setTask}
                        handleCloseModal={handleCloseModal}
                        boardToEdit={boardToEdit}
                        groupId={groupId}
                        user={user} />
                </div>
            )
        case 'dates':
            return (
                <div className="modal" /*style={style}*/>
                    <Dates
                        task={task}
                        setTask={setTask}
                        handleChange={handleInfoChange}
                        handleCloseModal={handleCloseModal}
                        openModal={openModal} />
                </div>
            )
        case 'cover':
            return (
                <div className="modal" /*style={style}*/>
                    <Cover setTask={setTask} handleCloseModal={handleCloseModal} task={task} />
                </div>
            )
        case 'attachment':
            return (
                <div className="modal" /*style={style}*/>
                    <AddAttachment handleCloseModal={handleCloseModal} task={task} setTask={setTask} />
                </div>
            )
        case 'drawing':
            return (
                <ModalTaskDetails onCloseModal={onCloseModal} isOpen={openModal === 'drawing'} isBlur={true}>
                    <Canvas handleCloseModal={handleCloseModal} task={task} setTask={setTask} />
                </ModalTaskDetails>
            )
        default:
            return null
    }

}