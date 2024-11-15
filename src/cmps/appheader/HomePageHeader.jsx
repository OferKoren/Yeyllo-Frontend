import { NavLink } from "react-router-dom";

export function HomePageHeader() {
    return (
        <div className="home-page-headers">
             <NavLink to="login" className="login-btn">
                    Log in
                </NavLink>
             <NavLink to="login/signup" className="signup-btn">
                    Get Yeyllo for free
                </NavLink>
        </div>
        
    )
}
