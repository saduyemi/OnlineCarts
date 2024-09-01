import { useState, useEffect, createContext } from 'react'
import './App.css'

import Login from './Components/Login/Login'
import Signup from './Components/Signup/Signup'
import Menu from './Components/Menu/Menu'
import Cart from './Components/Cart/Cart'
import LoadingCircle from './Components/LoadingCircle/LoadingCircle'
import Navbar from './Components/Navbar/Navbar'

import { useProfile } from './Hooks/useProfile'
import { useData } from './Hooks/useData'
import { createCustomEvent } from './Public/events/createCustomEvent';


import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';

export const LoginContext = createContext(null);

function App() {  
  const user = useProfile();
  let defaultPath = (user) ? <Menu/> : <Login/>;

  useEffect(() => {
    createCustomEvent("refreshData", {"message": "Event for useData hook to depend/comply by in order to automatically refresh data based on certain actions in the application"})
    
  }, []);

  const folders = useData();

  return (
    <>
      <LoginContext.Provider value={{user, folders }}>
        <Router>
          {user && <Navbar/>}
          <Routes>
            <Route path='/login' element={<Login/>} />
            <Route path='/signup' element={<Signup/>} />
            <Route path='/' element={defaultPath} />
            <Route path='/menu' element={<Menu />} />
            <Route path='/shoppingcart' element={<Cart/>} />
          </Routes>
        </Router>
      </LoginContext.Provider>
    </>
  )
}

export default App
