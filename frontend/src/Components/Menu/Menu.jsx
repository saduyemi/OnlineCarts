import { useState, useContext } from 'react'
import './Menu.css'
import { LoginContext } from '../../App'
import { useNavigate } from 'react-router-dom';
import LoadingCircle from '../LoadingCircle/LoadingCircle';
import { AddPrompt, EditPrompt } from './PromptModal/Prompt'

export default function Menu() {
    const { user, folders } = useContext(LoginContext);
    const [closedModal, setClosed] = useState(true);
    const [closedEditModal, setEdit] = useState(true);
    const [foldID, setID] = useState(null);

    const navigate = useNavigate();
    let folderList = folders.items;
    console.log(folderList);
    
    
    if (user && folders) {
        return (
            <>
                { closedModal || <AddPrompt closeModal={() => setClosed(true)} />}
                { closedEditModal || <EditPrompt closeModal={() => setEdit(true)} folderID={foldID} />} 
                <div id='plusContainer' onClick={() => setClosed(false) } ><button id='plusBtn'>+</button></div>
                <ul id='folderContainer' >
                    {folderList.map((aFolder) => (
                        <li key={aFolder.folderID} onClick={() => navigate(`/shoppingcart/${aFolder.folderID}`)}>
                            <p>{aFolder.folderName}</p>
                            <p>{'Sum: $' + (aFolder.sum || 0)}</p>
                            <button onClick={() => { setEdit(false); setID(aFolder.folderID)}}>Edit</button>
                        </li>

                    ))}
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