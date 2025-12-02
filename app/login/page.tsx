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
      <div className="min-h-screen w-full bg-linear-to-br from-indigo-50 via-purple-50 to-blue-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        {/* Main loader container */}
        <div className="relative z-10 flex flex-col items-center justify-center space-y-8">
          {/* Logo/Icon with animation */}
          <div className="relative">
            {/* Outer ring */}
            <div className="w-28 h-28 border-4 border-blue-200 rounded-full animate-pulse"></div>
            
            {/* Middle ring */}
            <div className="absolute inset-4 w-20 h-20 border-4 border-purple-300 rounded-full animate-spin-slow"></div>
            
            {/* Inner core */}
            <div className="absolute inset-8 w-12 h-12 bg-linear-to-r from-blue-500 to-purple-600 rounded-full animate-ping-slow"></div>
            
            {/* Center icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 bg-white rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Loading text */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Checking Session
            </h1>
            <p className="text-gray-600 max-w-md">
              We're verifying your authentication status. Please wait a moment...
            </p>
          </div>

          {/* Progress dots */}
          <div className="flex space-x-3">
            {[0, 1, 2].map((dot) => (
              <div
                key={dot}
                className="w-3 h-3 bg-linear-to-r from-blue-400 to-purple-500 rounded-full animate-bounce"
                style={{
                  animationDelay: `${dot * 0.1}s`,
                  animationDuration: '0.8s'
                }}
              />
            ))}
          </div>

          {/* Status indicator */}
          <div className="mt-8 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-700">
                Connecting to server...
              </span>
            </div>
          </div>
        </div>

        {/* Bottom decorative elements */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
          <div className="flex space-x-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-linear-to-r from-blue-200 to-purple-200 rounded-full"
                style={{
                  opacity: 0.3 + (i * 0.1),
                  animation: `pulse 2s infinite`,
                  animationDelay: `${i * 0.2}s`
                }}
              />
            ))}
          </div>
        </div>

        <style jsx>{`
          @keyframes blob {
            0%, 100% {
              transform: translate(0, 0) scale(1);
            }
            33% {
              transform: translate(30px, -50px) scale(1.1);
            }
            66% {
              transform: translate(-20px, 20px) scale(0.9);
            }
          }

          @keyframes spin-slow {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }

          @keyframes ping-slow {
            0% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(1.1);
              opacity: 0.7;
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }

          .animate-blob {
            animation: blob 7s infinite;
          }

          .animate-spin-slow {
            animation: spin-slow 3s linear infinite;
          }

          .animate-ping-slow {
            animation: ping-slow 2s ease-in-out infinite;
          }

          .animation-delay-2000 {
            animation-delay: 2s;
          }

          .animation-delay-4000 {
            animation-delay: 4s;
          }
        `}</style>
      </div>
    );

  if (!isLoged)
    return (
      <div className='h-screen w-full bg-indigo-50'>
          <LoginForm />
      </div>
    )
}