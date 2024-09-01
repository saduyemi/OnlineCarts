import { useContext } from 'react'
import './Navbar.css'

import { LoginContext } from '../../App'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {
    const { user } = useContext(LoginContext);
    const navigate = useNavigate();
    
    function signout() {
        localStorage.removeItem('user');
        localStorage.removeItem('userID');
        navigate('/login');
    }
    
    return (
        <>
            <div id='navbar'>
                <ul>
                    <li><button onClick={() => { signout() }}>Sign Out</button></li>
                </ul>
            </div>
        </>
    );
}

 