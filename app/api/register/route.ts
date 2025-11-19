// app/api/register/route.ts

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // Récupérer les données du formulaire
    const token = formData.get('token') as string
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const username = formData.get('username') as string
    const password = formData.get('password') as string
    const passwordConfirm = formData.get('passwordConfirm') as string
    const registrationNumber = formData.get('registrationNumber') as string
    const program = formData.get('program') as string
    const classLevel = formData.get('classLevel') as string
    const photo = formData.get('photo') as File | null

    // Valider les champs requis
    const requiredFields = {
      firstName, lastName, username, password, 
      passwordConfirm, registrationNumber, program, classLevel
    }

    for (const [field, value] of Object.entries(requiredFields)) {
      if (!value) {
        return NextResponse.json(
          { error: `Le champ ${field} est requis` },
          { status: 400 }
        )
      }
    }

    if (password !== passwordConfirm) {
      return NextResponse.json(
        { error: 'Les mots de passe ne correspondent pas' },
        { status: 400 }
      )
    }

    // Préparer FormData pour Django
    const djangoFormData = new FormData()

    if (token) djangoFormData.append('token', token)
    djangoFormData.append('nom', lastName)
    djangoFormData.append('prenom', firstName)
    djangoFormData.append('username', username)
    djangoFormData.append('password', password)
    djangoFormData.append('password_confirm', passwordConfirm)
    djangoFormData.append('numero_inscription', registrationNumber)
    djangoFormData.append('parcours', program)
    djangoFormData.append('classe', classLevel)

    if (photo) {
      djangoFormData.append('photo', photo)
    }

    const djangoResponse = await fetch(`${process.env.API_URL}/accounts/register/complete/`, {
      method: 'POST',
      body: djangoFormData,
    })

    if (!djangoResponse.ok) {
      let errorMessage = 'Erreur lors de l\'inscription'
      
      try {
        const errorData = await djangoResponse.json()
        errorMessage = errorData.detail || errorData.message || JSON.stringify(errorData)
      } catch (e) {
        errorMessage = `Erreur ${djangoResponse.status}: ${djangoResponse.statusText}`
      }

      return NextResponse.json(
        { error: errorMessage },
        { status: djangoResponse.status }
      )
    }

    const data = await djangoResponse.json()

    return NextResponse.json(
      { 
        message: 'Inscription réussie',
        user: data 
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}