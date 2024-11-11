import { Link, NavLink } from 'react-router-dom'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { logout } from '../store/actions/user.actions'
import ColorThief from 'colorthief'
import { useEffect, useRef, useState } from 'react'
import { Modal } from './Modal'
import { addBoard } from '../store/actions/board.actions'
import { boardService } from '../services/board'
import { AddBoard } from './workspace/modals/AddBoard'

export function AppHeader() {
    const user = useSelector((storeState) => storeState.userModule.user)
    const board = useSelector((storeState) => storeState.boardModule.board)
    const headerRef = useRef()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [position, setPosition] = useState()
    const navigate = useNavigate()
    function onCloseModal() {
        setIsModalOpen(false)
    }
    function onOpenModal() {
        setIsModalOpen(true)
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
    return (
        <header ref={headerRef} className="app-header full">
            <nav>
                <NavLink to="workspace/home" className="logo">
                    Yeyllo
                </NavLink>
                <NavLink to="workspace">workspace</NavLink>
                <NavLink to="task">Tasks</NavLink>
                <button
                    className="btn1"
                    onClick={(ev) => {
                        setIsModalOpen((prev) => !prev)
                        if (!isModalOpen) {
                            onSetPosition(ev)
                        }
                    }}
                >
                    create
                </button>
                {user?.isAdmin && <NavLink to="/admin">Admin</NavLink>}

                {!user && (
                    <NavLink to="login" className="login-link">
                        Login
                    </NavLink>
                )}
                {user && (
                    <div className="user-info">
                        <Link to={`user/${user._id}`}>
                            {/* {user.imgUrl && <img src={user.imgUrl} />} */}
                            {user.fullname}
                        </Link>
                        {/* <span className="score">{user.score?.toLocaleString()}</span> */}
                        <button onClick={onLogout}>logout</button>
                    </div>
                )}
            </nav>
            <Modal title="Create board" onCloseModal={onCloseModal} isOpen={isModalOpen} isBlur={false} position={position} /* isBackDrop={false} */>
                <AddBoard onAddBoard={onAddBoard} position={position} />
            </Modal>
        </header>
    )
}
