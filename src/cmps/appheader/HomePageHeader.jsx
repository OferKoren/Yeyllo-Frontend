import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { logout } from "../../store/actions/user.actions";

export function HomePageHeader() {

    const user = useSelector(storeState => storeState.userModule.user)

    function onLogOut(){
        logout()
    }

    return (
        <div className="home-page-headers">
            {user ? <button onClick={onLogOut} className="login-btn">Log out</button> :
                <NavLink to="login" className="login-btn">
                    Log in
                </NavLink>}
            <NavLink to="login/signup" className="signup-btn">
                Get Yeyllo for free
            </NavLink>
        </div>

    )
}
