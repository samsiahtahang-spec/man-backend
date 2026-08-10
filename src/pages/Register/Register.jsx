import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Register.css'
import gooogleLogo from '../../assets/logos/google.png'
import apellogo from '../../assets/logos/apple.png'

function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [message, setMessage] = useState('')
  const navigate = useNavigate()
  const apiUrl = import.meta.env.VITE_API_URL || 'https://man-backend-cexs.onrender.com'

  // Step 1: Submit email & password, send OTP
  const handleRegister = async (event) => {
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

      setIsOtpSent(true)
      setMessage('Verification code sent! Please check your email inbox.')
    } catch (error) {
      setMessage('Unable to reach the server.')
    }
  }

  // Step 2: Verify the 6-digit code
  const handleVerifyOtp = async (event) => {
    event.preventDefault()
    setMessage('')

    try {
      const response = await fetch(`${apiUrl}/api/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      })

      const data = await response.json()
      if (!response.ok) {
        setMessage(data.error || 'Verification failed.')
        return
      }

      navigate('/', {
        state: {
          info: 'Email verified successfully! You can now log in.',
        },
      })
    } catch (error) {
      setMessage('Unable to reach the server.')
    }
  }

  return (
    <div className="app">
      <div className="login_form">
        {!isOtpSent ? (
          /* Step 1 Form: Registration */
          <form onSubmit={handleRegister}>
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

            <button type="submit">Send Code</button>

            {message && <p className="message">{message}</p>}

            <p className='signup'>Have account? <Link to="/">Log in</Link></p>
          </form>
        ) : (
          /* Step 2 Form: Enter Verification Code */
          <form onSubmit={handleVerifyOtp}>
            <h3>Verify Code</h3>
            <p style={{ textAlign: 'center', fontSize: '14px', color: '#888', marginBottom: '15px' }}>
              We sent a code to <strong>{email}</strong>
            </p>

            <div className="input_box">
              <label htmlFor="otp">6-Digit Code</label>
              <input
                type="text"
                id="otp"
                placeholder="Enter verification code"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>

            <button type="submit">Verify & Finish</button>

            {message && <p className="message">{message}</p>}

            <p className='signup'>
              Wrong email?{' '}
              <span 
                style={{ cursor: 'pointer', color: '#007bff', textDecoration: 'underline' }} 
                onClick={() => setIsOtpSent(false)}
              >
                Go back
              </span>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}

export default Register;