import { useState } from "react";
import './Prompt.css'

export function AddPrompt({closeModal}) {
    const [name, setName] = useState("");

    async function handleConfirm(e) {
        e.preventDefault();
        if (name === '') { return; }

        const data = {
            userID: localStorage.getItem("id"),
            name: name
        }

        const options = {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        };

        const response = await fetch('http://localhost:5000/create_folder', options);
        const feedback = await response.json();

        console.log(feedback);
        window.dispatchEvent( new Event('refreshData'));
        closeModal();
    }

    return (
        <>
            <div className="addContainer">
                <p className="close" onClick={() => closeModal()}>&times;</p>
                <br/>
                <div className="addContent">
                    <input type="text" placeholder="Enter New Folder Name: " value={name} onChange={(e) => setName(e.target.value)}/>
                    <button onClick={(e) => handleConfirm(e)}>Confirm</button>
                </div>
            </div>
        </>
    );
}

export function EditPrompt({closeModal, folderID}) {
    const [name, setName] = useState("");
    
    async function handleUpdate(e) {
        e.preventDefault();
        if (name === '') {
            return;
        }

        const data = {
            folderID: folderID,
            name: name
        };

        const options = {
            method: "POST",
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify(data)
        }

        const response = await fetch('http://localhost:5000/update_folder', options);
        const feedback = await response.json();
        console.log(feedback);
        window.dispatchEvent(new Event("refreshData"));
        closeModal();
    }

    async function handleDelete(e) {
        e.preventDefault();
        const data = { folderID };
        const options = { method: "DELETE", headers: {'Content-Type' : 'application/json'}, body: JSON.stringify(data)};

        const response = await fetch('http://localhost:5000/delete_folder', options);
        const feedback = await response.json();
        console.log(feedback);
        window.dispatchEvent(new Event("refreshData"));
        closeModal();
    }

    return (
        <>  
            <p className="close" onClick={() => closeModal()}>&times;</p>
            <br/>
            <div className="editContent">
                <input type="text" placeholder="Enter New Folder Name: " value={name} onChange={(e) => setName(e.target.value)}/>
                <button className="confirm" onClick={(e) => handleUpdate(e)}  >Confirm</button>
                <button className="delete" onClick={(e) => handleDelete(e)}>Delete Folder</button>
            </div>
        </>
    );
}