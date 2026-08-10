import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import './Login.css'
import gooogleLogo from '../../assets/logos/google.png'
import apellogo from '../../assets/logos/apple.png'

function Login() {
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState(location.state?.info || '')
  const navigate = useNavigate()
  const apiUrl = import.meta.env.VITE_API_URL || 'https://man-backend-cexs.onrender.com'

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('')

    try {
      const response = await fetch(`${apiUrl}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()
      if (!response.ok) {
        if (data.error === 'Invalid email or password.') {
          setMessage('Email not registered or password is incorrect.')
        } else {
          setMessage(data.error || 'Login failed.')
        }
        return
      }

      localStorage.setItem('manzUserEmail', email)
      navigate('/dashboard')
    } catch (error) {
      setMessage('Unable to reach the server.')
    }
  }

  return (
    <div className="app">
      <div className="login_form">
        <form onSubmit={handleSubmit}>
          <h3>Login with</h3>

          <div className="loginusers">
            <div className="optionuser">
              <a href="#">
                <img src={gooogleLogo} alt="google" />
                <span>Google</span>
              </a>
            </div>
            <div className="optionuser">
              <a href="#">
                <img src={apellogo} alt="Apple" />
                <span>Apple</span>
              </a>
            </div>
          </div>

          <p className="separator">
            <span>or</span>
          </p>

          <div className="input_box">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input_box">
            <div className="password_title">
              <label htmlFor="password">Password</label>
              <a href="#">Forgot Password?</a>
            </div>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit">Login</button>
          {message && <p className="message">{message}</p>}

          <p className="signup">
            Dont have account? <Link to="/register">Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Login
