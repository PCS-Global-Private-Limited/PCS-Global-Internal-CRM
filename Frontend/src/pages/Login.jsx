import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkAuth } from "../lib";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      const authStatus = await checkAuth();
      if (authStatus) {
        navigate("/user-dashboard");
      }
    };
    
    verifyAuth();
  }, []);

  const login = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const err = await res.json();
        setError(err.message || "Login failed");
        setLoading(false);
        return;
      }

      navigate("/user-dashboard");
    } catch (error) {
      console.error("Error logging in:", error);
    } finally {
      setLoading(false);
    }
  };

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
          {error && (
            <div className="mb-3 text-center text-red-600 font-semibold">
              {error}
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              login(email, password);
            }}
            className="space-y-5"
          >
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              {loading ? "Logging in..." : "Login"}
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
