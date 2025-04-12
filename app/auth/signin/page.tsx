"use client";

// Import necessary hooks and functions from Next.js
import { signIn } from "next-auth/react";  // For signing in using NextAuth
import { useState } from "react";  // For managing local state
import { useRouter } from "next/navigation";  // For navigation (redirects)

export default function SignIn() {
  // Initializing state variables using the useState hook
  const router = useRouter();  // To handle page redirection after successful login
  const [email, setEmail] = useState("");  // To store the email input from the user
  const [password, setPassword] = useState("");  // To store the password input from the user
  const [error, setError] = useState("");  // To store any error messages (e.g., invalid credentials)
  const [isLoading, setIsLoading] = useState(false);  // To manage the loading state during sign-in process

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();  // Prevent the default form submission behavior
    setIsLoading(true);  // Set loading state to true (show spinner)
    setError("");  // Reset any previous error messages

    try {
      // Attempt to sign in using credentials (email and password)
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,  // Don't redirect automatically (we will handle it manually)
      });

      if (result?.error) {
        // If the sign-in fails (due to invalid credentials), display an error message
        setError("Invalid credentials");
      } else {
        // If the sign-in is successful, redirect the user to the dashboard
        router.push("/dashboard");
      }
    } catch (error) {
      console.log(error);  // Log any unexpected errors to the console
      setError("An error occurred during sign in");  // Display a generic error message
    } finally {
      // After the sign-in process (whether success or failure), stop the loading state
      setIsLoading(false);
    }
  };

  return (
    // Main container for the sign-in page
    <div className="min-h-screen bg-black flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-2">
          Welcome Back
        </h1>
        <h2 className="text-center text-sm text-neutral-400">
          Sign in to access your admin dashboard
        </h2>
      </div>

      {/* Sign-in Form Container */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-neutral-900/50 backdrop-blur-sm py-8 px-4 shadow-xl border border-neutral-800 rounded-xl sm:px-10">
          {/* Form Element */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Input Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-neutral-300"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}  // Update email state
                  className="appearance-none block w-full px-3 py-2 border border-neutral-800 rounded-lg bg-neutral-900 placeholder-neutral-500 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/20"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Input Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-neutral-300"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}  // Update password state
                  className="appearance-none block w-full px-3 py-2 border border-neutral-800 rounded-lg bg-neutral-900 placeholder-neutral-500 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/20"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {/* Display error message if there's an error */}
            {error && (
              <div className="text-red-500 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}  // Disable the button while loading
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {/* Show loading spinner while waiting for response */}
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Sign in"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
