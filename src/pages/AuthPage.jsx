import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import './AuthPage.css'

export default function AuthPage() {
  const [mode, setMode] = useState('login')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } =
      mode === 'signup'
        ? await supabase.auth.signUp({
            email,
            password,
            options: { data: { username } },
          })
        : await supabase.auth.signInWithPassword({ email, password })

    setLoading(false)
    if (error) setError(error.message)
  }

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Goatalk</h2>
        <p className="auth-form__subtitle">
          {mode === 'signup' ? 'Create an account' : 'Log in'}
        </p>

        {mode === 'signup' && (
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
        />

        {error && <p className="auth-form__error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Please wait…' : mode === 'signup' ? 'Sign up' : 'Log in'}
        </button>

        <button
          type="button"
          className="auth-form__toggle"
          onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}
        >
          {mode === 'signup' ? 'Already have an account? Log in' : 'Need an account? Sign up'}
        </button>
      </form>
    </div>
  )
}