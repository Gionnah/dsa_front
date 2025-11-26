'use client'

import { useState, FormEvent, ChangeEvent, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { User, Lock, Mail, Image, GraduationCap, Hash, CheckCircle2, AlertCircle } from 'lucide-react'

interface FormData {
  firstName: string
  lastName: string
  username: string
  password: string
  passwordConfirm: string
  registrationNumber: string
  program: string
  classLevel: string
  photo: File | null
}

// Composant interne qui utilise useSearchParams
function RegisterContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const tokenFromUrl = searchParams.get('token')

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    passwordConfirm: '',
    registrationNumber: '',
    program: '',
    classLevel: '',
    photo: null,
  })

  const [isLoading, setIsLoading] = useState(false)
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 4000)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData((prev) => ({
      ...prev,
      photo: file,
    }))

    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setPhotoPreview(null)
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    if (formData.password !== formData.passwordConfirm) {
      showNotification('Les mots de passe ne correspondent pas', 'error')
      setIsLoading(false)
      return
    }

    try {
      const formDataToSend = new FormData()
      
      // Ajouter tous les champs au FormData
      formDataToSend.append('firstName', formData.firstName)
      formDataToSend.append('lastName', formData.lastName)
      formDataToSend.append('username', formData.username)
      formDataToSend.append('password', formData.password)
      formDataToSend.append('passwordConfirm', formData.passwordConfirm)
      formDataToSend.append('registrationNumber', formData.registrationNumber)
      formDataToSend.append('program', formData.program)
      formDataToSend.append('classLevel', formData.classLevel)
      
      if (tokenFromUrl) {
        formDataToSend.append('token', tokenFromUrl)
      }
      
      if (formData.photo) {
        formDataToSend.append('photo', formData.photo)
      }

      const response = await fetch('/api/register', {
        method: 'POST',
        body: formDataToSend,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Registration failed')
      }

      const data = await response.json()
      console.log('Registration successful:', data)
      showNotification('Inscription réussie ! Redirection...', 'success')

      setTimeout(() => {
        window.location.href = '/login'
      }, 1000)

    } catch (error: any) {
      console.error(error)
      showNotification(error?.message || 'Une erreur est survenue lors de l\'inscription', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoginRedirect = () => {
    window.location.href = '/members/home'
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-100 via-purple-50 to-pink-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Fond décoratif animé */}
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

      <div className="sm:mx-auto sm:w-full sm:max-w-2xl relative z-10">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-linear-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-110 transition-transform duration-300">
            <User className="h-9 w-9 text-white" strokeWidth={2.5} />
          </div>
          <h2 className="mt-6 text-4xl font-extrabold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Create your account
          </h2>
          <p className="mt-3 text-gray-600 text-lg">
            Fill out the form to complete your registration
          </p>
        </div>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-2xl relative z-10">
        <div className="bg-white/80 backdrop-blur-lg shadow-2xl py-10 px-8 rounded-3xl sm:px-12 border border-white/20">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* First Name and Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label htmlFor="firstName" className="block text-sm font-bold text-gray-700 mb-2">
                  First Name *
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="block w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    placeholder="Your Firstname"
                  />
                </div>
              </div>

              <div className="group">
                <label htmlFor="lastName" className="block text-sm font-bold text-gray-700 mb-2">
                  Last Name *
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="block w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    placeholder="Your lastname"
                  />
                </div>
              </div>
            </div>

            {/* Username */}
            <div className="group">
              <label htmlFor="username" className="block text-sm font-bold text-gray-700 mb-2">
                Username *
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="block w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  placeholder="Choose a username"
                />
              </div>
            </div>

            {/* Registration Number */}
            <div className="group">
              <label htmlFor="registrationNumber" className="block text-sm font-bold text-gray-700 mb-2">
                Registration Number *
              </label>
              <div className="relative">
                <Hash className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                <input
                  id="registrationNumber"
                  name="registrationNumber"
                  type="text"
                  required
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  className="block w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  placeholder="Your registration number"
                />
              </div>
            </div>

            {/* Program and Class Level */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label htmlFor="program" className="block text-sm font-bold text-gray-700 mb-2">
                  Program *
                </label>
                <div className="relative">
                  <GraduationCap className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors pointer-events-none z-10" />
                  <select
                    id="program"
                    name="program"
                    required
                    value={formData.program}
                    onChange={handleChange}
                    className="block w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white appearance-none cursor-pointer"
                  >
                    <option value="">Select Program</option>
                    <option value="Common Core">Common Core</option>
                    <option value="Artificial Intelligence">Intelligence Artificielle</option>
                    <option value="Network Administration">Administration Réseau</option>
                    <option value="Software Engineering">Génie Logiciel</option>
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="group">
                <label htmlFor="classLevel" className="block text-sm font-bold text-gray-700 mb-2">
                  Class Level *
                </label>
                <div className="relative">
                  <GraduationCap className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors pointer-events-none z-10" />
                  <select
                    id="classLevel"
                    name="classLevel"
                    required
                    value={formData.classLevel}
                    onChange={handleChange}
                    className="block w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white appearance-none cursor-pointer"
                  >
                    <option value="">Select Level</option>
                    <option value="L1">L1</option>
                    <option value="L2">L2</option>
                    <option value="L3">L3</option>
                    <option value="M1">M1</option>
                    <option value="M2">M2</option>
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Photo */}
            <div>
              <label htmlFor="photo" className="block text-sm font-bold text-gray-700 mb-2">
                Profile Photo
              </label>
              <div className="flex items-center gap-6">
                {photoPreview && (
                  <div className="shrink-0">
                    <img 
                      src={photoPreview} 
                      alt="Aperçu" 
                      className="w-20 h-20 rounded-full object-cover border-4 border-blue-100 shadow-lg"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <label className="cursor-pointer">
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-blue-50">
                      <div className="flex flex-col items-center">
                        <Image className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600 font-medium">
                          {formData.photo ? formData.photo.name : 'Upload Profile Photo'}
                        </span>
                        <span className="text-xs text-gray-500 mt-1">PNG, JPG 10MB</span>
                      </div>
                      <input
                        id="photo"
                        name="photo"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Password and Confirmation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2">
                  Password *
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
                    className="block w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="group">
                <label htmlFor="passwordConfirm" className="block text-sm font-bold text-gray-700 mb-2">
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
                    className="block w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            {/* Register Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-xl text-base font-bold text-white bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
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
                    Create Account
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account ?{' '}
              <button
                onClick={handleLoginRedirect}
                className="font-bold text-blue-600 hover:text-purple-600 transition-colors duration-200 underline-offset-4 hover:underline"
              >
                Go to login
              </button>
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

// Composant principal avec Suspense
const Register = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <RegisterContent />
    </Suspense>
  )
}

export default Register