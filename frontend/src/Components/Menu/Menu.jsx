import { useState, useContext } from 'react'
import './Menu.css'
import { LoginContext } from '../../App'
import { useNavigate } from 'react-router-dom';

export default function Menu() {
    const { user } = useContext(LoginContext);
    const navigate = useNavigate();

    if (user) {
        return (
            <>
                <p>Menu</p>
            </>
        );
    } else {
        navigate('/login');
    }    
}