import React from "react";
import { useForm } from "react-hook-form";
import Navbar from "../components/Navbar";
const apiUrl = import.meta.env.VITE_API_URL;
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const [addError, setAddError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    console.log("Form Data:", data);
    try {
      const res = await fetch(`${apiUrl}/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        if (res.status === 409 && err.exists) {
          setAddError("User already present with this email or mobile number");
          notifyUserExist();
        } else {
          setAddError(err.error || "Failed to add contact");
        }
        setLoading(false); // ⬅️ stop loading on error
        return;
      }
      navigate("/login");
    } catch (error) {
      console.error("Error signing up:", error);
    }
    reset();
  };

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-slate-50 "
      style={{
        "--select-button-svg":
          "url('data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2724px%27 height=%2724px%27 fill=%27rgb(73,115,156)%27 viewBox=%270 0 256 256%27%3e%3cpath d=%27M181.66,170.34a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-48-48a8,8,0,0,1,11.32-11.32L128,212.69l42.34-42.35A8,8,0,0,1,181.66,170.34Zm-96-84.68L128,43.31l42.34,42.35a8,8,0,0,0,11.32-11.32l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,85.66,85.66Z%27%3e%3c/path%3e%3c/svg%3e')",
        fontFamily: "Inter, Noto Sans, sans-serif",
      }}
    >
      <div className="flex h-full grow flex-col">
        <header className="sticky top-0 z-50">
          <Navbar />
        </header>

        {/* Form Container - Properly centered */}
        <div className="flex flex-1 justify-center items-start py-8 px-4">
          <div className="w-full max-w-lg">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <h2 className="text-[28px] font-bold text-center pb-3 pt-5">
                Create your account
              </h2>

              {/* Employee ID */}
              <InputField
                label="Employee ID"
                name="employeeId"
                placeholder="Enter your employee ID"
                register={register}
                errors={errors}
                rules={{ required: "Employee ID is required" }}
              />

              {/* First & Last Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="First Name"
                  name="firstName"
                  placeholder="Enter your first name"
                  register={register}
                  errors={errors}
                  rules={{ required: "First name is required" }}
                />
                <InputField
                  label="Last Name"
                  name="lastName"
                  placeholder="Enter your last name"
                  register={register}
                  errors={errors}
                  rules={{ required: "Last name is required" }}
                />
              </div>

              {/* Phone */}
              <InputField
                label="Phone Number"
                name="phone"
                placeholder="Enter your phone number"
                register={register}
                errors={errors}
                rules={{ required: "Phone number is required" }}
              />

              {/* Email */}
              <InputField
                label="Email"
                name="email"
                placeholder="Enter your email"
                register={register}
                errors={errors}
                rules={{
                  required: "Email is required",
                  pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
                }}
              />

              {/* Branch */}
              <div className="w-full">
                <label className="flex flex-col w-full">
                  <p className="pb-2 font-medium">Branch</p>
                  <select
                    {...register("branch", { required: "Branch is required" })}
                    className="rounded-lg bg-[#e7edf4] h-14 p-4 text-base focus:outline-none w-full"
                  >
                    <option value="">Select your branch</option>
                    <option value="Kolkata">Kolkata</option>
                    <option value="Bengalore">Bengalore</option>
                    <option value="Noida">Noida</option>
                  </select>
                  {errors.branch && (
                    <span className="text-red-500 text-sm mt-1">
                      {errors.branch.message}
                    </span>
                  )}
                </label>
              </div>

              {/* Designation */}
              <InputField
                label="Designation"
                name="designation"
                placeholder="Eg : MERN Stack Developer/JAVA Developer/Data Analyst..."
                register={register}
                errors={errors}
                rules={{ required: "Designation is required" }}
              />

              {/* Password */}
              <InputField
                label="Password"
                name="password"
                type="password"
                placeholder="Enter your password"
                register={register}
                errors={errors}
                rules={{
                  required: "Password is required",
                  minLength: { value: 6, message: "At least 6 characters" },
                }}
              />

              {/* Confirm Password */}
              <InputField
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                register={register}
                errors={errors}
                rules={{ required: "Please confirm your password" }}
              />

              {/* Submit */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full h-10 flex items-center justify-center rounded-lg bg-[#0d80f2] text-slate-50 text-sm font-bold hover:bg-[#0b6acc] transition-colors"
                >
                  Sign Up
                </button>
              </div>

              <p className="text-[#49739c] text-sm text-center underline cursor-pointer hover:text-[#3d5f7a] transition-colors">
                Already have an account? Sign in
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Input Field component
const InputField = ({
  label,
  name,
  placeholder,
  type = "text",
  register,
  errors,
  rules,
}) => (
  <div className="w-full">
    <label className="flex flex-col w-full">
      <p className="pb-2 font-medium">{label}</p>
      <input
        type={type}
        placeholder={placeholder}
        {...register(name, rules)}
        className="rounded-lg bg-[#e7edf4] h-14 p-4 text-base focus:outline-none w-full focus:ring-2 focus:ring-[#0d80f2] focus:ring-opacity-50 transition-all"
      />
      {errors[name] && (
        <span className="text-red-500 text-sm mt-1">
          {errors[name].message}
        </span>
      )}
    </label>
  </div>
);

export default SignupPage;
