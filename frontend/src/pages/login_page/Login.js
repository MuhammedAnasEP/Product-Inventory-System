import React, { useState } from 'react'
import './Login.css'

function Login() {

  const [formData, setFormData] = useState({username: '', password: ''})
  const [error, setError] = useState({})

  const handleChange = (e) => {
    const {name, value} = e.target
    setFormData({
      ...formData, [name]: value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formValidate()) {
      setError({})
      console.log(formData)
    }
  }

  const formValidate = () => {
    const validationErrors = {}
    let is_valid = true
    if (!formData.username.trim()) {
      validationErrors.username = "username is required"
      is_valid = false
    }

    if (!formData.password.trim()) {
      validationErrors.password = "password is required"
      is_valid = false
    }

    setError(validationErrors)
    return is_valid
  }

  return (
    <div class="container">
        <h1>Login to your account 👏</h1>
        <div class="social-login">

        </div>
        <div class="divider">
            <div class="line"></div>
        </div>

        <form onSubmit={handleSubmit}>
            <label for="username">Username:</label>
            <div class="custome-input">
                <input onChange={handleChange} type="username" name="username" placeholder="Your username" autocomplete="off" />
                <i class='bx bx-at'></i>
                {error.username && <span>{error.username}</span>}
            </div>
            <label for="password">Password:</label>
            <div class="custome-input">
                <input onChange={handleChange} type="password" name="password" placeholder="Your Password" />
                <i class='bx bx-lock-alt'></i>
                {error.password && <span>{error.password}</span>}
            </div>
            <button class="login">Login</button>
            <div class="links">
                <a href="#">Don't have an account?</a>
            </div>
        </form>

    </div>
  )
}

export default Login