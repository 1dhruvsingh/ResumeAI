import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { SignJWT } from "jose"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")
    const state = searchParams.get("state")
    const error = searchParams.get("error")

    // Check for errors from Google
    if (error) {
      return createErrorResponse(`Authentication error: ${error}`)
    }

    // Validate required parameters
    if (!code || !state) {
      return createErrorResponse("Missing required parameters")
    }

    // Get stored state and code verifier from cookies
    const cookieStore = cookies()
    const storedState = cookieStore.get("oauth_state")?.value
    const codeVerifier = cookieStore.get("code_verifier")?.value

    // Verify state parameter matches stored state
    if (!storedState || state !== storedState) {
      return createErrorResponse("Invalid state parameter")
    }

    if (!codeVerifier) {
      return createErrorResponse("Missing code verifier")
    }

    // Exchange authorization code for tokens
    const tokenResponse = await exchangeCodeForTokens(code, codeVerifier)

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json()
      console.error("Token exchange error:", errorData)
      return createErrorResponse("Failed to exchange authorization code for tokens")
    }

    const tokens = await tokenResponse.json()

    // Get user information from Google
    const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    })

    if (!userInfoResponse.ok) {
      console.error("Failed to fetch user info:", await userInfoResponse.text())
      return createErrorResponse("Failed to fetch user information")
    }

    const userData = await userInfoResponse.json()

    // In a real application, you would:
    // 1. Find or create user in your database
    // 2. Generate JWT token with user information
    // 3. Set token in secure HTTP-only cookie

    // For this example, we'll create a simple JWT
    const jwtToken = await createJWT({
      sub: userData.sub,
      email: userData.email,
      name: userData.name,
      picture: userData.picture,
    })

    // Create response with HTML that posts message to parent window
    const responseHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Authentication Successful</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            background-color: #f9f9f9;
            color: #333;
          }
          .success-icon {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background-color: #4CAF50;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;
          }
          .success-icon svg {
            width: 30px;
            height: 30px;
            fill: white;
          }
          h1 {
            margin-bottom: 10px;
            font-size: 24px;
          }
          p {
            margin-top: 0;
            color: #666;
          }
        </style>
        <script>
          // Send message to parent window
          window.onload = function() {
            window.opener.postMessage(
              {
                type: 'GOOGLE_AUTH_SUCCESS',
                token: '${jwtToken}',
                user: ${JSON.stringify({
                  id: userData.sub,
                  email: userData.email,
                  name: userData.name,
                  firstName: userData.given_name,
                  lastName: userData.family_name,
                  picture: userData.picture,
                })},
                state: '${state}'
              },
              '${process.env.NEXT_PUBLIC_APP_URL}'
            );
            
            // Close popup after sending message
            setTimeout(function() {
              window.close();
            }, 2000);
          };
        </script>
      </head>
      <body>
        <div class="success-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
          </svg>
        </div>
        <h1>Authentication Successful</h1>
        <p>You can close this window now.</p>
      </body>
      </html>
    `

    // Clear the OAuth cookies
    const response = new NextResponse(responseHtml, {
      headers: {
        "Content-Type": "text/html",
      },
    })

    response.cookies.set("oauth_state", "", { maxAge: 0, path: "/" })
    response.cookies.set("code_verifier", "", { maxAge: 0, path: "/" })

    // Set the JWT token in a secure cookie
    response.cookies.set("auth_token", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Google authentication error:", error)
    return createErrorResponse("Authentication failed. Please try again.")
  }
}

// Helper function to exchange authorization code for tokens
async function exchangeCodeForTokens(code: string, codeVerifier: string) {
  const tokenEndpoint = "https://oauth2.googleapis.com/token"
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`

  const params = new URLSearchParams()
  params.append("client_id", process.env.GOOGLE_CLIENT_ID || "")
  params.append("client_secret", process.env.GOOGLE_CLIENT_SECRET || "")
  params.append("code", code)
  params.append("code_verifier", codeVerifier)
  params.append("grant_type", "authorization_code")
  params.append("redirect_uri", redirectUri)

  return fetch(tokenEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  })
}

// Helper function to create JWT token
async function createJWT(payload: any) {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback_secret_for_development_only")

  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secret)

  return jwt
}

// Helper function to create error response
function createErrorResponse(errorMessage: string) {
  const errorHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Authentication Failed</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          margin: 0;
          background-color: #f9f9f9;
          color: #333;
        }
        .error-icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background-color: #F44336;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }
        .error-icon svg {
          width: 30px;
          height: 30px;
          fill: white;
        }
        h1 {
          margin-bottom: 10px;
          font-size: 24px;
        }
        p {
          margin-top: 0;
          color: #666;
          text-align: center;
          max-width: 400px;
        }
      </style>
      <script>
        window.onload = function() {
          window.opener.postMessage(
            {
              type: 'GOOGLE_AUTH_ERROR',
              error: '${errorMessage}'
            },
            '${process.env.NEXT_PUBLIC_APP_URL}'
          );
          
          setTimeout(function() {
            window.close();
          }, 3000);
        };
      </script>
    </head>
    <body>
      <div class="error-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
        </svg>
      </div>
      <h1>Authentication Failed</h1>
      <p>${errorMessage}</p>
    </body>
    </html>
  `

  return new NextResponse(errorHtml, {
    status: 400,
    headers: {
      "Content-Type": "text/html",
    },
  })
}

