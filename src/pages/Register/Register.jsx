import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Register.css'
import gooogleLogo from '../../assets/logos/google.png'
import apellogo from '../../assets/logos/apple.png'

function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()
  const apiUrl = import.meta.env.VITE_API_URL || 'https://man-backend-cexs.onrender.com'

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('')

    try {
      const response = await fetch(`${apiUrl}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()
      if (!response.ok) {
        setMessage(data.error || 'Registration failed.')
        return
      }

      navigate('/', {
        state: {
          info: 'GOOGLE: Registration succeeded. Please log in with your new email.',
        },
      })
    } catch (error) {
      setMessage('Unable to reach the Google server.')
    }

  }

  return (
    <div className="app">
      <div className="login_form">
        <form onSubmit={handleSubmit}>
          <h3>Register with</h3>

            <div className="loginusers">
                <div className="optionuser">
                <a href="#">
                    <img src={gooogleLogo} alt="google"/>
                    <span>Google</span>
                </a>
            </div>
            <div className="optionuser">
                <a href="#">
                    <img src={apellogo} alt="Apple"/>
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
            </div>

            <input
              type="password"
              id="password"
              placeholder="Make your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit">Register</button>

          {message && <p className="message">{message}</p>}

          <p className='signup'>Have account? <Link to="/">Log in</Link></p>
        </form>
      </div>
    </div>
  )
}

export default Register;