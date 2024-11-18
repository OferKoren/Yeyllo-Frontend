import { Link, useNavigate } from 'react-router-dom'
import { TaskList } from './TaskList'
import { useEffect, useState } from 'react'
import { GroupMenu } from './GroupMenu'
import { colorLuminance } from '../services/util.service'
import { Droppable } from 'react-beautiful-dnd'
import { useSelector } from 'react-redux'

export function GroupPreview({ isModalOpen, setIsModalOpen, isLabelsClicked, setIsLabelsClicked, onUpdateBoard, board, group, setIsGroupDeleted }) {
    const { title, tasks, id } = group

    const [currTitle, setCurrTitle] = useState(title)
    const [isGroupHeaderEdit, setIsGroupHeaderEdit] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const [isCopyGroupClicked, setIsCopyGroupClicked] = useState(false)
    const [isAddTaskClicked, setIsAddTaskClicked] = useState(false)
    const [taskTitle, setTaskTitle] = useState('')
    const user = useSelector((storeState) => storeState.userModule.user)

    const navigator = useNavigate()


    useEffect(() => {

    }, [isMenuOpen])

    function onEditGroupHeader() {
        setIsGroupHeaderEdit(isEdit => !isEdit)
    }

    function handleChange(ev) {
        const type = ev.target.type
        const field = ev.target.name
        let value = ev.target.value

        switch (type) {
            case 'text':
                break
            case 'number': {
                value = +ev.target.value || ''
                break
            }
        }
        setCurrTitle(value)
    }

    async function onEditTitleGroup(ev) {
        if (ev) ev.preventDefault()
        if (!currTitle) {
            setCurrTitle(title)
            onEditGroupHeader()
            return
            /*alert('Text field is required')*/
        }

        try {
            const currGroup = board.groups.find(group => group.id === id)
            currGroup.title = currTitle
            await onUpdateBoard(board)
            onEditGroupHeader()
        } catch (err) {
            console.log('err: ', err);
        }
    }
    function toggleMenu() {
        setIsCopyGroupClicked(isOpen => isOpen = false)
        setIsMenuOpen(isOpen => !isOpen)
    }

    async function onRemoveGroup(ev) {
        ev.preventDefault()
        try {
            const currGroupIdx = board.groups.findIndex(group => group.id === id)
            board.groups.splice(currGroupIdx, 1)

            const activity = {
                txt: `deleted list "${title}"`,
                boardId: board._id,
                groupId: id,
                taskId: null,
                byMember: { _id: user._id, fullname: user.fullname, imgUrl: user.imgUrl },
                createdAt: Date.now(),
            }

            await onUpdateBoard(board, activity)
            toggleMenu()
            setIsGroupDeleted(isGroupDeleted => !isGroupDeleted)
        } catch (err) {
            console.log('err: ', err);
        }
    }

    function onBlurInput() {
        onEditTitleGroup()
        // setIsGroupHeaderEdit(false)
        // setCurrTitle(currTitle)
    }

    async function onChangeGroupColor(ev, color) {
        // ev.preventDefault()

        try {
            // const groupIdx = board.groups.findIndex(currGroup => currGroup.id === id)
            // console.log(groupIdx);

            // const changeBoard = board
            // changeBoard.groups[groupIdx].style.backgroundColor = color
            console.log(group);

            group.style.backgroundColor = color
            await onUpdateBoard(board)
            // setIsMenuOpen(isOpen => !isOpen)            
        } catch (err) {
            console.log('err: ', err);
        } finally {
            navigator(`/board/${board._id}`)
        }
    }

    async function onCollapse(){
          // ev.preventDefault()

          try {
            console.log(group);

            group.isCollapse = group.isCollapse? false : true
            await onUpdateBoard(board)
        } catch (err) {
            console.log('err: ', err);
        } finally {
            navigator(`/board/${board._id}`)
        }
    }

    return (
        <article className="group-preview">
            <header className="group-header">
                {isGroupHeaderEdit ?
                    <form onSubmit={onEditTitleGroup}>
                        <input autoFocus onBlur={onBlurInput} className="group-title-input" type="text" id="title" name="title" value={currTitle} onChange={handleChange} />
                        <button></button>
                    </form>
                    : <div onClick={onEditGroupHeader} className={`group-header-btn ${group?.style?.backgroundColor?.substr(1)}`}>{title}</div>
                }
                {isMenuOpen ? <GroupMenu onChangeGroupColor={onChangeGroupColor} onUpdateBoard={onUpdateBoard} board={board} group={group} isCopyGroupClicked={isCopyGroupClicked} setIsCopyGroupClicked={setIsCopyGroupClicked} setIsAddTaskClicked={setIsAddTaskClicked} setIsMenuOpen={setIsMenuOpen} onRemoveGroup={onRemoveGroup} /> : ''}
                {group.isCollapse ? <button style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} className={`group-menu-button collapse-btn ${group?.style?.backgroundColor?.substr(1)}`} onClick={onCollapse} ><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" role="presentation"><path fill={`${group.style.backgroundColor ? colorLuminance(group.style.backgroundColor, -0.55) : 'currentcolor'}`} d="M18.062 11 16.5 9.914A1 1 0 1 1 17.914 8.5l2.616 2.616c.28.167.47.5.47.884s-.19.717-.47.884L17.914 15.5a1 1 0 0 1-1.414-1.414L18.062 13h-3.68c-.487 0-.882-.448-.882-1s.395-1 .882-1zM3.47 12.884c-.28-.167-.47-.5-.47-.884s.19-.717.47-.884L6.086 8.5A1 1 0 0 1 7.5 9.914L5.938 11h3.68c.487 0 .882.448.882 1s-.395 1-.882 1h-3.68L7.5 14.086A1 1 0 0 1 6.086 15.5z" /></svg></button>
                    : <button style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} className={`group-menu-button collapse-btn ${group?.style?.backgroundColor?.substr(1)}`} onClick={onCollapse} ><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" role="presentation"><path fill={`${group.style.backgroundColor ? colorLuminance(group.style.backgroundColor, -0.55) : 'currentcolor'}`} d="M8.062 11 6.5 9.914A1 1 0 0 1 7.914 8.5l2.616 2.616c.28.167.47.5.47.884s-.19.717-.47.884L7.914 15.5A1 1 0 1 1 6.5 14.086L8.062 13h-3.68c-.487 0-.882-.448-.882-1s.395-1 .882-1zm5.408 1.884c-.28-.167-.47-.5-.47-.884s.19-.717.47-.884L16.086 8.5A1 1 0 0 1 17.5 9.914L15.938 11h3.68c.487 0 .882.448.882 1s-.395 1-.882 1h-3.68l1.562 1.086a1 1 0 0 1-1.414 1.414z" /></svg></button>}
                <button style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} className={`group-menu-button ${group?.style?.backgroundColor?.substr(1)}`} onClick={toggleMenu} ><svg width="15" height="15" role="presentation" focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M5 14C6.10457 14 7 13.1046 7 12C7 10.8954 6.10457 10 5 10C3.89543 10 3 10.8954 3 12C3 13.1046 3.89543 14 5 14ZM12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14ZM21 12C21 13.1046 20.1046 14 19 14C17.8954 14 17 13.1046 17 12C17 10.8954 17.8954 10 19 10C20.1046 10 21 10.8954 21 12Z" fill={`${group.style.backgroundColor ? colorLuminance(group.style.backgroundColor, -0.55) : 'currentcolor'}`} /></svg></button>
            </header>
            <Droppable droppableId={id}>
                {(provided) => (
                    <section {...provided.droppableProps} ref={provided.innerRef}>
                        <TaskList isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} placeholder={provided.placeholder} group={group} isLabelsClicked={isLabelsClicked} setIsLabelsClicked={setIsLabelsClicked} taskTitle={taskTitle} setTaskTitle={setTaskTitle} isAddTaskClicked={isAddTaskClicked} setIsAddTaskClicked={setIsAddTaskClicked} groupId={id} onUpdateBoard={onUpdateBoard} board={board} tasks={tasks} />
                    </section>
                )}
            </Droppable>
        </article>
    )
}