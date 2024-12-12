import { useState } from 'react'
import { useNavigate } from 'react-router'

import { signup } from '../store/actions/user.actions'

import { ImgUploader } from '../cmps/ImgUploader'
import { userService } from '../services/user'
import { NavLink } from 'react-router-dom'

export function Signup() {
    const [credentials, setCredentials] = useState(userService.getEmptyUser())
    const navigate = useNavigate()

    function clearState() {
        setCredentials({ username: '', password: '', fullname: '', imgUrl: '' })
    }

    function handleChange(ev) {
        const type = ev.target.type

        const field = ev.target.name
        const value = ev.target.value
        setCredentials({ ...credentials, [field]: value })
    }

    async function onSignup(ev = null) {
        if (ev) ev.preventDefault()

        if (!credentials.username || !credentials.password || !credentials.fullname) return

        try {
            const checkedUser = await signup(credentials)
            clearState()

            checkedUser ? navigate('/workspace/home') : navigate('/login')
        } catch (err) {
            console.log('err:', err)
        }

    }

    function onUploaded(imgUrl) {
        setCredentials({ ...credentials, imgUrl })
    }

    return (
        <>
            <form className="signup-form" onSubmit={onSignup}>
                <input
                    autoFocus
                    type="text"
                    name="fullname"
                    value={credentials.fullname}
                    placeholder="Full name"
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="username"
                    value={credentials.username}
                    placeholder="Enter your email"
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    value={credentials.password}
                    placeholder="Enter password"
                    onChange={handleChange}
                    required
                />
                <ImgUploader onUploaded={onUploaded} />
                <button className='main-btn'>Sign up</button>
            </form>
            <nav className='nav-login-signup'>
                <NavLink to="/login">Already have an Yeyllo account? Log in</NavLink>
            </nav>
        </>

    )
}