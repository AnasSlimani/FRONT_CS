"use client"
import { useState, useEffect, useRef } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import api from "@/app/api/axios"

export function Test() {
  // State to store form data
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  // State to track loading and errors
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  // Reference to Google button container
  const googleButtonRef = useRef(null)

  // Handle form input changes
  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  // Handle regular form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Basic validation
    if (!formData.username ||  !formData.email || !formData.password) {
      setError("All fields are required")
      setIsLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      // Create user object to send to backend
      const user = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: "USER", // Default role
      }
      console.log(user);
      

      // Send request to create user
      const response = await api.post("/users", user, { public: true })
      console.log("User created:", response.data)
      setSuccess(true)

      // Redirect or show success message
      setTimeout(() => {
        window.location.href = "/"
      }, 2000)
    } catch (error) {
      console.error("Error creating user:", error)
      setError(error.response?.data || "Failed to create account. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Initialize Google Sign-In
  useEffect(() => {
    // Check if script is already loaded
    if (document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
      initializeGoogleSignIn()
      return
    }

    // Load the Google Identity Services script
    const loadGoogleScript = () => {
      const script = document.createElement("script")
      script.src = "https://accounts.google.com/gsi/client"
      script.async = true
      script.defer = true
      script.onload = initializeGoogleSignIn
      document.body.appendChild(script)
      return script
    }

    const script = loadGoogleScript()

    return () => {
      // Clean up
      if (script && script.parentNode) {
        script.parentNode.removeChild(script)
      }
      // Revoke Google Sign-In
      if (window.google) {
        window.google.accounts.id.cancel()
      }
    }
  }, [])

  // Initialize Google Sign-In button
  const initializeGoogleSignIn = () => {
    if (window.google && googleButtonRef.current) {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleGoogleSignIn,
        auto_select: false,
      })

      // Display the Google Sign-In button
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: "signup_with",
        shape: "rectangular",
        width: 280,
      })
    }
  }

  // Handle Google Sign-In response
const handleGoogleSignIn = async (response) => {
  try {
    setIsLoading(true);
    setError("");

    // Decode the JWT token to get user information
    const decodedToken = parseJwt(response.credential);
    console.log("Google user info:", decodedToken);

    // Créer une requête pour l'authentification Google
    const googleAuthData = {
      email: decodedToken.email,
      googleId: decodedToken.sub,
      name: `${decodedToken.given_name} ${decodedToken.family_name}`
    };

    // Utiliser directement l'endpoint Google Login qui gère à la fois la connexion et l'inscription
    const loginResponse = await api.post(
      "users/google-login",
      googleAuthData,
      { public: true }
    );

    // Stocker le token et rediriger
    localStorage.setItem("token", loginResponse.data);
    setSuccess(true);
    window.location.href = "/";
  } catch (error) {
    console.error("Error with Google Sign-In:", error);
    setError(error.response?.data || "Failed to sign up with Google. Please try again.");
  } finally {
    setIsLoading(false);
  }
};

  // Helper function to decode JWT token
  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]))
    } catch (e) {
      return null
    }
  }

  return (
    <div className="shadow-input mx-auto w-full max-w-md rounded-none bg-white p-4 md:rounded-2xl md:p-8 dark:bg-black">
      <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">Welcome to JAGUARS</h2>
      <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
        Sign up to jaguars if you can because we don&apos;t have a login flow yet
      </p>

      {/* Success message */}
      {success && (
        <div className="mt-4 p-3 bg-green-100 border border-green-200 text-green-700 rounded-lg">
          Account created successfully! Redirecting...
        </div>
      )}

      {/* Error message */}
      {error && <div className="mt-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg">{error}</div>}

      <form className="my-8" onSubmit={handleSubmit}>
        <div className="mb-4 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
          <LabelInputContainer>
            <Label htmlFor="username">Username</Label>
            <Input id="username" placeholder="Tyler" type="text" value={formData.username} onChange={handleChange} />
          </LabelInputContainer>
        </div>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            placeholder="projectmayhem@fc.com"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            placeholder="••••••••"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-8">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input
            id="confirmPassword"
            placeholder="••••••••"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </LabelInputContainer>

        <button
          className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset] disabled:opacity-70"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Sign up →"}
          <BottomGradient />
        </button>

        <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

        {/* Google Sign-In Button */}
        <div className="flex flex-col items-center">
          <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">Or sign up with</p>
          <div ref={googleButtonRef} className="google-signin-button w-full flex justify-center"></div>
        </div>
      </form>
    </div>
  )
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  )
}

const LabelInputContainer = ({ children, className }) => {
  return <div className={cn("flex w-full flex-col space-y-2", className)}>{children}</div>
}

