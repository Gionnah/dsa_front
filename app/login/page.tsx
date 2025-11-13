"use client"
import LoginForm from '@/components/LoginForm'
import { useEffect, useState } from 'react'

export default function Login() {
  const [loading, setLoading] = useState(false);

  const verifyLog = async () => {
      setLoading(true);
      const res = await fetch('/api/me');
      if (res.ok) window.location.href = '/home';
      setLoading(false);
  }

  useEffect(() => {
    verifyLog();
  }, [])
  if (loading)
    return (<div> loading... </div>);

  return (
    <div className='h-screen w-full bg-neutral-800'>
        <LoginForm />
    </div>
  )
}
