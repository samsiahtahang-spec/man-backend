import express from 'express'
import sqlite3 from 'sqlite3'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dbPath = path.join(__dirname, 'users.db')

const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
  if (err) {
    console.error('Failed to open database', err)
    process.exit(1)
  }
})

db.configure('busyTimeout', 30000)
db.run('PRAGMA busy_timeout = 30000')
// Keep default rollback journal mode to avoid WAL lock issues on Windows.

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      password TEXT
    )
  `)
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

app.post('/api/register', (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' })
  }

  db.run(
    'INSERT INTO users (email, password) VALUES (?, ?)',
    [email, password],
    function (err) {
      if (err) {
        if (err.code === 'SQLITE_CONSTRAINT') {
          return res.status(409).json({ error: 'Email already registered.' })
        }
        console.error(err)
        return res.status(500).json({ error: 'Database error.' })
      }

      return res.status(201).json({ message: 'Registration successful.' })
    }
  )
})

app.post('/api/login', (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' })
  }

  db.get(
    'SELECT id FROM users WHERE email = ? AND password = ?',
    [email, password],
    (err, row) => {
      if (err) {
        console.error(err)
        return res.status(500).json({ error: 'Database error.' })
      }

      if (!row) {
        return res.status(401).json({ error: 'Email not registered or password is incorrect.' })
      }

      return res.json({ message: 'Login successful.' })
    }
  )
})

app.get('/api/users', (req, res) => {
  db.all('SELECT id, email FROM users ORDER BY id DESC', (err, rows) => {
    if (err) {
      console.error(err)
      return res.status(500).json({ error: 'Database error.' })
    }
    res.json(rows)
  })
})

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`)
})
