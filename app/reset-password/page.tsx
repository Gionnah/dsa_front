'use client'

import { useState, FormEvent, ChangeEvent, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Lock, CheckCircle2, AlertCircle, Shield, KeyRound } from 'lucide-react'

interface ResetPasswordData {
  password: string
  passwordConfirm: string
}

// Internal component that uses useSearchParams
function ResetPasswordContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const tokenFromUrl = searchParams.get('token')

  const [formData, setFormData] = useState<ResetPasswordData>({
    password: '',
    passwordConfirm: '',
  })

  const [isLoading, setIsLoading] = useState(false)
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null)
  const [passwordStrength, setPasswordStrength] = useState<{score: number, message: string}>({ score: 0, message: '' })

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 4000)
  }

  // Password validation
  const validatePassword = (password: string) => {
    let score = 0
    let messages: string[] = []

    if (password.length >= 8) score += 1
    else messages.push('At least 8 characters')

    if (/[A-Z]/.test(password)) score += 1
    else messages.push('One uppercase letter')

    if (/[a-z]/.test(password)) score += 1
    else messages.push('One lowercase letter')

    if (/[0-9]/.test(password)) score += 1
    else messages.push('One number')

    if (/[^A-Za-z0-9]/.test(password)) score += 1
    else messages.push('One special character')

    let message = ''
    if (score === 5) message = 'Strong password'
    else if (score >= 3) message = 'Medium password'
    else message = 'Weak password'

    setPasswordStrength({ score, message })
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (name === 'password') {
      validatePassword(value)
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    // Validations
    if (!tokenFromUrl) {
      showNotification('Missing or invalid token', 'error')
      setIsLoading(false)
      return
    }

    if (formData.password !== formData.passwordConfirm) {
      showNotification('Passwords do not match', 'error')
      setIsLoading(false)
      return
    }

    if (passwordStrength.score < 3) {
      showNotification('Password is too weak', 'error')
      setIsLoading(false)
      return
    }

    // Additional validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    if (!passwordRegex.test(formData.password)) {
      showNotification('Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character', 'error')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: tokenFromUrl,
          password: formData.password,
          passwordConfirm: formData.passwordConfirm,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Reset failed')
      }

      const data = await response.json()
      console.log('Password reset successful:', data)
      showNotification('Password reset successfully! Redirecting...', 'success')

      // Redirect after success
      setTimeout(() => {
        router.push('/login')
      }, 2000)

    } catch (error: any) {
      console.error(error)
      showNotification(error?.message || 'An error occurred during reset', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  // Password strength indicator
  const getPasswordStrengthColor = () => {
    if (passwordStrength.score === 0) return 'bg-gray-200'
    if (passwordStrength.score <= 2) return 'bg-red-500'
    if (passwordStrength.score <= 4) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getPasswordStrengthTextColor = () => {
    if (passwordStrength.score === 0) return 'text-gray-500'
    if (passwordStrength.score <= 2) return 'text-red-600'
    if (passwordStrength.score <= 4) return 'text-yellow-600'
    return 'text-green-600'
  }

  const requirements = [
    { text: 'At least 8 characters', check: (pwd: string) => pwd.length >= 8 },
    { text: 'One uppercase letter (A-Z)', check: (pwd: string) => /[A-Z]/.test(pwd) },
    { text: 'One lowercase letter (a-z)', check: (pwd: string) => /[a-z]/.test(pwd) },
    { text: 'One number (0-9)', check: (pwd: string) => /[0-9]/.test(pwd) },
    { text: 'One special character (@$!%*?&)', check: (pwd: string) => /[^A-Za-z0-9]/.test(pwd) }
  ]

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-100 via-purple-50 to-pink-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-xl shadow-2xl border-l-4 transform transition-all duration-300 ${
          notification.type === 'success' 
            ? 'bg-green-50 border-green-500' 
            : 'bg-red-50 border-red-500'
        }`}>
          <div className="flex items-center gap-3">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-6 h-6 text-green-500" />
            ) : (
              <AlertCircle className="w-6 h-6 text-red-500" />
            )}
            <span className={`font-medium ${
              notification.type === 'success' ? 'text-green-800' : 'text-red-800'
            }`}>
              {notification.message}
            </span>
          </div>
        </div>
      )}

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-linear-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-110 transition-transform duration-300">
            <KeyRound className="h-9 w-9 text-white" strokeWidth={2.5} />
          </div>
          <h2 className="mt-6 text-4xl font-extrabold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Reset Password
          </h2>
          <p className="mt-3 text-gray-600 text-lg">
            Enter your new password below
          </p>
        </div>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white/80 backdrop-blur-lg shadow-2xl py-10 px-8 rounded-3xl sm:px-12 border border-white/20">
          {/* Password Requirements Card - Moved to top */}
          <div className="mb-8 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold text-gray-800">Password Requirements</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">Your new password must meet the following criteria:</p>
            <div className="space-y-3">
              {requirements.map((req, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${req.check(formData.password) ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <span className={`text-sm ${req.check(formData.password) ? 'text-green-700 font-medium' : 'text-gray-600'}`}>
                    {req.text}
                  </span>
                </div>
              ))}
            </div>
            {/* Password strength indicator */}
            {formData.password && (
              <div className="mt-5 pt-5 border-t border-blue-100">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-bold ${getPasswordStrengthTextColor()}`}>
                    Password strength: {passwordStrength.message}
                  </span>
                  <span className="text-sm text-gray-500 font-medium">
                    {passwordStrength.score}/5
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                    style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <form className="space-y-8" onSubmit={handleSubmit}>
            {/* New Password */}
            <div className="group">
              <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-3">
                New Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-12 pr-4 py-3.5 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white hover:bg-blue-50"
                  placeholder="Enter new password"
                  minLength={8}
                />
              </div>
            </div>

            {/* Password Confirmation */}
            <div className="group">
              <label htmlFor="passwordConfirm" className="block text-sm font-bold text-gray-700 mb-3">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  id="passwordConfirm"
                  name="passwordConfirm"
                  type="password"
                  required
                  value={formData.passwordConfirm}
                  onChange={handleChange}
                  className={`block w-full pl-12 pr-4 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                    formData.password && formData.passwordConfirm && formData.password !== formData.passwordConfirm
                      ? 'border-red-300 bg-red-50 focus:ring-red-500 hover:bg-red-50'
                      : formData.password && formData.passwordConfirm && formData.password === formData.passwordConfirm
                      ? 'border-green-300 bg-green-50 focus:ring-green-500 hover:bg-green-50'
                      : 'border-gray-300 bg-white hover:bg-blue-50 focus:ring-blue-500'
                  }`}
                  placeholder="Confirm your password"
                  minLength={8}
                />
              </div>
              
              {/* Confirmation message */}
              {formData.passwordConfirm && (
                <div className="mt-3">
                  {formData.password === formData.passwordConfirm ? (
                    <p className="text-sm text-green-600 flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg">
                      <CheckCircle2 className="w-4 h-4" />
                      Passwords match
                    </p>
                  ) : (
                    <p className="text-sm text-red-600 flex items-center gap-2 bg-red-50 px-3 py-2 rounded-lg">
                      <AlertCircle className="w-4 h-4" />
                      Passwords do not match
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Reset Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isLoading || !formData.password || !formData.passwordConfirm || formData.password !== formData.passwordConfirm || passwordStrength.score < 3}
                className="w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-xl text-base font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:hover:scale-100"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </div>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 mr-2" />
                    Reset Password
                  </>
                )}
              </button>
              
              {/* Button disabled state helper text */}
              {(isLoading || !formData.password || !formData.passwordConfirm || formData.password !== formData.passwordConfirm || passwordStrength.score < 3) && (
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-500">
                    {!formData.password && !formData.passwordConfirm ? 'Enter both password fields to continue' :
                     formData.password !== formData.passwordConfirm ? 'Passwords must match' :
                     passwordStrength.score < 3 ? 'Password does not meet all requirements' :
                     'Ready to reset your password'}
                  </p>
                </div>
              )}
            </div>
          </form>

          {/* Login Link */}
          <div className="mt-10 pt-8 border-t border-gray-200 text-center">
            <p className="text-gray-600">
              Remember your password?{' '}
              <button
                onClick={() => router.push('/login')}
                className="font-bold text-blue-600 hover:text-purple-600 transition-colors duration-200 underline-offset-4 hover:underline"
              >
                Go to login
              </button>
            </p>
            <p className="mt-2 text-sm text-gray-500">
              This link will expire after password reset
            </p>
          </div>
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
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}

// Main component with Suspense
const ResetPassword = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  )
}

export default ResetPassword