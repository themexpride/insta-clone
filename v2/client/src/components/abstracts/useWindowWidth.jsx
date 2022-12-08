import { useState, useEffect } from 'react';

function getWindowDimensions() {
    const width = window.innerWidth
    return {
        width
    }
}

export default function useWindowWidth() {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowDimensions;
}