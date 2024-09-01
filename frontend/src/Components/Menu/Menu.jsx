import { useState, useContext } from 'react'
import './Menu.css'
import { LoginContext } from '../../App'
import { useNavigate } from 'react-router-dom';
import LoadingCircle from '../LoadingCircle/LoadingCircle';

export default function Menu() {
    const { user, folders } = useContext(LoginContext);
    const navigate = useNavigate();

    if (user && folders) {
        return (
            <>
                <div id='plusContainer'><button id='plusBtn'>+</button></div>
                <ul>
                    {}
                </ul>
            </>
        );
    } else if (user) {
        return (
            <>
                <LoadingCircle/>
            </>
        );
    } else {
        navigate('/login');
    }       
}