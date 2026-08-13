"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthModal } from "@/lib/store";
import { X, Eye, EyeOff } from "lucide-react";

import { useUser } from "@/contexts/UserContext";

export default function AuthModal() {
  const router = useRouter();
  const { isOpen, type, signupStep, closeModal, setSignupStep, openLogin, openSignup } = useAuthModal();
  const { loginUser } = useUser();
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [age, setAge] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleCreateAccount = () => {
    loginUser(name || "Learner", email || "learner@example.com");
    closeModal();
    router.push('/learn');
  };

  const handleLogin = () => {
    loginUser(name || "Learner", email || "learner@example.com");
    closeModal();
    router.push('/learn');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
      <div className="relative w-full max-w-[400px] bg-[#131f24] rounded-2xl p-6 sm:p-8 flex flex-col items-center">
        {/* Close Button */}
        <button 
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
        >
          <X className="w-6 h-6 stroke-[3]" />
        </button>

        {type === "signup" && signupStep === "age" && (
          <div className="w-full flex flex-col items-center animate-in fade-in zoom-in duration-200">
            <h2 className="text-2xl font-bold text-white mb-6">What is your age?</h2>
            
            <input 
              type="number"
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full bg-[#131f24] border-2 border-[#2f434c] rounded-xl px-4 py-3 text-white placeholder-gray-400 font-medium focus:outline-none focus:border-[#1cb0f6] transition mb-6"
            />
            
            <button 
              onClick={() => age ? setSignupStep("profile") : null}
              disabled={!age}
              className={`w-full py-3.5 rounded-2xl font-bold uppercase tracking-widest transition-all ${
                age 
                  ? "bg-[#1cb0f6] hover:bg-[#1899d6] border-b-4 border-[#1899d6] text-white active:border-b-0 active:translate-y-[4px]"
                  : "bg-[#2f434c] text-gray-400 cursor-not-allowed"
              }`}
            >
              Continue
            </button>
            
            <p className="text-gray-400 font-bold text-sm mt-6">
              ALREADY HAVE AN ACCOUNT? <button onClick={openLogin} className="text-[#1cb0f6] hover:text-[#1899d6] uppercase ml-1">LOG IN</button>
            </p>
          </div>
        )}

        {type === "signup" && signupStep === "profile" && (
          <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-right-8 duration-200">
            <h2 className="text-2xl font-bold text-white mb-6">Create your profile</h2>
            
            <div className="w-full flex flex-col gap-4 mb-6">
              <input 
                type="text"
                placeholder="Name (optional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#131f24] border-2 border-[#2f434c] rounded-xl px-4 py-3 text-white placeholder-gray-400 font-medium focus:outline-none focus:border-[#1cb0f6] transition"
              />
              
              <input 
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#131f24] border-2 border-[#2f434c] rounded-xl px-4 py-3 text-white placeholder-gray-400 font-medium focus:outline-none focus:border-[#1cb0f6] transition"
              />
              
              <div className="relative w-full">
                <input 
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#131f24] border-2 border-[#2f434c] rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-400 font-medium focus:outline-none focus:border-[#1cb0f6] transition"
                />
                <button 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1cb0f6] hover:text-[#1899d6] transition"
                >
                  {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                </button>
              </div>
            </div>
            
            <button 
              onClick={handleCreateAccount}
              className="w-full py-3.5 rounded-2xl bg-[#1cb0f6] hover:bg-[#1899d6] border-b-4 border-[#1899d6] active:border-b-0 active:translate-y-[4px] text-white font-bold uppercase tracking-widest transition-all mb-4 cursor-pointer"
            >
              Create Account
            </button>
            
            <button 
              onClick={() => {
                closeModal();
                router.push('/learn');
              }}
              className="w-full py-3.5 text-gray-400 hover:text-white font-bold uppercase tracking-widest transition-all mb-4 cursor-pointer"
            >
              LATER
            </button>

            <p className="text-[#4b4b4b] text-[11px] font-medium text-center leading-tight">
              By signing in to Duolingo, you agree to our Terms and Privacy Policy.
            </p>
          </div>
        )}

        {type === "login" && (
          <div className="w-full flex flex-col items-center animate-in fade-in zoom-in duration-200">
            <h2 className="text-2xl font-bold text-white mb-6">Log in</h2>
            
            <div className="w-full flex flex-col gap-4 mb-6">
              <input 
                type="text"
                placeholder="Email or phone"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#131f24] border-2 border-[#2f434c] rounded-xl px-4 py-3 text-white placeholder-gray-400 font-medium focus:outline-none focus:border-[#1cb0f6] transition"
              />
              
              <div className="relative w-full">
                <input 
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#131f24] border-2 border-[#2f434c] rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-400 font-medium focus:outline-none focus:border-[#1cb0f6] transition"
                />
                <button 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1cb0f6] hover:text-[#1899d6] transition"
                >
                  {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                </button>
              </div>
            </div>
            
            <button 
              onClick={handleLogin}
              className="w-full py-3.5 rounded-2xl bg-[#1cb0f6] hover:bg-[#1899d6] border-b-4 border-[#1899d6] active:border-b-0 active:translate-y-[4px] text-white font-bold uppercase tracking-widest transition-all mb-6 cursor-pointer"
            >
              Log in
            </button>

            <div className="flex flex-col items-center gap-4 w-full">
              <p className="text-gray-400 font-bold text-sm">
                DON'T HAVE AN ACCOUNT? <button onClick={openSignup} className="text-[#1cb0f6] hover:text-[#1899d6] uppercase ml-1">SIGN UP</button>
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
