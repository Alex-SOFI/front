import { useEffect, useState } from 'react';

const getWindowWidth = () => {
  const { innerWidth: width } = window;
  return width;
};

const useIsMobile = () => {
  const [windowWidth, setWindowWidth] = useState(getWindowWidth());
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(getWindowWidth());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (windowWidth < 640) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }, [windowWidth]);

  return isMobile;
};

export default useIsMobile;
