import React, { useEffect, useRef } from 'react'
import { Routes, Route, useLocation } from 'react-router'

import { HomePage } from './pages/HomePage'
// import { AboutUs, AboutTeam, AboutVision } from './pages/AboutUs'
// import { BoardIndex } from './pages/workspace/BoardIndex.jsx'
import { BoardIndex } from './pages/workspace/BoardIndex.jsx'
import { ReviewIndex } from './pages/ReviewIndex.jsx'
import { ChatApp } from './pages/Chat.jsx'
// import { AdminIndex } from './pages/AdminIndex.jsx'

import { BoardDetails } from './pages/BoardDetails'
import { TaskDetails } from './pages/TaskDetails'
import { UserDetails } from './pages/UserDetails'

import { AppHeader } from './cmps/AppHeader'
import { AppFooter } from './cmps/AppFooter'
import { UserMsg } from './cmps/UserMsg.jsx'
import { LoginSignup } from './pages/LoginSignup.jsx'
import { Login } from './pages/Login.jsx'
import { Signup } from './pages/Signup.jsx'
import { Workspace } from './pages/workspace/workspace.jsx'

export function RootCmp() {
    const rootRef = useRef()
    const location = useLocation()
    useEffect(() => {
        console.log(location)
    }, [location])
    return (
        <div ref={rootRef} className="main-container root">
            <AppHeader />
            {/* <UserMsg /> */}

            <main className="main-container full">
                <Routes>
                    <Route path="/home" element={<HomePage />} />
                    {/* <Route path="about" element={<AboutUs />}>
                        <Route path="team" element={<AboutTeam />} />
                        <Route path="vision" element={<AboutVision />} />
                    </Route> */}
                    <Route path="workspace/home" element={<BoardIndex />} />
                    <Route path="workspace" element={<Workspace />} />

                    <Route path="board/:boardId" element={<BoardDetails rootRef={rootRef} />}>
                        <Route path=":groupId/task/:taskId" element={<TaskDetails />} />
                    </Route>

                    <Route path="task" element={<TaskDetails />} />

                    <Route path="user/:id" element={<UserDetails />} />
                    <Route path="review" element={<ReviewIndex />} />
                    <Route path="chat" element={<ChatApp />} />
                    {/* <Route path="admin" element={<AdminIndex />} /> */}
                    <Route path="login" element={<LoginSignup />}>
                        <Route index element={<Login />} />
                        <Route path="signup" element={<Signup />} />
                    </Route>
                </Routes>
            </main>
            {location.pathname === '/home' && <AppFooter />}
        </div>
    )
}
