import { useState, useContext } from 'react'
import './Login.css'
import { LoginContext } from '../../App'
import { useNavigate } from 'react-router-dom'
import loginPicture from '../../Public/images/nopic.jpg'

export default function Login() {
    const [username, setUsername] = useState("Enter Username");
    const [password, setPassword] = useState("Enter Password");
    const [loginError, setError] = useState(false);

    const navigate = useNavigate();

    let errorMessage = (loginError) ? <p style={{color: 'blue', textAlign: 'center', marginTop: '1rem', marginBottom: '0rem'}}>Invalid Credentials</p> : <></>;

    let { info } = useContext(LoginContext);

    async function handleSubmit(e) {
        e.preventDefault();

        const userInfo = {username, password};

        const options = {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(userInfo)
        };
        let data;
        try {
            const response = await fetch('http://localhost:5000/login', options);

            if (response.status >= 400) { throw new Error("User Not Found"); }
            data = await response.json(); 

            console.log("Logged In, Data: ", data);
            localStorage.setItem('user', data.username);
            localStorage.setItem('id', data.userID); 
            window.dispatchEvent(new Event('storage')); // this allows useProfile hook to know that a change in localstorage has happened on the current tab
            window.dispatchEvent(new Event('refreshData')); // this allows useData hook to know that it should get data based on the new change
            navigate('/menu');
        }
        catch(err) {
            console.log(err);
            localStorage.removeItem('user'); localStorage.removeItem('id');
            setError(true);
        }
    }

    return (
        <> 
            <div className='loginContainer'>
                <div className='loginPicture'>
                    <img src={loginPicture} />
                </div>
                <form className='loginForm' onSubmit={(e) => handleSubmit(e)}>
                    <div className='loginFlex'>
                    <p id='welcome'>Welcome!</p>
                    <input type='username' id='username' className='usernameField' placeholder={username}  onChange={(e) => { handleUsername(e, setUsername); }} autoComplete='on'/>                    
                    <input type='password' id='password' className='passwordField' placeholder={password} onChange={(e) => { handlePassword(e, setPassword); }} /> 

                    <button className='loginBtn'> Login </button>
                    {errorMessage}
                    <p style={{margin: "4rem 0% 1rem 0%", display: 'inline-block'}} >Don't have an account?&nbsp;</p> 
                    <p className='signBtn' onClick={ () => navigate('/signup')} >Create Account</p> 
                    </div>
                </form>
            </div>
        </>
    );
}

function handleUsername(e, setUsername) {
    if (e.target.value === "") {
        setUsername("Enter Username");
    } else {
        setUsername(e.target.value);
    }
}

function handlePassword(e, setPassword) {
    if (e.target.value === "") {
        setPassword("Enter Password");
    } else {
        setPassword(e.target.value);
    }
}