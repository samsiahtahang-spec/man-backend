import express from 'express'
import cors from 'cors'
import pg from 'pg'
import nodemailer from 'nodemailer'

const { Pool } = pg

// Connect to Supabase PostgreSQL using your environment variable
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})

// Auto-create users table and ensure OTP columns exist
pool.query(`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    otp_code VARCHAR(10)
  );
  ALTER TABLE users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;
  ALTER TABLE users ADD COLUMN IF NOT EXISTS otp_code VARCHAR(10);
`).catch(err => console.error('Failed to update table in Supabase:', err))

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

const app = express()
app.use(cors())
app.use(express.json())

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Invalid JSON body.' })
  }
  next()
})

// REGISTER ENDPOINT: Generates 6-digit OTP & sends email
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' })
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString()

  try {
    await pool.query(
      `INSERT INTO users (email, password, is_verified, otp_code) 
       VALUES ($1, $2, false, $3)`,
      [email, password, otp]
    )

    // Send verification email
    await transporter.sendMail({
      from: `"M4NZSTOREZZ" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify Your Email - M4NZSTOREZZ',
      html: `
        <h3>Welcome to M4NZSTOREZZ!</h3>
        <p>Your 6-digit verification code is: <b>${otp}</b></p>
        <p>Enter this code in the app to activate your account.</p>
      `
    })

    return res.status(201).json({ message: 'Verification code sent to your email.' })
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Email already registered.' })
    }
    console.error('Registration/Email error:', err)
    return res.status(500).json({ error: 'Registration failed. Check server logs.' })
  }
})

// VERIFY OTP ENDPOINT: Validates user OTP code
app.post('/api/verify-otp', async (req, res) => {
  const { email, otp } = req.body
  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and verification code are required.' })
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' })
    }

    const user = result.rows[0]

    if (user.otp_code === otp) {
      await pool.query(
        'UPDATE users SET is_verified = true, otp_code = NULL WHERE email = $1',
        [email]
      )
      return res.json({ message: 'Email verified successfully! You can now log in.' })
    } else {
      return res.status(400).json({ error: 'Invalid verification code.' })
    }
  } catch (err) {
    console.error('Verification error:', err)
    return res.status(500).json({ error: 'Database error during verification.' })
  }
})

// LOGIN ENDPOINT: Ensures user email is verified before logging in
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' })
  }

  try {
    const result = await pool.query(
      'SELECT id, is_verified FROM users WHERE email = $1 AND password = $2',
      [email, password]
    )

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Email not registered or password is incorrect.' })
    }

    if (!result.rows[0].is_verified) {
      return res.status(403).json({ error: 'Please verify your email address before logging in.' })
    }

    return res.json({ message: 'Login successful.' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Database error.' })
  }
})

app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, email, password, is_verified FROM users ORDER BY id DESC')
    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`)
})