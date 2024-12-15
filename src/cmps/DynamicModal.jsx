import ReactDOM from 'react-dom'
import { Labels } from '../cmps/Labels.jsx'
import { Dates } from '../cmps/Dates.jsx'
import { AddChecklist } from '../cmps/AddChecklist.jsx'
import { Members } from '../cmps/Members.jsx'
import { Cover } from '../cmps/Cover.jsx'
import { Canvas } from '../cmps/Canvas.jsx'
import { AddAttachment } from '../cmps/Attachment/AddAttachment.jsx'
import { ModalTaskDetails } from '../cmps/ModalTaskDetails.jsx'

export function DynamicModal({ cmpType, modalProps, modalPosition, parentRef }) {
    if (!cmpType) return null

    const style = {
        position: 'absolute',
        top: modalPosition.top, // Position below the button with padding
        left: modalPosition.left,
        right: modalPosition.right
    }

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
        addActivity,
        handleOpenModal
    } = modalProps

    return (parentRef
        ? ReactDOM.createPortal(
            <div className="dynamic-modal" style={style}>
                {/* Render modal content dynamically based on cmpType */}
                {(cmpType === 'members-plusBtn' || cmpType === 'members') && <Members
                    task={task}
                    setTask={setTask}
                    handleCloseModal={handleCloseModal}
                    boardMembers={boardMembers}
                    onRemoveMember={onRemoveMember}
                    addActivity={addActivity}
                />}
                {(cmpType === 'labels-plusBtn' || cmpType === 'labels') && <Labels
                    setTask={setTask}
                    handleChange={handleInfoChange}
                    boardToEdit={boardToEdit}
                    setBoardToEdit={setBoardToEdit}
                    handleCloseModal={handleCloseModal}
                    task={task}
                />}
                {(cmpType === 'dates-chevronBtn' || cmpType === 'dates') && <Dates
                    setTask={setTask}
                    handleChange={handleInfoChange}
                    boardToEdit={boardToEdit}
                    setBoardToEdit={setBoardToEdit}
                    handleCloseModal={handleCloseModal}
                    task={task}
                />}
                {(cmpType === 'checklist') && <AddChecklist
                    task={task}
                    setTask={setTask}
                    handleCloseModal={handleCloseModal}
                    addActivity={addActivity}
                />}
                {(cmpType === 'cover' || cmpType === 'cover-topBtn') && <Cover
                    setTask={setTask}
                    handleCloseModal={handleCloseModal}
                    task={task}
                />}
                {(cmpType === 'attachment') && <AddAttachment
                    handleCloseModal={handleCloseModal}
                    task={task}
                    setTask={setTask}
                    addActivity={addActivity}
                />}
                {(cmpType === 'drawing') &&
                    <ModalTaskDetails onCloseModal={onCloseModal} isOpen={openModal === 'drawing'} isBlur={true}>
                        <Canvas handleCloseModal={handleCloseModal} task={task} setTask={setTask} />
                    </ModalTaskDetails>
                }
            </div>,
            parentRef // Mount dynamically under the specified parent element
        )
        : null)

}