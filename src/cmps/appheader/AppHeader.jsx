import { Link, NavLink } from 'react-router-dom'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { showErrorMsg, showSuccessMsg } from '../../services/event-bus.service'
import { logout } from '../../store/actions/user.actions'
import ColorThief from 'colorthief'
import { useEffect, useRef, useState } from 'react'
import { Modal } from '../Modal'
import { addBoard } from '../../store/actions/board.actions'
import { boardService } from '../../services/board'
import { AddBoard } from '../workspace/modals/AddBoard'
import { Dropdown } from './Dropdown'

export function AppHeader() {
    const user = useSelector((storeState) => storeState.userModule.user)
    const board = useSelector((storeState) => storeState.boardModule.board)
    const headerRef = useRef()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [whichModal, setWhichModal] = useState('')
    const [position, setPosition] = useState()
    const navigate = useNavigate()
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

    async function onLogout() {
        try {
            await logout()
            navigate('/')
            showSuccessMsg(`Bye now`)
        } catch (err) {
            showErrorMsg('Cannot logout')
        }
    }

    useEffect(() => {
        if (board && board.urls) {
            setHeaderColorFromImage(board.urls.regular)
        } else {
            headerRef.current.style.cssText = ''
        }
    }, [board])

    function setHeaderColorFromImage(imgSrc) {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.src = imgSrc

        img.onload = () => {
            const colorThief = new ColorThief()
            const [r, g, b] = colorThief.getColor(img)

            // Set as header background color with some transparency
            const style = { backgroundColor: `rgba(${r}, ${g}, ${b}, 0.9)` }
            Object.assign(headerRef.current.style, style)
        }
    }
    async function onAddBoard(board) {
        if (!board) {
            const board = boardService.getEmptyBoard()
            board.title = prompt('TITLE?')
        }

        try {
            const savedBoard = await addBoard(board)
            navigate(`/board/${savedBoard._id}`)
            // showSuccessMsg(`Board added (id: ${savedBoard._id})`)
        } catch (err) {
            showErrorMsg('Cannot add board')
        } finally {
            setIsModalOpen(false)
            // nav
        }
    }

    function onSetPosition(ev) {
        // Get button position
        const rect = ev.target.getBoundingClientRect()
        setPosition({ left: rect.left, top: rect.bottom + 10 })
    }

    function getModalContent() {
        switch (whichModal) {
            case 'create board':
                return <AddBoard onAddBoard={onAddBoard} position={position} />
            case '':
                return null
            default:
                return <Dropdown title={whichModal} />
        }
    }
    return (
        <header ref={headerRef} className="app-header full">
            <nav>
                <NavLink to="workspace/home" className="logo">
                    Yeyllo
                </NavLink>
                {/*  <NavLink to="workspace">workspace</NavLink>
                <NavLink to="task">Tasks</NavLink> */}
                <button
                    className="btn1 header-btn recent"
                    onClick={(ev) => {
                        onToggleModal('recent')
                        if (!isModalOpen) {
                            onSetPosition(ev)
                        }
                    }}
                >
                    Recent
                    <ArrowDown />
                </button>

                <button
                    className="btn1 header-btn starred"
                    onClick={(ev) => {
                        onToggleModal('starred')
                        if (!isModalOpen) {
                            onSetPosition(ev)
                        }
                    }}
                >
                    Starred
                    <ArrowDown />
                </button>

                <button
                    className="btn1 header-btn template"
                    onClick={(ev) => {
                        onToggleModal('templates')
                        if (!isModalOpen) {
                            onSetPosition(ev)
                        }
                    }}
                >
                    Templates
                    <ArrowDown />
                </button>

                <button
                    className="btn1 create"
                    onClick={(ev) => {
                        onToggleModal('create board')
                        if (!isModalOpen) {
                            onSetPosition(ev)
                        }
                    }}
                >
                    create
                </button>
                {/*   {user?.isAdmin && <NavLink to="/admin">Admin</NavLink>}

                {!user && (
                    <NavLink to="login" className="login-link">
                        Login
                    </NavLink>
                )}
                {user && (
                    <div className="user-info">
                        <Link to={`user/${user._id}`}>
                            {user.imgUrl && <img src={user.imgUrl} />}
                            {user.fullname}
                        </Link>
                        <span className="score">{user.score?.toLocaleString()}</span>
                        <button onClick={onLogout}>logout</button>
                    </div>
                )} */}
            </nav>
            <div className="header-search-wrapper">
                <input type="text" className="input header-search" placeholder="search" />
                <img src="/img/general/search-icon.svg" alt="" />
            </div>
            <Modal title={whichModal} onCloseModal={onCloseModal} isOpen={isModalOpen} isBlur={false} position={position} /* isBackDrop={false} */>
                {getModalContent()}
            </Modal>
        </header>
    )
}
function ArrowDown() {
    return (
        <svg width="16" height="16" role="presentation" focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M11.2929 16.7071L4.22185 9.63606C3.83132 9.24554 3.83132 8.61237 4.22185 8.22185C4.61237 7.83133 5.24554 7.83133 5.63606 8.22185L12 14.5858L18.364 8.22185C18.7545 7.83132 19.3877 7.83132 19.7782 8.22185C20.1687 8.61237 20.1687 9.24554 19.7782 9.63606L12.7071 16.7071C12.3166 17.0977 11.6834 17.0977 11.2929 16.7071Z"
                fill="currentColor"
            />
        </svg>
    )
}
