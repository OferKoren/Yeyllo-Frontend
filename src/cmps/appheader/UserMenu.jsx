import { useNavigate } from "react-router";
import ClickOutside from "../ClickOutside";

export function UserMenu({ setIsImgClicked, setIsUserMenuOpen, user }) {

    const navigate = useNavigate()
    console.log(user);

    return (
        <ClickOutside onClick={() => {
            setIsUserMenuOpen(false)
        }}> <div className="user-menu">
                <h5>Account</h5>
                <div className='flex align-center'>
                    <img style={{ width: '3em', marginInlineEnd: '1em', borderRadius: '50%' }} src={user?.imgUrl} alt="" />
                    <span style={{ fontSize: '0.9em', color: 'black' }}>{user?.fullname}</span>
                </div>
                <hr />
                {user.fullname === 'Guest' ?
                    <span className='logout-user-menu' style={{ cursor: 'pointer' }} onClick={() => { navigate('/login'); setIsUserMenuOpen(false) }}>Log in</span>
                    : <span className='logout-user-menu' style={{ cursor: 'pointer' }} onClick={() => { logout(); setIsUserMenuOpen(false) }}>Log out</span>


                }
            </div> </ClickOutside >
    )
}