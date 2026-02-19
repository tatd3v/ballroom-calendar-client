import { Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { useTranslation } from 'react-i18next'
import { AuthProvider } from './context/AuthContext'
import { EventProvider } from './context/EventContext'
import { ThemeProvider } from './context/ThemeContext'
import Layout from './components/Layout'
import RouteLoadingSkeleton from './components/ui/skeletons/RouteLoadingSkeleton'
import LoginPageSkeleton from './components/ui/skeletons/LoginPageSkeleton'
import { CalendarPageFallback, AdminPageFallback } from './components/ui/RouteFallbacks'

// Lazy load pages for code splitting
const CalendarPage = lazy(() => import('./pages/CalendarPage'))
const AdminPage = lazy(() => import('./pages/AdminPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const EventDetailsPage = lazy(() => import('./pages/EventDetailsPage'))

function App() {
  const { t } = useTranslation()
  
  return (
    <ThemeProvider>
      <AuthProvider>
        <EventProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={
                <Suspense fallback={<CalendarPageFallback />}>
                  <CalendarPage />
                </Suspense>
              } />
              <Route path="admin" element={
                <Suspense fallback={<AdminPageFallback />}>
                  <AdminPage />
                </Suspense>
              } />
              <Route path="login" element={
                <Suspense fallback={<LoginPageSkeleton />}>
                  <LoginPage />
                </Suspense>
              } />
              <Route path="event/:eventSlug" element={
                <Suspense fallback={<RouteLoadingSkeleton />}>
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
