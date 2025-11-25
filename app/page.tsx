"use client"

import { useEffect, useState } from 'react';

export default function Home() {

    const [loading, setLoading] = useState(false);
    const [isLoged, setIsLoged] = useState(true);
  
    const verifyLog = async () => {
        setLoading(true);
        const res = await fetch('/api/is-loged');
        if (res.ok) 
          window.location.href = '/members/home';
        else
          setIsLoged(false);
        setLoading(false);
    }
  
    useEffect(() => {
      verifyLog();
    }, [])
    if (loading)
      return (
        <div> loading... </div>
      );
    if (!isLoged)
      window.location.href = '/login';
}
