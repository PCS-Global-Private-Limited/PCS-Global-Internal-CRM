import React from "react";
import Navbar from "../components/Navbar";

const Login = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 shadow-sm">
        <Navbar />
      </header>

      {/* Login Form */}
      <main className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-md p-8 rounded-2xl shadow-lg border border-gray-100 bg-white">
          {/* Title */}
          <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">
            Welcome to PCS GLOBAL CRM
          </h1>

          {/* Form */}
          <form className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                           outline-none transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg 
                           focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                           outline-none transition"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 
                         text-white font-semibold rounded-lg shadow-md transition"
            >
              Login
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-gray-600 mt-5">
            Don’t have an account?{" "}
            <a
              href="/signup"
              className="text-blue-600 hover:underline font-medium"
            >
              Sign up
            </a>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;
