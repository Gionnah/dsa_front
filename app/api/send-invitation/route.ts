// /api/send-invitation/rout.ts
import { NextRequest, NextResponse } from 'next/server'

// Fonction de validation d'email
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email.trim())
}

// Fonction pour traiter le texte et extraire les emails
const processEmailText = (text: string): { valid: string[], invalid: string[] } => {
  const emails = text.split(/[\n,;]+/)
    .map(email => email.trim())
    .filter(email => email.length > 0)
  
  const validEmails: string[] = []
  const invalidEmails: string[] = []

  emails.forEach(email => {
    if (validateEmail(email)) {
      validEmails.push(email)
    } else {
      invalidEmails.push(email)
    }
  })

  return { valid: validEmails, invalid: invalidEmails }
}

// Fonction pour envoyer un email individuel au backend
const sendSingleEmailToBackend = async (email: string, index: number, total: number, req: NextRequest) => {
  try {
    
    const response = await fetch(`${process.env.API_URL}/accounts/register/initiate/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${req.cookies.get('Access')?.value || ''}`,
      },
      body: JSON.stringify({
        email: email,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    return { success: true, email, result }
  } catch (error: any) {
    return { success: false, email, error: error?.message }
  }
}

export async function POST(request: NextRequest) {
  try {
    const { emailText } = await request.json()

    if (!emailText || typeof emailText !== 'string') {
      return NextResponse.json(
        { error: 'Invalid data format. emailText string is required.' },
        { status: 400 }
      )
    }

    if (emailText.trim().length === 0) {
      return NextResponse.json(
        { error: 'Email text cannot be empty' },
        { status: 400 }
      )
    }

    // Traiter le texte pour extraire les emails
    const { valid: validEmails, invalid: invalidEmails } = processEmailText(emailText)

    if (validEmails.length === 0) {
      return NextResponse.json(
        { 
          error: 'No valid emails found',
          details: {
            validEmails: 0,
            invalidEmails: invalidEmails.length,
            invalidEmailList: invalidEmails
          }
        },
        { status: 400 }
      )
    }

    // Envoyer les emails un par un
    const results = []
    let successfulSends = 0
    let failedSends = 0

    for (let i = 0; i < validEmails.length; i++) {
      const email = validEmails[i]
      const result = await sendSingleEmailToBackend(email, i, validEmails.length, request)
      results.push(result)
      
      if (result.success) {
        successfulSends++
      } else {
        failedSends++
      }

      // Petit délai pour éviter de surcharger le serveur
      if (i < validEmails.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }

    return NextResponse.json(
      {
        message: 'Email processing completed',
        summary: {
          totalProcessed: validEmails.length + invalidEmails.length,
          validEmails: validEmails.length,
          invalidEmails: invalidEmails.length,
          successfulSends,
          failedSends
        },
        details: {
          validEmails,
          invalidEmails,
          sendResults: results
        }
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Error processing bulk emails:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}