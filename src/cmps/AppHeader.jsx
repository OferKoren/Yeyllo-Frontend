import { Link, NavLink } from 'react-router-dom'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { logout } from '../store/actions/user.actions'
import ColorThief from 'colorthief'
import { useEffect, useRef } from 'react'

export function AppHeader() {
    const user = useSelector((storeState) => storeState.userModule.user)
    const board = useSelector((storeState) => storeState.boardModule.board)
    const headerRef = useRef()
    const navigate = useNavigate()

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

    return (
        <header ref={headerRef} className="app-header full">
            <nav>
                <NavLink to="workspace/home" className="logo">
                    Yeyllo
                </NavLink>
                <NavLink to="workspace">workspace</NavLink>
                <NavLink to="task">Tasks</NavLink>

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
        </header>
    )
}
