import { Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { AuthProvider } from './context/AuthContext'
import { EventProvider } from './context/EventContext'
import { ThemeProvider } from './context/ThemeContext'
import Layout from './components/Layout'
import FullPageLoader from './components/ui/CustomLoader'

// Lazy load pages for code splitting
const CalendarPage = lazy(() => import('./pages/CalendarPage'))
const AdminPage = lazy(() => import('./pages/AdminPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const EventDetailsPage = lazy(() => import('./pages/EventDetailsPage'))

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <EventProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={
                <Suspense fallback={<FullPageLoader text="Loading Calendar..." />}>
                  <CalendarPage />
                </Suspense>
              } />
              <Route path="admin" element={
                <Suspense fallback={<FullPageLoader text="Loading Admin..." />}>
                  <AdminPage />
                </Suspense>
              } />
              <Route path="login" element={
                <Suspense fallback={<FullPageLoader text="Loading Login..." />}>
                  <LoginPage />
                </Suspense>
              } />
              <Route path="event/:eventSlug" element={
                <Suspense fallback={<FullPageLoader text="Loading Event..." />}>
                  <EventDetailsPage />
                </Suspense>
              } />
            </Route>
          </Routes>
        </EventProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
