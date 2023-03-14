import './App.css'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { FC, ReactElement } from 'react'

import Home from './components/Home'
import Navbar from './components/Navbar'
import Scoreboard from './components/Scoreboard'
import Login from './components/Login'
import Signup from './components/Signup'
import User from './components/User'
import React from 'react'

const App: FC = (): ReactElement => {

  return (

    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/scoreboard' element={<Scoreboard />} />
          <Route path='/user' element={<User />} />
        </Routes>
      </Router>
    </div>

  );
}

export default App;
