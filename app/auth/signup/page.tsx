"use client";

// Import necessary hooks and functions from Next.js
import { useState } from "react";  // For managing local state
import { useRouter } from "next/navigation";  // For navigation (redirects)
import Link from "next/link";  // For creating a link to the sign-in page

export default function SignUp() {
  // Initializing state variables using the useState hook
  const router = useRouter();  // To handle page redirection after successful signup
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });  // State to store form input values
  const [error, setError] = useState("");  // State to store error messages
  const [isLoading, setIsLoading] = useState(false);  // State to manage the loading state during signup process

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();  // Prevent the default form submission behavior
    setIsLoading(true);  // Set loading state to true (show spinner)
    setError("");  // Reset any previous error messages

    // Check if the password and confirm password match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      // Attempt to send a POST request to the backend to create a new user
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();  // Parse the response JSON

      // If the response is not okay, throw an error
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      // On successful signup, redirect to the sign-in page
      router.push("/auth/signin");
    } catch (error) {
      // Handle any errors during signup
      setError(error instanceof Error ? error.message : "Failed to sign up");
    } finally {
      // After the signup process (whether success or failure), stop the loading state
      setIsLoading(false);
    }
  };

  // Handle input field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Update the corresponding field in formData state
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    // Main container for the sign-up page
    <div className="min-h-screen bg-black flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent mb-2">
          Create Account
        </h1>
        <h2 className="text-center text-sm text-neutral-400">
          Sign up to get started
        </h2>
      </div>

      {/* Sign-up Form Container */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-neutral-900/50 backdrop-blur-sm py-8 px-4 shadow-xl border border-neutral-800 rounded-xl sm:px-10">
          {/* Form Element */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Full Name Input Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-neutral-300"
              >
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}  // Update name field in formData
                  className="appearance-none block w-full px-3 py-2 border border-neutral-800 rounded-lg bg-neutral-900 placeholder-neutral-500 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/20"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

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
                  value={formData.email}
                  onChange={handleChange}  // Update email field in formData
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
                  required
                  value={formData.password}
                  onChange={handleChange}  // Update password field in formData
                  className="appearance-none block w-full px-3 py-2 border border-neutral-800 rounded-lg bg-neutral-900 placeholder-neutral-500 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/20"
                  placeholder="Create a password"
                />
              </div>
            </div>

            {/* Confirm Password Input Field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-neutral-300"
              >
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}  // Update confirmPassword field in formData
                  className="appearance-none block w-full px-3 py-2 border border-neutral-800 rounded-lg bg-neutral-900 placeholder-neutral-500 text-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/20"
                  placeholder="Confirm your password"
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
                  "Sign up"
                )}
              </button>
            </div>
          </form>

          {/* Link to sign in page if the user already has an account */}
          <div className="mt-6 text-center text-sm">
            <span className="text-neutral-400">Already have an account?</span>{" "}
            <Link
              href="/auth/signin"
              className="text-blue-500 hover:text-blue-400 font-medium"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
