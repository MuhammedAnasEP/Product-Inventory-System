import React, { useState } from 'react'
import './Register.css'
import { useNavigate } from 'react-router-dom'
import { registerURL } from '../../utils/Constants'
import axios from '../../axios/Axios'

function Register() {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',    
        username: '',
        email: '',
        password: '',
        confirm_password: ''
    })
    const [error, setError] = useState({})
    const [serverError, setServerError] = useState()
    const navigate = useNavigate()
  
    const handleChange = (e) => {
      const {name, value} = e.target
      setFormData({
        ...formData, [name]: value
      })
    }
  
    const handleSubmit = (e) => {
      e.preventDefault()
      setServerError()
      if (formValidate()) {
        setError({})
        axios
        .post(
          registerURL,
          JSON.stringify(formData)
        )
        .then((res) => {
        
          setFormData({
            first_name: "",
            last_name: "",
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
          });
          navigate("/login", { replace: true });
        })
        .catch((err) => {          
          if (err.code === "ERR_NETWORK") {
            setServerError("Network error. Please check after some time.");
          } else if (err.response.status === 400) {
            if (err.response.data.username) {
              setServerError(err.response.data.username);
            }

            if (err.response.data.email) {
              setServerError(err.response.data.email);
            }

            if (err.response.data.password) {
              setServerError(err.response.data.password);
            }
          }
        });
      }
    }
  
    const formValidate = () => {
      const validationErrors = {}
      let is_valid = true

      if (!formData.first_name.trim()) {
        validationErrors.first_name = "first name is required"
        is_valid = false
      }

      if (!formData.last_name.trim()) {
        validationErrors.last_name = "last name is required"
        is_valid = false
      }

      if (!formData.username.trim()) {
        validationErrors.username = "username is required"
        is_valid = false
      }else if (formData.username.length < 4) {
        validationErrors.username = "username must be at least 4 characters"
        is_valid = false
      }else if (formData.username.length > 16) {
        validationErrors.username = "username must be less than 16 characters"
        is_valid = false
      }else if (!/^[a-zA-Z0-9]+$/.test(formData.username)) {
        validationErrors.username = "username must only contain letters and numbers"
        is_valid = false
      }

      if (!formData.email.trim()) {
        validationErrors.email = "email is required"
        is_valid = false
      }else if(!/\S+@\S+\.\S+/.test(formData.email)){
        validationErrors.email = "email is not valid"
        is_valid = false
      }
  
      if (!formData.password.trim()) {
        validationErrors.password = "password is required"
        is_valid = false
      }else if(formData.password.length < 6){
        validationErrors.password = "password must be at least 6 characters"
        is_valid = false
      }

      if (!formData.confirm_password.trim()) {
        validationErrors.confirm_password = "confirm password is required"
        is_valid = false
      }

      if (formData.password !== formData.confirm_password) {
        validationErrors.confirm_password = "password doesn't match"
        is_valid = false
      }
  
      setError(validationErrors)
      return is_valid
    }
  return (
    <div className="register_container" >
        <h1>Create to your account 👏</h1>
        <div className="social-login">

        </div>
        <div className="divider">
            <div className="line"></div>
        </div>

        <form onSubmit={handleSubmit}>
            <div style={{display:'flex', justifyContent:'space-between', gap:'7px'}}>
                <div>
                    <label for="first_name">First Name:</label>
                    <div className="custome-input">
                        <input onChange={handleChange} type="text" name="first_name" id="first_name" placeholder="Your Firstname" autoComplete="off" />
                        <i className='bx bx-at'></i>
                        {error.first_name && <span className='register_error'>{error.first_name}</span>}
                    </div>
                </div>
                <div>
                    <label for="last_name">Last Name:</label>
                    <div className="custome-input">
                        <input onChange={handleChange} type="text" name="last_name" id="last_name" placeholder="Your Lastname" autoComplete="off" />
                        <i className='bx bx-at'></i>
                        {error.last_name && <span className='register_error'>{error.last_name}</span>}
                    </div>
                </div>
            </div>
            <label for="username">Username:</label>
            <div className="custome-input">
                <input onChange={handleChange} type="username" name="username" placeholder="Your username" autoComplete="off" />
                <i className='bx bx-at'></i>
                {error.username && <span className='register_error'>{error.username}</span>}
            </div>
            <label for="email">Email:</label>
            <div className="custome-input">
                <input onChange={handleChange} type="text" name="email" placeholder="Your Email" autoComplete="off" />
                <i className='bx bx-at'></i>
                {error.email && <span className='register_error'>{error.email}</span>}
            </div>
            <div style={{display:'flex', justifyContent:'space-between', gap:'7px'}}>
                <div>
                    <label for="password">Password:</label>
                    <div className="custome-input">
                        <input onChange={handleChange} type="password" name="password" placeholder="Your Password" />
                        <i className='bx bx-lock-alt'></i>
                        {error.password && <span className='register_error'>{error.password}</span>}
                    </div>
                </div>
                <div>
                    <label for="confirm_password">Confirm Password:</label>
                    <div className="custome-input">
                        <input onChange={handleChange} type="password" name="confirm_password" placeholder="Confirm Pass..." />
                        <i className='bx bx-lock-alt'></i>
                        {error.confirm_password && <span className='register_error'>{error.confirm_password}</span>}
                    </div>
                </div>
            </div>
            <button className="register">Register</button>
            {serverError && <div className='server_error'>
                <p>{serverError}</p>
            </div>}
            <div className="links" style={{marginBottom: '10px'}}>
                <a href="#">Already have an account?</a>
            </div>
        </form>

    </div>
  )
}

export default Register