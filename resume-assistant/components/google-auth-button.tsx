"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface GoogleAuthButtonProps {
  className?: string
  onSuccess?: (userData: any) => void
  onError?: (error: string) => void
}

export function GoogleAuthButton({ className = "", onSuccess, onError }: GoogleAuthButtonProps) {
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  useEffect(() => {
    // Setup message listener for the popup response
    const messageListener = (event: MessageEvent) => {
      // Verify origin
      if (event.origin !== window.location.origin) return

      // Verify data structure
      if (!event.data || typeof event.data !== "object") return

      if (event.data.type === "GOOGLE_AUTH_SUCCESS") {
        // Verify the returned state matches our stored state
        if (event.data.state !== localStorage.getItem("google_auth_state")) {
          console.error("State mismatch - possible CSRF attack")
          onError?.("Authentication failed due to security validation")
          return
        }

        // Process authentication success
        const { token, user } = event.data

        // Store token in secure cookie/storage (handled by backend)

        // Update application state
        setIsAuthenticating(false)

        // Notify parent component
        onSuccess?.(user)

        // Dispatch event for other components
        window.dispatchEvent(new Event("auth_state_changed"))
      } else if (event.data.type === "GOOGLE_AUTH_ERROR") {
        // Handle authentication error
        console.error("Authentication error:", event.data.error)
        setIsAuthenticating(false)
        onError?.(event.data.error || "Authentication failed")
      }
    }

    // Add message listener
    window.addEventListener("message", messageListener)

    // Cleanup function
    return () => {
      window.removeEventListener("message", messageListener)
    }
  }, [onSuccess, onError])

  const handleGoogleLogin = () => {
    setIsAuthenticating(true)

    // Generate random state value for CSRF protection
    const state = generateRandomString(32)
    // Store state in localStorage for verification
    localStorage.setItem("google_auth_state", state)

    // Calculate center position for popup
    const width = 500
    const height = 600
    const left = window.screenX + (window.outerWidth - width) / 2
    const top = window.screenY + (window.outerHeight - height) / 2

    // Open the popup
    const popup = window.open(
      `/api/auth/google?state=${state}`,
      "googleLoginPopup",
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`,
    )

    // Check if popup was blocked
    if (!popup || popup.closed || typeof popup.closed === "undefined") {
      setIsAuthenticating(false)
      onError?.("Popup blocked! Please allow popups for this site.")
      return
    }

    // Set timeout to clear resources if authentication takes too long
    const timeoutId = setTimeout(() => {
      if (isAuthenticating) {
        setIsAuthenticating(false)
        onError?.("Authentication timed out. Please try again.")
        if (!popup.closed) popup.close()
      }
    }, 300000) // 5 minutes timeout

    // Clear timeout if component unmounts
    return () => clearTimeout(timeoutId)
  }

  return (
    <Button
      type="button"
      variant="outline"
      className={`relative flex items-center justify-center gap-2 h-10 w-full max-w-sm bg-white hover:bg-gray-50 text-gray-700 ${
        isAuthenticating ? "opacity-80" : ""
      } ${className}`}
      onClick={handleGoogleLogin}
      disabled={isAuthenticating}
    >
      {!isAuthenticating ? (
        <>
          <GoogleLogo className="h-4 w-4" />
          <span>Continue with Google</span>
        </>
      ) : (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <span>Authenticating...</span>
        </>
      )}
    </Button>
  )
}

// Helper function to generate random string for state
function generateRandomString(length: number): string {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  const randomValues = new Uint8Array(length)
  window.crypto.getRandomValues(randomValues)

  for (let i = 0; i < length; i++) {
    result += charset[randomValues[i] % charset.length]
  }

  return result
}

// Google logo component
function GoogleLogo({ className = "" }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

