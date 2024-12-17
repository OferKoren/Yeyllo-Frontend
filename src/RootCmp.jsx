import React, { useEffect, useRef } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router'

import { HomePage } from './pages/HomePage'
import { BoardIndex } from './pages/workspace/BoardIndex.jsx'

import { BoardDetails } from './pages/BoardDetails'
import { TaskDetails } from './pages/TaskDetails'
import { UserDetails } from './pages/UserDetails'

import { AppHeader } from './cmps/appheader/AppHeader.jsx'
import { AppFooter } from './cmps/AppFooter'
import { UserMsg } from './cmps/UserMsg.jsx'
import { LoginSignup } from './pages/LoginSignup.jsx'
import { Login } from './pages/Login.jsx'
import { Signup } from './pages/Signup.jsx'
import { Workspace } from './pages/workspace/workspace.jsx'
import { Templates } from './pages/workspace/Templates.jsx'

export function RootCmp() {
    const rootRef = useRef()
    const location = useLocation()

    return (
        <div ref={rootRef} className="main-container root">
            {!location.pathname.includes('/login') && <AppHeader />}

            <main className="main-container full">
                <Routes>
                    <Route path="/" element={<Navigate to="/home" />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="workspace/home" element={<BoardIndex />} />
                    <Route path="workspace/templates" element={<Templates />} />
                    <Route path="workspace" element={<Workspace />} />

                    <Route path="board/:boardId" element={<BoardDetails rootRef={rootRef} />}>
                        <Route path=":groupId/task/:taskId" element={<TaskDetails />} />
                    </Route>

                    <Route path="task" element={<TaskDetails />} />

                    <Route path="user/:id" element={<UserDetails />} />
                    <Route path="login" element={<LoginSignup />}>
                        <Route index element={<Login />} />
                        <Route path="signup" element={<Signup />} />
                    </Route>
                </Routes>
            </main>
            <UserMsg />
            {/* {location.pathname === '/home' && <AppFooter />} */}
        </div>
    )
}
