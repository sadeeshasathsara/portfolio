import React from 'react'
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import '@fortawesome/fontawesome-free/css/all.min.css';
import AdminDashboard from './pages/Dashboard'
import Login from './pages/Login'


function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/admin' element={<AdminDashboard />} />
      <Route path='/login' element={<Login />} />
    </Routes>
  )
}

export default App
