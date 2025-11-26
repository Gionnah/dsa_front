// /api/submissions/route.ts
import { NextRequest, NextResponse } from "next/server";

const JUDGE0_URL = "http://localhost:2358";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validation basique
    if (!body.source_code || !body.language_id) {
      return NextResponse.json(
        { error: "source_code et language_id sont requis" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${JUDGE0_URL}/submissions?base64_encoded=false&wait=false`,
      {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${req.cookies.get('Access')?.value || ''}`,
        },
        body: JSON.stringify({
          source_code: body.source_code,
          language_id: body.language_id,
          stdin: body.stdin || "",
          // Ajout de champs utiles pour le débogage
          cpu_time_limit: 10,
          memory_limit: 128000,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erreur Judge0 POST:", response.status, errorText);
      return NextResponse.json(
        { error: `Erreur Judge0: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Erreur interne:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Token manquant" },
        { status: 400 }
      );
    }

    const result = await fetch(
      `${JUDGE0_URL}/submissions/${token}?base64_encoded=false`
    );

    if (!result.ok) {
      console.error("Erreur Judge0 GET:", result.status);
      return NextResponse.json(
        { error: `Erreur lors de la récupération: ${result.status}` },
        { status: result.status }
      );
    }

    const data = await result.json();
    
    // Log pour débogage
    console.log("Réponse Judge0:", data);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("Erreur interne:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}