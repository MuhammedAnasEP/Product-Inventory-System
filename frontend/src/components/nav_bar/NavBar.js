import React from 'react'
import './navBar.css'
import { useNavigate, Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import useLogout from '../../hooks/useLogout'



function NavBar() {
  const {accessToken, user} = useAuth()
  const navigate = useNavigate()
  const logout = useLogout()
  async function onLogout() {
    await logout()
    navigate('/login')
}
  const toggleMenuOpen = () => document.body.classList.toggle("open");
  return (
    <nav class="navbar">
        <div class="navbar-overlay" onClick={toggleMenuOpen}></div>

        <button type="button" class="navbar-burger" onClick={toggleMenuOpen}>
            <span class="material-icons">menu</span>
        </button>

        <h1 class="navbar-title"><Link to='/'>Home</Link></h1>
            
            {accessToken && 
            <nav class="navbar-menu">
                <button onClick={()=>{navigate('/add-product')}} type="button" class="active" style={{ fontSize: '13px'}}>Add Product</button>
                <button onClick={onLogout} type="button" class="active" style={{fontSize: '13px'}}>Logout</button>
                <button type="button" class="active" style={{color: 'red', fontSize: '13px'}}>{user?.username}</button>
            </nav>
            }

    </nav>
  )
}

export default NavBar