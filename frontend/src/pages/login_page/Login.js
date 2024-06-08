import React, { useState } from 'react'
import './Login.css'
import { useNavigate } from 'react-router-dom'
import { loginURL } from '../../utils/Constants'
import axios from '../../axios/Axios'
import useAuth from '../../hooks/useAuth'
function Login() {

  const [formData, setFormData] = useState({username: '', password: ''})
  const [error, setError] = useState({})
  const [serverError, setServerError] = useState()
  const navigate = useNavigate()
  const {setCSRFToken,setAccessToken, accessToken,} = useAuth()

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
        .post(loginURL, JSON.stringify(formData))
        .then((res) => {
          setAccessToken(res?.data?.access_token);
          setCSRFToken(res.headers["x-csrftoken"]);
          console.log(accessToken,"------")
          setFormData({
            username: "",
            password: "",
          });
          navigate('/products', { replace: true });
        })
        .catch((err) => {
          console.log(err);
          if (err.code === "ERR_NETWORK") {
            setServerError("Network Error");
          } else if (err.response.status === 401) {
            setServerError(err.response.data.detail);
          }
        });
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
    <div className="container">
        <h1>Login to your account 👏</h1>
        <div className="social-login">

        </div>
        <div className="divider">
            <div className="line"></div>
        </div>

        <form onSubmit={handleSubmit}>
            <label for="username">Username:</label>
            <div className="custome-input">
                <input onChange={handleChange} type="username" name="username" placeholder="Your username" autoComplete="off" />
                <i className='bx bx-at'></i>
                {error.username && <span className='login_error'>{error.username}</span>}
            </div>
            <label for="password">Password:</label>
            <div className="custome-input">
                <input onChange={handleChange} type="password" name="password" placeholder="Your Password" />
                <i className='bx bx-lock-alt'></i>
                {error.password && <span className='login_error'>{error.password}</span>}
            </div>
            <button className="login">Login</button>
            {serverError && <div className='server_error'>
                <p>{serverError}</p>
            </div>}
            <div className="links">
                <a href="#">Don't have an account?</a>
            </div>
        </form>
    </div>
  )
}

export default Login