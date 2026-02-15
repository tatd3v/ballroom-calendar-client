import { useState, useEffect } from 'react';

const MOBILE_BREAKPOINT = 768;

const getIsMobile = () =>
  typeof window !== 'undefined' && window.innerWidth <= MOBILE_BREAKPOINT;

export default function useMobile() {
  const [isMobile, setIsMobile] = useState(getIsMobile);

  useEffect(() => {
    const onResize = () => setIsMobile(getIsMobile());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return isMobile;
}
