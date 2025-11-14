"use client"
import LoginForm from '@/components/LoginForm'
import { useEffect, useState } from 'react'

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [isLoged, setIsLoged] = useState(false);

  const verifyLog = async () => {
      setLoading(true);
      const res = await fetch('/api/me');
      if (res.ok) window.location.href = '/home';
      setLoading(false);
      setIsLoged(true);
  }

  useEffect(() => {
    verifyLog();
  }, [isLoged, loading])
  if (loading)
    return (
      <div> loading... </div>
    );
  if (isLoged)
    return (
      <div className='h-screen w-full bg-indigo-50'>
          <LoginForm />
      </div>
    )
}
