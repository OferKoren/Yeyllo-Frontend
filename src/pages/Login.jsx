import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'

import { userService } from '../services/user'
import { login } from '../store/actions/user.actions'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'

export function Login() {
    const [users, setUsers] = useState([])
    const [credentials, setCredentials] = useState({ username: '', password: '', fullname: '' })

    const navigate = useNavigate()

    // useEffect(() => {
    //     loadUsers()
    // }, [])

    // async function loadUsers() {
    //     const users = await userService.getUsers()
    //     setUsers(users)
    // }

    async function onLogin(ev = null) {
        if (ev) ev.preventDefault()

        if (!credentials.username || !credentials.password) return
        await login(credentials)
        navigate('/')
    }

    function handleChange(ev) {
        const field = ev.target.name
        const value = ev.target.value
        setCredentials({ ...credentials, [field]: value })
    }

    const user = useSelector(storeState => storeState.userModule.user)

    console.log(user);

    return (

        <>
            <h4>Log in to continue</h4>
            <p>It looks like you've already got an account associated with this email. Log in instead or reset your password if you've forgotten it</p>

            <form className="login-form" onSubmit={onLogin}>

                <input
                    autoFocus
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
                {/* <select
                name="username"
                value={credentials.username}
                onChange={handleChange}>
                    <option value="">Select User</option>
                    {users.map(user => <option key={user._id} value={user.username}>{user.fullname}</option>)}
            </select> */}
                <button className='main-btn'>Log in</button>
            </form>
            <nav className='nav-login-signup'>
                <NavLink to="signup">Create an account</NavLink>
            </nav>
        </>
    )
}