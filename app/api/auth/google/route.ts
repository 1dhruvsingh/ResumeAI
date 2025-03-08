import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const state = searchParams.get("state")

  if (!state) {
    return NextResponse.json({ error: "Missing state parameter" }, { status: 400 })
  }

  // Generate PKCE code verifier and challenge
  const codeVerifier = generateRandomString(64)
  const codeChallenge = await generateCodeChallenge(codeVerifier)

  // Store code verifier in a secure cookie for later verification
  const response = NextResponse.redirect(getGoogleAuthUrl(state, codeChallenge))

  // Set cookies with code verifier and state
  response.cookies.set("code_verifier", codeVerifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 10, // 10 minutes
    path: "/",
  })

  response.cookies.set("oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 10, // 10 minutes
    path: "/",
  })

  return response
}

// Helper function to generate random string for PKCE
function generateRandomString(length: number): string {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~"
  let result = ""

  const randomValues = new Uint8Array(length)
  crypto.getRandomValues(randomValues)

  for (let i = 0; i < length; i++) {
    result += charset[randomValues[i] % charset.length]
  }

  return result
}

// Helper function to generate code challenge from verifier
async function generateCodeChallenge(verifier: string): Promise<string> {
  // Convert string to Uint8Array
  const encoder = new TextEncoder()
  const data = encoder.encode(verifier)

  // Hash the verifier with SHA-256
  const hash = await crypto.subtle.digest("SHA-256", data)

  // Convert hash to base64 URL encoded string
  return base64UrlEncode(hash)
}

// Helper function for base64 URL encoding
function base64UrlEncode(buffer: ArrayBuffer): string {
  // Convert ArrayBuffer to base64
  const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)))

  // Make base64 URL safe
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

// Construct Google OAuth URL
function getGoogleAuthUrl(state: string, codeChallenge: string): string {
  const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth")

  googleAuthUrl.searchParams.append("client_id", process.env.GOOGLE_CLIENT_ID || "")
  googleAuthUrl.searchParams.append("redirect_uri", `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`)
  googleAuthUrl.searchParams.append("response_type", "code")
  googleAuthUrl.searchParams.append("scope", "email profile")
  googleAuthUrl.searchParams.append("state", state)
  googleAuthUrl.searchParams.append("code_challenge", codeChallenge)
  googleAuthUrl.searchParams.append("code_challenge_method", "S256")
  googleAuthUrl.searchParams.append("access_type", "offline")
  googleAuthUrl.searchParams.append("prompt", "consent")

  return googleAuthUrl.toString()
}

