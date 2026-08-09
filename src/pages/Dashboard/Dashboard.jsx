import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Dashboard.css'

function Dashboard() {
  const [userEmail, setUserEmail] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const email = localStorage.getItem('manzUserEmail')
    if (!email) {
      navigate('/')
      return
    }
    setUserEmail(email)
  }, [navigate])

  const handleSignOut = () => {
    localStorage.removeItem('manzUserEmail')
    navigate('/')
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-card">
        <h1>Trusting?</h1>
        <h2>{userEmail}</h2>
        <p>Really? that simple.</p>

      </div>
    </div>
  )
}

export default Dashboard
