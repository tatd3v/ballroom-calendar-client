import { createContext, useContext, useState, useEffect } from 'react'
import { authApi } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('calendar_token')
    const stored = localStorage.getItem('calendar_user')
    if (token && stored) {
      setUser(JSON.parse(stored))
      authApi.me().then(userData => {
        setUser(userData)
        localStorage.setItem('calendar_user', JSON.stringify(userData))
      }).catch(() => {
        logout()
      })
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const { token, user: userData } = await authApi.login(email, password)
      localStorage.setItem('calendar_token', token)
      localStorage.setItem('calendar_user', JSON.stringify(userData))
      setUser(userData)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('calendar_token')
    localStorage.removeItem('calendar_user')
  }

  const canEditCity = (city) => {
    if (!user) return false
    if (user.role === 'admin') return true
    return user.role === 'organizer' && user.city === city
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, canEditCity }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
