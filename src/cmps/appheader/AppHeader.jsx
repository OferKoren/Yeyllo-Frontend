import { Link, NavLink } from 'react-router-dom'
import { useLocation, useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { showErrorMsg, showSuccessMsg } from '../../services/event-bus.service'
import { login, logout } from '../../store/actions/user.actions'
import ColorThief from 'colorthief'
import { useEffect, useRef, useState } from 'react'
import { Modal } from '../Modal'
import { addBoard, setBrightness } from '../../store/actions/board.actions'
import { boardService } from '../../services/board'
import { AddBoard } from '../workspace/modals/AddBoard'
import { Dropdown } from './Dropdown'
import { createCssFilter, darkenColor, getBrightnessLevel, lightenColor } from '../../services/util.service'
import { HomePageHeader } from './HomePageHeader'
import ClickOutside from '../ClickOutside'
import { UserMenu } from './userMenu'

export function AppHeader() {
    const user = useSelector((storeState) => storeState.userModule.user)
    const board = useSelector((storeState) => storeState.boardModule.board)
    const headerRef = useRef()
    const inputRef = useRef()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [whichModal, setWhichModal] = useState('')
    const [position, setPosition] = useState()
    const [inputClass, setInputClass] = useState('')

    const [isImgClicked, setIsImgClicked] = useState(false)
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

    const navigate = useNavigate()
    const location = useLocation()

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
        if (location.pathname === '/workspace/home') {
            setHeaderColorFromColor('rgb(255,255,255,1)', true)
            return
        }
        if (board && board.urls) {
            const regex = new RegExp('^rgba?\\(\\s*(\\d{1,3})\\s*,\\s*(\\d{1,3})\\s*,\\s*(\\d{1,3})(?:\\s*,\\s*(0|0?\\.\\d+|1))?\\s*\\)$')
            if (regex.test(board.urls.regular) && headerRef.current) {
                setHeaderColorFromColor(board.urls.regular)
            }
            setHeaderColorFromImage(board.urls.regular)
        } else {
            headerRef.current.style.cssText = ''
        }
    }, [board.style])

    useEffect(() => {
        if (!headerRef.current) return
        if (isModalOpen) headerRef.current.style.zIndex = '5'
    }, [isModalOpen])

    function setHeaderColorFromImage(imgSrc) {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.src = imgSrc

        img.onload = () => {
            const colorThief = new ColorThief()
            const [r, g, b] = colorThief.getColor(img)
            const baseColor = `rgba(${r}, ${g}, ${b}, 0.9)`
            // Set as header background color with some transparency
            const brightness = getBrightnessLevel(baseColor)
            setHeaderTheme(brightness)
            const style = { backgroundColor: `${darkenColor(baseColor, 0)}` }

            Object.assign(headerRef.current.style, style)
        }
    }

    function setHeaderColorFromColor(color, isWorkspace = false) {
        const darkerColor = isWorkspace ? color : darkenColor(color, 45)
        const style = { backgroundColor: `${darkerColor}` }
        const brightness = getBrightnessLevel(color)
        setHeaderTheme(brightness)
        Object.assign(headerRef.current.style, style)
    }

    function setHeaderTheme(brightness) {
        setBrightness(brightness)
        if (brightness === 1) {
            headerRef.current.style.color = 'rgb(23, 43, 77)'
        } else {
            headerRef.current.style.color = 'rgb(255,255,255)'
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
        }
    }

    function onSetPosition(ev) {
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
                return <Dropdown title={whichModal} setIsModalOpen={setIsModalOpen} />
        }
    }

    function handleBlur() {
        setInputClass('')
    }

    function handleFocus() {
        setInputClass('enlarged')
    }

    async function onUserMenu() {
        try {
            if (!isUserMenuOpen && !isImgClicked) {
                setIsImgClicked(true)
                setIsUserMenuOpen(true)
            } else if (!!isUserMenuOpen && !!isImgClicked) {
                setIsImgClicked(false)
                setIsUserMenuOpen(false)
            } else if (!isUserMenuOpen && !!isImgClicked) {
                setIsUserMenuOpen(true)
                setIsImgClicked(false)
            } else if (!!isUserMenuOpen && !isImgClicked) {
                setIsUserMenuOpen(false)
                setIsImgClicked(true)
            }
        } catch (err) {
            console.log('err:', err)
        }
    }

    const [credentials, setCredentials] = useState({ username: 'guest@yeyllo.com', password: '123', fullname: 'Guest' })

    async function onLogin(ev = null) {
        if (ev) ev.preventDefault()

        try {
            if (!credentials.username || !credentials.password) return
            const checkedUser = await login(credentials)
            checkedUser ? navigate('/workspace/home') : navigate('/login')
        } catch (err) {
            console.log('err:', err)
        }
    }

    return (
        <header ref={headerRef} className="app-header full">
            <nav>
                {location.pathname !== '/home' && (
                    <NavLink to="/home" className="homepage-link">
                        <NineDots />
                    </NavLink>
                )}
                {!user || user.fullname === 'Guest' ? (
                    <button className="logo header-btn" onClick={onLogin}>
                        <TrelloLogo />
                        Yeyllo
                    </button>
                ) : (
                    <NavLink to={`${!user || user.fullname === 'Guest' ? '/' : '/workspace/home'}`} className="logo">
                        <TrelloLogo />
                        Yeyllo
                    </NavLink>
                )}
                {location.pathname !== '/home' ? <HeaderMainNav /> : <HomePageHeader />}

            </nav>


            {location.pathname !== '/home' && (
                <>
                    {isModalOpen && (
                        <ClickOutside onClick={onCloseModal} className={'absoluteapp'}>
                            <Modal
                                title={whichModal}
                                onCloseModal={onCloseModal}
                                isOpen={isModalOpen}
                                isBlur={false}
                                position={position}
                                isBackDrop={false}
                            >
                                {getModalContent()}
                            </Modal>
                        </ClickOutside>
                    )}

                    <div className={`header-search-wrapper ${inputClass}`}>
                    </div>
                    <div className="flex align-center">
                        {user ? (
                            <img
                                className="user-img-header"
                                onClick={onUserMenu}
                                style={{ width: '1.6em', marginInlineEnd: '0.3em', cursor: 'pointer' }}
                                src={user?.imgUrl}
                                alt=""
                            />
                        ) : (
                            ''
                        )}

                        {isUserMenuOpen ? <UserMenu setIsImgClicked={setIsImgClicked} setIsUserMenuOpen={setIsUserMenuOpen} user={user} /> : ''}
                    </div>
                </>
            )}
        </header>
    )

    function HeaderMainNav() {
        return (
            <>
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
            </>
        )
    }
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
function NineDots() {
    return (
        <svg width="20" height="20" role="presentation" focusable="false" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
                fillRule="evenodd"
                d="M4 5C4 4.44772 4.44772 4 5 4H7C7.55228 4 8 4.44772 8 5V7C8 7.55228 7.55228 8 7 8H5C4.44772 8 4 7.55228 4 7V5ZM4 11C4 10.4477 4.44772 10 5 10H7C7.55228 10 8 10.4477 8 11V13C8 13.5523 7.55228 14 7 14H5C4.44772 14 4 13.5523 4 13V11ZM11 4C10.4477 4 10 4.44772 10 5V7C10 7.55228 10.4477 8 11 8H13C13.5523 8 14 7.55228 14 7V5C14 4.44772 13.5523 4 13 4H11ZM10 11C10 10.4477 10.4477 10 11 10H13C13.5523 10 14 10.4477 14 11V13C14 13.5523 13.5523 14 13 14H11C10.4477 14 10 13.5523 10 13V11ZM17 4C16.4477 4 16 4.44772 16 5V7C16 7.55228 16.4477 8 17 8H19C19.5523 8 20 7.55228 20 7V5C20 4.44772 19.5523 4 19 4H17ZM16 11C16 10.4477 16.4477 10 17 10H19C19.5523 10 20 10.4477 20 11V13C20 13.5523 19.5523 14 19 14H17C16.4477 14 16 13.5523 16 13V11ZM5 16C4.44772 16 4 16.4477 4 17V19C4 19.5523 4.44772 20 5 20H7C7.55228 20 8 19.5523 8 19V17C8 16.4477 7.55228 16 7 16H5ZM10 17C10 16.4477 10.4477 16 11 16H13C13.5523 16 14 16.4477 14 17V19C14 19.5523 13.5523 20 13 20H11C10.4477 20 10 19.5523 10 19V17ZM17 16C16.4477 16 16 16.4477 16 17V19C16 19.5523 16.4477 20 17 20H19C19.5523 20 20 19.5523 20 19V17C20 16.4477 19.5523 16 19 16H17Z"
                fill="currentColor"
            />
        </svg>
    )
}
function TrelloLogo() {
    return (
        <svg style={{ marginInlineStart: "0" }} xmlns="http://www.w3.org/2000/svg" width="16" viewBox="0 0 73.323 64" height="16">
            <defs>
                <linearGradient id="A" x1="31.52" y1="64.56" x2="31.52" y2="1.51" gradientUnits="userSpaceOnUse">
                    <stop offset=".18" stopColor="currentColor" />
                    <stop offset="1" stopColor="currentColor" />
                </linearGradient>
            </defs>
            <path
                d="M55.16 1.5H7.88a7.88 7.88 0 0 0-5.572 2.308A7.88 7.88 0 0 0 0 9.39v47.28a7.88 7.88 0 0 0 7.88 7.88h47.28A7.88 7.88 0 0 0 63 56.67V9.4a7.88 7.88 0 0 0-7.84-7.88zM27.42 49.26A3.78 3.78 0 0 1 23.64 53H12a3.78 3.78 0 0 1-3.8-3.74V13.5A3.78 3.78 0 0 1 12 9.71h11.64a3.78 3.78 0 0 1 3.78 3.78zM54.85 33.5a3.78 3.78 0 0 1-3.78 3.78H39.4a3.78 3.78 0 0 1-3.78-3.78v-20a3.78 3.78 0 0 1 3.78-3.79h11.67a3.78 3.78 0 0 1 3.78 3.78z"
                fill="url(#A)"
                fillRule="evenodd"
                transform="matrix(1.163111 0 0 1.163111 .023263 -6.417545)"
            />
        </svg>
    )
}
