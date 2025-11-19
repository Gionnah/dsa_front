'use client'

import { useState, FormEvent, ChangeEvent } from 'react'
import { Mail, Upload, Users, CheckCircle2, AlertCircle, Trash2, Send } from 'lucide-react'

const BulkEmailForm = () => {
  const [emailText, setEmailText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null)
  const [processingStats, setProcessingStats] = useState<{
    total: number
    valid: number
    invalid: number
    successful: number
    failed: number
  } | null>(null)

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 5000)
  }

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setEmailText(e.target.value)
  }

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      setEmailText(content)
    }
    reader.readAsText(file)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setProcessingStats(null)

    if (!emailText.trim()) {
      showNotification('Please enter some email addresses', 'error')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/send-invitation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailText: emailText,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process emails')
      }

      showNotification(`Successfully processed ${data.summary.validEmails} emails!`, 'success')
      setProcessingStats({
        total: data.summary.totalProcessed,
        valid: data.summary.validEmails,
        invalid: data.summary.invalidEmails,
        successful: data.summary.successfulSends,
        failed: data.summary.failedSends
      })

      console.log('Processing results:', data)

    } catch (error: any) {
      console.error(error)
      showNotification(error?.message || 'An error occurred while processing emails', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const clearForm = () => {
    setEmailText('')
    setProcessingStats(null)
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-purple-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background */}
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

      <div className="sm:mx-auto sm:w-full sm:max-w-4xl relative z-10">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-linear-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-110 transition-transform duration-300">
            <Users className="h-9 w-9 text-white" strokeWidth={2.5} />
          </div>
          <h2 className="mt-6 text-4xl font-extrabold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Bulk Email Processing
          </h2>
          <p className="mt-3 text-gray-600 text-lg">
            Send emails to multiple recipients at once
          </p>
        </div>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-4xl relative z-10">
        <div className="bg-white/80 backdrop-blur-lg shadow-2xl py-10 px-8 rounded-3xl sm:px-12 border border-white/20">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email text area */}
            <div className="group">
              <label htmlFor="emails" className="block text-sm font-bold text-gray-700 mb-2">
                Email List *
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-4 w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                <textarea
                  id="emails"
                  name="emails"
                  required
                  value={emailText}
                  onChange={handleTextChange}
                  rows={12}
                  className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white resize-none font-mono text-sm"
                  placeholder="user1@example.com&#10;user2@example.com&#10;user3@example.com&#10;&#10;Or separate with commas:&#10;user1@example.com, user2@example.com, user3@example.com"
                />
              </div>
              <div className="mt-2 text-sm text-gray-500">
                Separate emails with new lines, commas, or semicolons
              </div>
            </div>

            {/* File upload */}
            <div className="group">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Or import from file
              </label>
              <div className="relative">
                <label className="cursor-pointer">
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-blue-50">
                    <div className="flex flex-col items-center">
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600 font-medium">
                        Click to select a text file
                      </span>
                      <span className="text-xs text-gray-500 mt-1">
                        .txt files accepted - One email per line
                      </span>
                    </div>
                    <input
                      type="file"
                      accept=".txt,.csv"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                </label>
              </div>
            </div>

            {/* Processing Statistics */}
            {processingStats && (
              <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                <h3 className="font-bold text-lg text-gray-800 text-center">
                  Processing Results
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{processingStats.total}</div>
                    <div className="text-sm text-gray-600">Total</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{processingStats.valid}</div>
                    <div className="text-sm text-gray-600">Valid</div>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{processingStats.invalid}</div>
                    <div className="text-sm text-gray-600">Invalid</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{processingStats.successful}</div>
                    <div className="text-sm text-gray-600">Sent</div>
                  </div>
                </div>
                {processingStats.failed > 0 && (
                  <div className="text-center text-red-600 text-sm">
                    {processingStats.failed} emails failed to send
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={clearForm}
                disabled={isLoading}
                className="flex-1 flex justify-center items-center py-4 px-6 border-2 border-gray-300 rounded-xl text-base font-bold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <Trash2 className="w-5 h-5 mr-2" />
                Clear
              </button>
              
              <button
                type="submit"
                disabled={isLoading || !emailText.trim()}
                className="flex-1 flex justify-center items-center py-4 px-6 border border-transparent rounded-xl text-base font-bold text-white bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
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
                    <Send className="w-5 h-5 mr-2" />
                    Send Emails
                  </>
                )}
              </button>
            </div>
          </form>
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

export default BulkEmailForm