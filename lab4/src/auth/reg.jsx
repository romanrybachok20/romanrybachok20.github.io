import React, { useState } from 'react'
import { Navigate, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/authContext'
import { doCreateUserWithEmailAndPassword } from '../firebase/auth'
import './auth.css'

const Register = () => {
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isRegistering, setIsRegistering] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const { userLoggedIn } = useAuth()

    const onSubmit = async (e) => {
        e.preventDefault()
        if (!isRegistering) {
            setIsRegistering(true)
            if (password !== confirmPassword) {
                setErrorMessage('Passwords do not match')
                setIsRegistering(false)
                return
            }
            try {
                await doCreateUserWithEmailAndPassword(email, password)
            } catch (error) {
                setErrorMessage(error.message)
                setIsRegistering(false)
            }
        }
    }

    return (
        <>
            {userLoggedIn && (<Navigate to="/home" replace />)}

            <main className="auth-container">
                <div className="auth-card">
                    <h3 className="auth-title">Створення облікового запису</h3>
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
                                disabled={isRegistering}
                                type="password"
                                autoComplete="new-password"
                                placeholder='Введіть пароль'
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="auth-input-container">
                            <label className="auth-label">Підтвердіть пароль<b className='star'>*</b></label>
                            <input
                                className="auth-input"
                                disabled={isRegistering}
                                type="password"
                                autoComplete="off"
                                placeholder='Введіть пароль ще раз'
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        {errorMessage && (
                            <span className="auth-error">{errorMessage}</span>
                        )}

                        <button className="auth-btn" type="submit" disabled={isRegistering}>
                            {isRegistering ? 'Триває реєстрація...' : 'Зареєструватися'}
                        </button>

                        <div className="auth-footer">
                            Маєте вже обліковий запис? <Link to="/login" className="auth-link">Увійти</Link>
                        </div>
                    </form>
                </div>
            </main>
        </>
    )
}

export default Register
