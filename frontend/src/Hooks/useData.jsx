import { useState, useEffect } from 'react'

async function getData() {
    console.log("useData called");

    if (!localStorage.id) { return {data: null, completed: true}; }

    try {
        const response = await fetch(`http://localhost:5000/get_folders/${localStorage.id}`);
        
        if (response.status >= 400) { throw new Error("No Good"); }

        const data = await response.json();
        console.log(data);
        return {data, completed: true};
    }
    catch (err) {
        console.log(err);
        return {data: null, completed: true}
    }
}

// Custom hook fetches data for logged in user from backend server
// hook also automatically refreshes data when a change has happened by adding an event listener to localstorage
export function useData() {
    const [items, setItems] = useState([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        async function handleDataChange() {
            let result = await getData();
            setItems(result.data);
            setLoaded(true);
        }

        handleDataChange(); // called first time a variable is initialized by calling this hook
        window.addEventListener('refreshData', handleDataChange); // called other times when a 'refreshData' event occurs

        return () => window.removeEventListener('refreshData', handleDataChange);
    }, []);

    return {items, loaded}
}