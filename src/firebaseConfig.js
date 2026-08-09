// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyCVNQqNF4U0e85UXQYKQuKvypZJYSQyTp8',
  authDomain: 'muehehe-4dc7e.firebaseapp.com',
  projectId: 'muehehe-4dc7e',
  storageBucket: 'muehehe-4dc7e.firebasestorage.app',
  messagingSenderId: '418440368834',
  appId: '1:418440368834:web:1a6784a083fafeda8fa15b',
  measurementId: 'G-T0L4EY4EY3'
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

export { auth, db }
