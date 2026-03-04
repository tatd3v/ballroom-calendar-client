import { Outlet } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import useMobile from '../hooks/useMobile';
import AppHeader from './AppHeader';
import AppFooter from './AppFooter';

/**
 * Main layout component
 * Follows Single Responsibility Principle - handles only layout structure and theme
 */
export default function Layout() {
  const { theme } = useTheme();
  const isMobile = useMobile();

  const hideChrome = isMobile;

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-ink text-white' : ''}`}
    >
      {!hideChrome && <AppHeader />}

      <main
        className={
          hideChrome ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 py-5 md:py-8'
        }
      >
        <div className={hideChrome ? '' : 'animate-fade-in-up'}>
          <Outlet />
        </div>
      </main>

      {!hideChrome && <AppFooter />}
    </div>
  );
}
