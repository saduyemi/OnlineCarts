import { useState } from "react";
import './ItemPrompt.css';

export function AddItemPrompt({folderID, closeModal, refreshItems}) {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");

    async function handleConfirm(e) {
        e.preventDefault();
        if (name === '' || price === '') { return; }

        const data = {
            folderID,
            itemName : name,
            itemPrice : price
        };

        const options = {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        };

        const response = await fetch('http://localhost:5000/create_item', options);
        const feedback = await response.json();
        
        refreshItems();

        console.log(feedback);
        
        closeModal();
    }

    return (
        <>
            <div className="addItemContainer">
                <p className="close" onClick={() => closeModal()}>&times;</p>
                <br/>
                <div className="addItemContent">
                    <input type="text" placeholder="Enter New Item Name: " value={name} onChange={(e) => setName(e.target.value)}/>
                    <input type="text" placeholder="Enter New Item Price: " value={price} onChange={(e) => setPrice(e.target.value)}/>

                    <button onClick={(e) => handleConfirm(e)}>Confirm</button>
                </div>
            </div>
        </>
    );
}

export function EditItemPrompt({item, closeModal, refreshItems}) {
    const [name, setName] = useState(item['itemName']);
    const [price, setPrice] = useState(item['itemPrice']);

    async function handleConfirm(e) {
        e.preventDefault();
        if (name === '' || price === '') { return; }

        const data = {
            itemID : item['itemID'],
            uName : name,
            uPrice : price
        };

        const options = {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        };

        const response = await fetch('http://localhost:5000/update_item', options);
        const feedback = await response.json();
        
        refreshItems();

        console.log(feedback);
        
        closeModal();
    }

    return (
        <>
            <div className="addItemContainer">
                <p className="close" onClick={() => closeModal()}>&times;</p>
                <br/>
                <div className="addItemContent">
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)}/>
                    <input type="text" value={price} onChange={(e) => setPrice(e.target.value)}/>

                    <button onClick={(e) => handleConfirm(e)}>Confirm</button>
                </div>
            </div>
        </>
    );
}