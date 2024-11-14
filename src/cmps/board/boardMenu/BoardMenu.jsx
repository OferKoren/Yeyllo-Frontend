import { useEffect, useRef, useState } from 'react'
import { Modal } from '../../Modal'
import ClickOutside from '../../ClickOutside'
import { CloseBoard } from './CloseBoard'
import { MakeTemplate } from './MakeTemplate'
import { CopyBoard } from './CopyBoard'

export function BoardMenu({ isShrink, onToggleMenu, board, onUpdateBoard }) {
    const [width, setWidth] = useState('0px')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [whichModal, setWhichModal] = useState('')
    const [position, setPosition] = useState()
    function onCloseModal() {
        setIsModalOpen(false)
        setWhichModal('')
    }
    function onToggleModal(modalChoice) {
        if (modalChoice === whichModal) {
            setIsModalOpen(false)
            setWhichModal('')
            return
        }
        setIsModalOpen(true)
        setWhichModal(modalChoice)
    }
    function onSetPosition(ev) {
        const rect = ev.currentTarget.getBoundingClientRect()
        setPosition({ left: rect.left, top: rect.top })
    }
    function getModalContent() {
        switch (whichModal) {
            case 'close board?':
                return <CloseBoard onUpdateBoard={onUpdateBoard} />
            case 'make template':
                return <MakeTemplate />
            case 'copy board':
                return <CopyBoard onToggleMenu={onToggleMenu} />
            default:
                return <></>
        }
    }
    useEffect(() => {
        setWidth('340px')
    }, [])
    useEffect(() => {
        if (isShrink) setWidth('0px')
    }, [isShrink])
    const dynamicClass = isShrink ? 'shrink' : ''
    if (!board) return
    return (
        <div className={`board-menu-wrapper`}>
            <div className={`placeholder-div ${dynamicClass}`} style={{ width: width }}></div>
            <section className={`board-menu  ${dynamicClass}`}>
                <header className="menu-header header">
                    <h3>
                        <span>menu</span>
                    </h3>
                    <button className="modal-btn close-btn" onClick={onToggleMenu}>
                        <XIcon />
                    </button>
                </header>
                <hr className="thin" />
                <section className="menu-body">
                    <div className={'main-menu'}>
                        <ul>
                            <li>
                                <button className="modal-btn menu-btn info">
                                    <InfoIcon />
                                    <div>
                                        about this board
                                        <div>Add a description to your board</div>
                                    </div>
                                </button>
                            </li>

                            <li>
                                <button className="modal-btn menu-btn">
                                    <ActivityIcon />

                                    <div>activity</div>
                                </button>
                            </li>

                            <li>
                                <button className="modal-btn menu-btn">
                                    <ArchiveIcon />
                                    <div>Archived items</div>
                                </button>
                            </li>
                            <hr className="semi-thin" />
                            <li>
                                <button className="modal-btn menu-btn">
                                    <SettingIcon />
                                    <div>settings</div>
                                </button>
                            </li>
                            <li>
                                <button className="modal-btn menu-btn">
                                    <div className="background" style={board.style}></div>
                                    <div>change background</div>
                                </button>
                            </li>
                            <li>
                                <button
                                    className="modal-btn menu-btn"
                                    onClick={(ev) => {
                                        onToggleModal('make template')
                                        if (!isModalOpen) {
                                            onSetPosition(ev)
                                        }
                                    }}
                                >
                                    <MakeTemplateIcon />
                                    <div>make template</div>
                                </button>
                            </li>
                            <hr className="semi-thin" />
                            <li>
                                <button
                                    className="modal-btn menu-btn"
                                    onClick={(ev) => {
                                        onToggleModal('copy board')
                                        if (!isModalOpen) {
                                            onSetPosition(ev)
                                        }
                                    }}
                                >
                                    <CopyBoardIcon />
                                    <div>copy board</div>
                                </button>
                            </li>
                            <li>
                                <button
                                    className="modal-btn menu-btn"
                                    onClick={(ev) => {
                                        onToggleModal('close board?')
                                        if (!isModalOpen) {
                                            onSetPosition(ev)
                                        }
                                    }}
                                >
                                    <CloseBoardIcon />
                                    <div>close board</div>
                                </button>
                            </li>
                        </ul>
                    </div>

                    <ClickOutside onClick={onCloseModal} className={'absoluteapp'}>
                        <Modal
                            title={whichModal}
                            onCloseModal={onCloseModal}
                            isOpen={isModalOpen}
                            isBlur={false}
                            position={position}
                            isBackDrop={false}
                            style={{ paddingBlockStart: '4px' }}
                            above={true}
                        >
                            {getModalContent()}
                        </Modal>
                    </ClickOutside>
                </section>
            </section>
        </div>
    )
}
function XIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12Z"
                fill="#44546f"
            />
        </svg>
    )
}
function InfoIcon() {
    return (
        <svg width="20" height="20" role="presentation" focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                fill="currentColor"
            />
            <path
                d="M11 11C11 10.4477 11.4477 10 12 10C12.5523 10 13 10.4477 13 11V16C13 16.5523 12.5523 17 12 17C11.4477 17 11 16.5523 11 16V11Z"
                fill="currentColor"
            />
            <path
                d="M13 8C13 8.55228 12.5523 9 12 9C11.4477 9 11 8.55228 11 8C11 7.44772 11.4477 7 12 7C12.5523 7 13 7.44772 13 8Z"
                fill="currentColor"
            />
        </svg>
    )
}
function ActivityIcon() {
    return (
        <svg width="20" height="20" role="presentation" focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 5C2.8955 5 2 5.89543 2 7C2 8.1045 2.89543 9 4 9C5.1045 9 6 8.10457 6 7C6 5.8955 5.10457 5 4 5Z" fill="currentColor" />
            <path
                d="M4 13C2.8955 13 2 13.8954 2 15C2 16.1045 2.89543 17 4 17C5.1045 17 6 16.1046 6 15C6 13.8955 5.10457 13 4 13Z"
                fill="currentColor"
            />
            <path
                d="M8 6C8 5.44772 8.44772 5 9 5H21C21.5523 5 22 5.44772 22 6C22 6.55228 21.5523 7 21 7H9C8.44772 7 8 6.55228 8 6Z"
                fill="currentColor"
            />
            <path
                d="M9 9C8.44772 9 8 9.44772 8 10C8 10.5523 8.44771 11 9 11H18C18.5523 11 19 10.5523 19 10C19 9.44772 18.5523 9 18 9H9Z"
                fill="currentColor"
            />
            <path
                d="M8 14C8 13.4477 8.44772 13 9 13H21C21.5523 13 22 13.4477 22 14C22 14.5523 21.5523 15 21 15H9C8.44772 15 8 14.5523 8 14Z"
                fill="currentColor"
            />
            <path
                d="M9 17C8.44772 17 8 17.4477 8 18C8 18.5523 8.44771 19 9 19H18C18.5523 19 19 18.5523 19 18C19 17.4477 18.5523 17 18 17H9Z"
                fill="currentColor"
            />
        </svg>
    )
}
function ArchiveIcon() {
    return (
        <svg width="20" height="20" role="presentation" focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M3.03418 5.59621C2.98604 5.04603 3.39303 4.56099 3.94322 4.51286L19.8823 3.11837C20.4325 3.07023 20.9175 3.47722 20.9657 4.02741L21.0528 5.0236L3.12133 6.5924L3.03418 5.59621Z"
                fill="currentColor"
            />
            <path
                d="M9 12.9999C9 12.4476 9.44772 11.9999 10 11.9999H14C14.5523 11.9999 15 12.4476 15 12.9999C15 13.5522 14.5523 13.9999 14 13.9999H10C9.44772 13.9999 9 13.5522 9 12.9999Z"
                fill="currentColor"
            />
            <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M3 18.9999V7.99993H21V18.9999C21 20.1045 20.1046 20.9999 19 20.9999H5C3.89543 20.9999 3 20.1045 3 18.9999ZM5 9.99993H19V18.9999H5L5 9.99993Z"
                fill="currentColor"
            />
        </svg>
    )
}
function SettingIcon() {
    return (
        <svg width="20" height="20" role="presentation" focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M12.0017 17.0009C9.23868 17.0009 6.99968 14.7609 6.99968 11.9989C6.99968 9.23586 9.23868 6.99686 12.0017 6.99686C14.7647 6.99686 17.0037 9.23586 17.0037 11.9989C17.0037 14.7609 14.7647 17.0009 12.0017 17.0009ZM20.3697 13.8839C19.5867 13.6119 19.0237 12.8749 19.0237 11.9989C19.0237 11.1229 19.5867 10.3859 20.3687 10.1139C20.6057 10.0319 20.7517 9.78086 20.6837 9.53986C20.4847 8.83586 20.2017 8.16886 19.8477 7.54686C19.7297 7.33886 19.4707 7.26186 19.2497 7.35186C18.8647 7.50986 18.4197 7.55086 17.9587 7.43286C17.2847 7.25886 16.7337 6.70986 16.5557 6.03686C16.4337 5.57386 16.4747 5.12686 16.6317 4.73986C16.7207 4.51986 16.6437 4.26086 16.4357 4.14286C15.8187 3.79386 15.1567 3.51386 14.4607 3.31686C14.2187 3.24886 13.9687 3.39386 13.8867 3.63086C13.6147 4.41386 12.8777 4.97686 12.0017 4.97686C11.1267 4.97686 10.3887 4.41386 10.1177 3.63186C10.0347 3.39486 9.78368 3.24886 9.54268 3.31686C8.83468 3.51686 8.16368 3.80186 7.53868 4.15886C7.33768 4.27386 7.25268 4.52586 7.34068 4.74086C7.48768 5.10186 7.53268 5.51386 7.43868 5.94386C7.28368 6.64986 6.72468 7.24086 6.02568 7.42786C5.56768 7.55086 5.12768 7.51186 4.74568 7.35986C4.52568 7.27186 4.26768 7.34986 4.15068 7.55586C3.79768 8.17786 3.51568 8.84586 3.31768 9.54986C3.24968 9.78886 3.39268 10.0369 3.62568 10.1219C4.39668 10.3999 4.94868 11.1319 4.94868 11.9989C4.94868 12.8659 4.39668 13.5979 3.62468 13.8759C3.39168 13.9599 3.24968 14.2079 3.31668 14.4469C3.49368 15.0739 3.73868 15.6729 4.03968 16.2369C4.15868 16.4589 4.43468 16.5349 4.66368 16.4299C5.25868 16.1569 6.00668 16.1659 6.76768 16.6679C6.88468 16.7449 6.99268 16.8529 7.06968 16.9689C7.59668 17.7679 7.58168 18.5489 7.26768 19.1559C7.15268 19.3789 7.21968 19.6569 7.43568 19.7839C8.08968 20.1679 8.79768 20.4709 9.54468 20.6809C9.78568 20.7489 10.0337 20.6049 10.1147 20.3679C10.3837 19.5819 11.1237 19.0149 12.0017 19.0149C12.8797 19.0149 13.6197 19.5819 13.8887 20.3679C13.9697 20.6039 14.2177 20.7489 14.4587 20.6809C15.1957 20.4739 15.8947 20.1749 16.5427 19.7979C16.7607 19.6709 16.8267 19.3899 16.7097 19.1669C16.3917 18.5589 16.3727 17.7739 16.9007 16.9719C16.9777 16.8559 17.0857 16.7469 17.2027 16.6699C17.9747 16.1589 18.7297 16.1569 19.3277 16.4399C19.5567 16.5479 19.8357 16.4729 19.9557 16.2499C20.2597 15.6859 20.5047 15.0859 20.6837 14.4569C20.7517 14.2159 20.6067 13.9659 20.3697 13.8839Z"
                fill="currentColor"
            />
        </svg>
    )
}
function MakeTemplateIcon() {
    return (
        <svg width="20" height="20" role="presentation" focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M5 3C3.89543 3 3 3.89543 3 5V7C3 7.55229 3.44772 8 4 8C4.55228 8 5 7.55229 5 7V5H7C7.55228 5 8 4.55229 8 4C8 3.44772 7.55228 3 7 3H5Z"
                fill="currentColor"
            />
            <path
                d="M21 5C21 3.89543 20.1046 3 19 3H17C16.4477 3 16 3.44772 16 4C16 4.55228 16.4477 5 17 5H19V7C19 7.55228 19.4477 8 20 8C20.5523 8 21 7.55228 21 7V5Z"
                fill="currentColor"
            />
            <path
                d="M5 21C3.89543 21 3 20.1046 3 19V17C3 16.4477 3.44772 16 4 16C4.55228 16 5 16.4477 5 17V19H7C7.55228 19 8 19.4477 8 20C8 20.5523 7.55228 21 7 21H5Z"
                fill="currentColor"
            />
            <path
                d="M4 10C3.44772 10 3 10.4477 3 11V13C3 13.5523 3.44772 14 4 14C4.55228 14 5 13.5523 5 13V11C5 10.4477 4.55228 10 4 10Z"
                fill="currentColor"
            />
            <path
                d="M11 5C10.4477 5 10 4.55228 10 4C10 3.44772 10.4477 3 11 3H13C13.5523 3 14 3.44772 14 4C14 4.55228 13.5523 5 13 5H11Z"
                fill="currentColor"
            />
            <path
                d="M14 10C14 9.44771 14.4477 9 15 9C15.5523 9 16 9.44772 16 10V14H20C20.5523 14 21 14.4477 21 15C21 15.5523 20.5523 16 20 16H16V20C16 20.5523 15.5523 21 15 21C14.4477 21 14 20.5523 14 20V16H10C9.44771 16 9 15.5523 9 15C9 14.4477 9.44772 14 10 14H14V10Z"
                fill="currentColor"
            />
        </svg>
    )
}
function CopyBoardIcon() {
    return (
        <svg width="20" height="20" role="presentation" focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M5 16V4.99188C5 3.8918 5.90195 3 7.00853 3H14.9915L15 3.00002V5H7V16H5ZM8 19C8 20.1046 8.89543 21 10 21H18C19.1046 21 20 20.1046 20 19V8C20 6.89543 19.1046 6 18 6H10C8.89543 6 8 6.89543 8 8V19ZM10 8V19H18V8H10Z"
                fill="currentColor"
            />
        </svg>
    )
}
function CloseBoardIcon() {
    return (
        <svg width="20" height="20" role="presentation" focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="11" width="18" height="2" rx="1" fill="currentColor" />
        </svg>
    )
}
