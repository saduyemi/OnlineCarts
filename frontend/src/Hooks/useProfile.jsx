import { useState, useEffect } from 'react'

// Function gets value of the key named "user" in localstorage
function getUser() {
    if (!localStorage.user) { return null; }    // if user does not exit in local storage 

    const text = localStorage.getItem('user');
    return text;
}

// Custom hook to check for any changes in localstorage with the key user
// 'user' specifies current user logged in the browser for the web app
export function useProfile() {
    const [profile, setProfile] = useState(getUser());

    useEffect(() => { 
        function handleChangeStorage() {
            setProfile(getUser());
        }

        window.addEventListener('storage', handleChangeStorage); // handleChangeStorage is now called whenever an event occurs in storage

        return () => window.removeEventListener('storage', handleChangeStorage);
    }, [])

    return profile;
}