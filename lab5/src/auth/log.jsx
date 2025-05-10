import React, { useState } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { doSignInWithEmailAndPassword } from '../firebase/auth'
import { useAuth } from '../context/authContext'
import './auth.css'

const Login = () => {
    const { userLoggedIn } = useAuth()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isSigningIn, setIsSigningIn] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    
    const onSubmit = async (e) => {
        e.preventDefault()
        if (!isSigningIn) {
            setIsSigningIn(true)
            try {
                await doSignInWithEmailAndPassword(email, password)
            } catch (error) {
                setErrorMessage(error.message)
                setIsSigningIn(false)
            }
        }
    }

    return (
        <div>
            {userLoggedIn && (<Navigate to="/MyCity" replace />)}

            <main className="auth-container">
                <div className="auth-card">
                    <h3 className="auth-title">Авторизація</h3>
                    <form onSubmit={onSubmit} className="auth-form">
                        <div className="auth-input-container">
                            <label className="auth-label">Email<b className='star'>*</b></label>
                            <input
                                className="auth-input"
                                type="email"
                                autoComplete="email"
                                placeholder='example@email.com'
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="auth-input-container">
                            <label className="auth-label">Пароль<b className='star'>*</b></label>
                            <input
                                className="auth-input"
                                type="password"
                                autoComplete="current-password"
                                placeholder='Введіть пароль'
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {errorMessage && (
                            <span className="auth-error">{errorMessage}</span>
                        )}

                        <button className="auth-btn" type="submit" disabled={isSigningIn}>
                            {isSigningIn ? 'Триває вхід...' : 'Увійти'}
                        </button>
                    </form>

                    <p className="auth-footer">
                        Не маєте облікового запису? <Link to="/register" className="auth-link">Зареєструватись</Link>
                    </p>
                </div>
            </main>
        </div>
    )
}

export default Login
