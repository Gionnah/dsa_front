"use client"
import LoginForm from '@/components/LoginForm'
import { useEffect, useState } from 'react'

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [isLoged, setIsLoged] = useState(true);

  const verifyLog = async () => {
      setLoading(true);
      const res = await fetch('/api/is-loged');
      if (res.ok) 
        window.location.href = '/home';
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
    return (
      <div className='h-screen w-full bg-indigo-50'>
          <LoginForm />
      </div>
    )
}
