import { Outlet } from 'react-router'
import { NavLink } from 'react-router-dom'
import { AppHeader } from '../cmps/appheader/AppHeader'

export function LoginSignup() {
    return (
        <>
            {/* <AppHeader /> */}
            <div className="login-page">
                <div className='login-signup-container'>
                    <div className='logo'>
                        <img src="\img\login\trello-icon-light.png" alt="" />
                        {/* <img src="\img\general\trello-logo-static.gif" alt="" /> */}
                        <h2>Yeyllo</h2>
                    </div>
                    <Outlet />
                    {/* <nav>
                    <NavLink to=".">Login</NavLink>
                    <NavLink to="signup">Signup</NavLink>
                </nav> */}
                </div>
                <div className='login-background'>
                    <img src="\img\login\trello-left.svg" alt="" />
                    <img src="\img\login\trello-right.svg" alt="" />
                </div>
            </div>
        </>
    )
}