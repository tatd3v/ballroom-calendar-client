import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { EventProvider } from './context/EventContext'
import { ThemeProvider } from './context/ThemeContext'
import Layout from './components/Layout'
import CalendarPage from './pages/CalendarPage'
import AdminPage from './pages/AdminPage'
import LoginPage from './pages/LoginPage'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <EventProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<CalendarPage />} />
              <Route path="admin" element={<AdminPage />} />
              <Route path="login" element={<LoginPage />} />
            </Route>
          </Routes>
        </EventProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
