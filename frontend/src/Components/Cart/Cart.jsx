import { useState,useEffect } from 'react'
import { useParams } from 'react-router-dom';

import './Cart.css'
import LoadingCircle from '../LoadingCircle/LoadingCircle';
import { AddItemPrompt, EditItemPrompt } from './Modals/ItemPrompt';

export default function Cart() {
    const { cartID } = useParams();
    const [completed, setCompleted] = useState(false);
    const [items, setItems] = useState([]);    
    const [closedAddModal, setAddClosed] = useState(true);
    const [closedEditModal, setEditClosed] = useState(true);
    const [currItem, setItem] = useState(null);

    useEffect(() => {
        async function getInitItems() {
            const response = await fetch(`http://localhost:5000/get_items/${cartID}`)
            const data = await response.json();
            console.log(data['items']);
            setItems(data['items']);
            setCompleted(true);
        }

        getInitItems();
    }, [])

    async function refreshItems() {
        console.log("In Refresh");
        const response = await fetch(`http://localhost:5000/get_items/${cartID}`)
        setCompleted(false);
        const data = await response.json();
        console.log('Refreshed', data);
        setItems(data['items']);
        setCompleted(true);
    }

    async function handleDelete(e, itemID) {
        e.preventDefault();
        const data = { itemID };
        const options = { method: "DELETE", headers: {'Content-Type' : 'application/json'}, body: JSON.stringify(data)};

        const response = await fetch('http://localhost:5000/delete_item', options);
        const feedback = await response.json();       

        refreshItems();

        console.log(feedback);
    } 

    if (completed && items) {
        return (
            <>
                {closedAddModal || <AddItemPrompt folderID={cartID} refreshItems={() => refreshItems()} closeModal={() => setAddClosed(true)} />}
                {closedEditModal || <EditItemPrompt item={currItem} refreshItems={() => refreshItems()} closeModal={() => setEditClosed(true)} />}
                <button className='addItems' onClick={() => setAddClosed(false) } >+</button>
                <ul className='itemsContainer'>
                    {items.map((anItem) => (
                        <li key={anItem.itemID}>
                            <p>{anItem.itemName}</p>
                            <p>{anItem.itemPrice}</p>
                            <button style={{marginRight: '1rem'}} onClick={() => { setItem(anItem); setEditClosed(false); }} >Edit</button>
                            <button onClick={(e) => handleDelete(e, anItem.itemID) }>Delete</button>
                        </li>
                    ))}
                </ul>
            </>
        );
    } else {
        return (<LoadingCircle />);
    }
}

