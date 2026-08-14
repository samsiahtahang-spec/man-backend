import express from 'express'
import cors from 'cors'
import pg from 'pg'

const { Pool } = pg

// Connect to Supabase PostgreSQL using your environment variable
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})

// Auto-create users table in Supabase if it does not exist
pool.query(`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL
  )
`).catch(err => console.error('Failed to create table in Supabase:', err))

const app = express()
app.use(cors())
app.use(express.json())

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Invalid JSON body.' })
  }
  next()
})

app.post('/api/register', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' })
  }

  try {
    await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2)',
      [email, password]
    )
    return res.status(201).json({ message: 'Registration successful.' })
  } catch (err) {
    // 23505 is PostgreSQL's error code for UNIQUE constraint violations
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Email already registered.' })
    }
    console.error(err)
    return res.status(500).json({ error: 'Database error.' })
  }
})

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' })
  }

  try {
    const result = await pool.query(
      'SELECT id FROM users WHERE email = $1 AND password = $2',
      [email, password]
    )

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Email not registered or password is incorrect.' })
    }

    return res.json({ message: 'Login successful.' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Database error.' })
  }
})

app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, email, password FROM users ORDER BY id DESC')
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