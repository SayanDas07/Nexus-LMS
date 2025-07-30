"use client";

import { SignUp } from "@clerk/nextjs";
import { BookOpen } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function SignUpPage() {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      /* Enhanced animations */
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
      
      @keyframes pulse-glow {
        0%, 100% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.2); }
        50% { box-shadow: 0 0 30px rgba(16, 185, 129, 0.4); }
      }
      
      .animate-fade-in-up {
        animation: fadeInUp 0.8s ease-out forwards;
      }
      
      .animate-shimmer {
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
        background-size: 200% 100%;
        animation: shimmer 2s infinite;
      }
      
      .pulse-glow {
        animation: pulse-glow 3s ease-in-out infinite;
      }

      /* Custom thin scrollbar for the entire page */
      *::-webkit-scrollbar {
        width: 6px !important;
        height: 6px !important;
      }

      *::-webkit-scrollbar-track {
        background: rgba(209, 250, 229, 0.3) !important;
        border-radius: 10px !important;
      }

      *::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, #10b981, #059669) !important;
        border-radius: 10px !important;
        border: 1px solid rgba(255, 255, 255, 0.2) !important;
      }

      *::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(180deg, #059669, #047857) !important;
      }

      /* Firefox scrollbar styling */
      * {
        scrollbar-width: thin !important;
        scrollbar-color: #10b981 rgba(209, 250, 229, 0.3) !important;
      }
      
      /* Base styles for all screen sizes */
      html, body {
        overflow-x: hidden !important;
        width: 100% !important;
        max-width: 100% !important;
      }
      
      .clerk-signup-container {
        width: 100% !important;
        max-width: 100% !important;
        overflow: hidden !important;
        display: flex !important;
        justify-content: center !important;
        align-items: center !important;
      }
      
      .clerk-signup-container * {
        box-sizing: border-box !important;
      }
      
      /* Universal Clerk component fixes - CENTERED */
      .clerk-signup-container .cl-card {
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
        margin: 0 auto !important;
        padding: 20px !important;
        box-sizing: border-box !important;
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        overflow: hidden !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
      }
      
      .clerk-signup-container .cl-main {
        width: 100% !important;
        max-width: 100% !important;
        padding: 0 !important;
        margin: 0 auto !important;
        overflow: hidden !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
      }
      
      .clerk-signup-container .cl-rootBox {
        width: 100% !important;
        max-width: 100% !important;
        overflow: hidden !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
      }
      
      .clerk-signup-container .cl-formContainer {
        width: 100% !important;
        max-width: 100% !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
      }
      
      .clerk-signup-container .cl-form {
        width: 100% !important;
        max-width: 100% !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
      }
      
      /* Form elements */
      .clerk-signup-container .cl-formFieldInput {
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
        box-sizing: border-box !important;
        font-size: 16px !important;
        padding: 14px 16px !important;
        border-radius: 12px !important;
        border: 2px solid #e5e7eb !important;
        background: #ffffff !important;
        transition: all 0.3s ease !important;
        line-height: 1.5 !important;
      }
      
      .clerk-signup-container .cl-formFieldInput:focus {
        border-color: #10b981 !important;
        box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1) !important;
        outline: none !important;
      }
      
      .clerk-signup-container .cl-formButtonPrimary {
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
        font-size: 16px !important;
        font-weight: 600 !important;
        padding: 16px !important;
        box-sizing: border-box !important;
        background: linear-gradient(135deg, #10b981, #059669) !important;
        border: none !important;
        border-radius: 12px !important;
        color: white !important;
        cursor: pointer !important;
        transition: all 0.3s ease !important;
        text-transform: none !important;
        letter-spacing: 0.5px !important;
        line-height: 1.4 !important;
        margin: 0 auto !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
      }
      
      .clerk-signup-container .cl-formButtonPrimary:hover {
        background: linear-gradient(135deg, #059669, #047857) !important;
        transform: translateY(-2px) !important;
        box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3) !important;
      }
      
      /* Social buttons - CENTERED */
      .clerk-signup-container .cl-socialButtons {
        width: 100% !important;
        max-width: 100% !important;
        margin-bottom: 20px !important;
        overflow: hidden !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
      }
      
      .clerk-signup-container .cl-socialButtonsBlockButton {
        width: 100% !important;
        max-width: 100% !important;
        min-width: 0 !important;
        margin-bottom: 12px !important;
        font-size: 15px !important;
        font-weight: 500 !important;
        padding: 14px 16px !important;
        box-sizing: border-box !important;
        border-radius: 12px !important;
        border: 2px solid #e5e7eb !important;
        background: white !important;
        transition: all 0.3s ease !important;
        line-height: 1.4 !important;
        white-space: nowrap !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        text-align: center !important;
      }
      
      .clerk-signup-container .cl-socialButtonsBlockButton:hover {
        border-color: #10b981 !important;
        background: rgba(16, 185, 129, 0.05) !important;
        transform: translateY(-1px) !important;
      }
      
      /* Header and footer - CENTERED */      
      .clerk-signup-container .cl-header {
        display: none !important;
      }
      
      .clerk-signup-container .cl-footer {
        width: 100% !important;
        max-width: 100% !important;
        padding: 20px 8px 16px 8px !important;
        margin-top: 24px !important;
        text-align: center !important;
        box-sizing: border-box !important;
        border-top: 1px solid rgba(16, 185, 129, 0.15) !important;
        background: rgba(16, 185, 129, 0.02) !important;
        border-radius: 0 0 12px 12px !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
      }
      
      .clerk-signup-container .cl-footerAction {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 8px !important;
        margin-bottom: 16px !important;
        width: 100% !important;
        text-align: center !important;
      }
      
      .clerk-signup-container .cl-footerActionText {
        font-size: 14px !important;
        line-height: 1.5 !important;
        text-align: center !important;
        margin: 0 !important;
        color: #6b7280 !important;
      }
      
      .clerk-signup-container .cl-footerActionLink {
        font-size: 15px !important;
        font-weight: 600 !important;
        line-height: 1.5 !important;
        text-decoration: none !important;
        color: #10b981 !important;
        text-align: center !important;
        padding: 8px 16px !important;
        border-radius: 8px !important;
        background: rgba(16, 185, 129, 0.1) !important;
        transition: all 0.3s ease !important;
        border: 1px solid rgba(16, 185, 129, 0.2) !important;
        margin: 0 auto !important;
      }
      
      .clerk-signup-container .cl-footerActionLink:hover {
        background: rgba(16, 185, 129, 0.2) !important;
        transform: translateY(-1px) !important;
      }
      
      /* Form fields - CENTERED */
      .clerk-signup-container .cl-formFieldRow {
        margin-bottom: 20px !important;
        width: 100% !important;
        max-width: 100% !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
      }
      
      .clerk-signup-container .cl-formFieldLabel {
        font-size: 14px !important;
        font-weight: 600 !important;
        color: #374151 !important;
        margin-bottom: 8px !important;
        display: block !important;
        width: 100% !important;
        text-align: left !important;
      }
      
      .clerk-signup-container .cl-formFieldError {
        font-size: 13px !important;
        margin-top: 8px !important;
        line-height: 1.4 !important;
        color: #ef4444 !important;
        padding: 8px 12px !important;
        background: rgba(239, 68, 68, 0.1) !important;
        border-radius: 8px !important;
        border-left: 3px solid #ef4444 !important;
        width: 100% !important;
        text-align: center !important;
      }
      
      /* Divider - CENTERED */
      .clerk-signup-container .cl-dividerRow {
        margin: 24px 0 !important;
        width: 100% !important;
        position: relative !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
      }
      
      .clerk-signup-container .cl-dividerText {
        font-size: 13px !important;
        padding: 0 16px !important;
        color: #6b7280 !important;
        background: white !important;
        position: relative !important;
        z-index: 1 !important;
        text-align: center !important;
      }
      
      .clerk-signup-container .cl-dividerLine {
        border-color: rgba(16, 185, 129, 0.2) !important;
      }
      
      /* Badge - CENTERED */
      .clerk-signup-container .cl-badge {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        font-size: 12px !important;
        padding: 8px 16px !important;
        max-width: 100% !important;
        text-align: center !important;
        line-height: 1.4 !important;
        background: rgba(16, 185, 129, 0.1) !important;
        color: #059669 !important;
        border-radius: 20px !important;
        border: 1px solid rgba(16, 185, 129, 0.2) !important;
        box-sizing: border-box !important;
        margin: 0 auto !important;
      }
      
      /* Loading states */
      .clerk-signup-container .cl-spinner {
        width: 24px !important;
        height: 24px !important;
      }
      
      /* Mobile-specific optimizations */
      @media (max-width: 640px) {
        .clerk-signup-container .cl-card {
          padding: 16px !important;
        }
        
        .clerk-signup-container .cl-formFieldInput {
          font-size: 16px !important; /* Prevents zoom on iOS */
          padding: 12px 14px !important;
        }
        
        .clerk-signup-container .cl-formButtonPrimary {
          font-size: 16px !important;
          padding: 14px !important;
        }
        
        .clerk-signup-container .cl-socialButtonsBlockButton {
          font-size: 14px !important;
          padding: 12px 14px !important;
        }
        
        .clerk-signup-container .cl-footer {
          padding: 16px 4px 12px 4px !important;
        }
        
        .clerk-signup-container .cl-footerActionText {
          font-size: 13px !important;
        }
        
        .clerk-signup-container .cl-footerActionLink {
          font-size: 14px !important;
          padding: 6px 12px !important;
        }
      }
      
      /* Extra small devices (iPhone SE, small Android phones) */
      @media (max-width: 375px) {
        .clerk-signup-container .cl-card {
          padding: 12px !important;
        }
        
        .clerk-signup-container .cl-formFieldInput,
        .clerk-signup-container .cl-socialButtonsBlockButton {
          font-size: 15px !important;
          padding: 11px 12px !important;
        }
        
        .clerk-signup-container .cl-formButtonPrimary {
          font-size: 15px !important;
          padding: 13px !important;
        }
        
        .clerk-signup-container .cl-footerActionLink {
          font-size: 13px !important;
          padding: 5px 10px !important;
        }
      }
      
      /* Tablet adjustments */
      @media (min-width: 641px) and (max-width: 1024px) {
        .clerk-signup-container .cl-card {
          max-width: 420px !important;
          margin: 0 auto !important;
          padding: 28px 24px !important;
        }
        
        .clerk-signup-container .cl-footerAction {
          flex-direction: row !important;
          justify-content: center !important;
          gap: 8px !important;
        }
        
        .clerk-signup-container .cl-footerActionLink {
          padding: 6px 12px !important;
          background: transparent !important;
          border: none !important;
        }
      }
      
      /* Desktop - premium styling */
      @media (min-width: 1025px) {
        .clerk-signup-container .cl-card {
          max-width: 480px !important;
          padding: 36px 32px !important;
        }
        
        .clerk-signup-container .cl-footerAction {
          flex-direction: row !important;
          justify-content: center !important;
          gap: 8px !important;
        }
        
        .clerk-signup-container .cl-footerActionLink {
          padding: 6px 12px !important;
          background: transparent !important;
          border: none !important;
        }
        
        .clerk-signup-container .cl-formButtonPrimary:hover {
          transform: translateY(-3px) !important;
          box-shadow: 0 12px 35px rgba(16, 185, 129, 0.4) !important;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 sm:-top-40 sm:-right-40 w-40 h-40 sm:w-80 sm:h-80 bg-gradient-to-br from-emerald-200 to-teal-200 rounded-full opacity-20 blur-2xl sm:blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 sm:-bottom-40 sm:-left-40 w-40 h-40 sm:w-80 sm:h-80 bg-gradient-to-br from-green-200 to-emerald-200 rounded-full opacity-20 blur-2xl sm:blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 sm:w-96 sm:h-96 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-full opacity-10 blur-2xl sm:blur-3xl"></div>
      </div>

      {/* Navbar */}
      <nav className="w-full px-3 sm:px-4 lg:px-6 py-3 sm:py-4 bg-white/80 backdrop-blur-xl border-b border-emerald-100 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="group">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl sm:rounded-2xl blur-md sm:blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-lg sm:text-xl font-bold text-gray-800 group-hover:text-emerald-600 transition-colors duration-300">
                  Nexus LMS
                </span>

              </div>
            </div>
          </Link>

        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 pt-4 sm:pt-6 lg:pt-8 pb-8 sm:pb-12 px-3 sm:px-4 lg:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center">

            {/* Sign Up Form - Now centered and fully responsive */}
            <div className="animate-fade-in-up w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-200 to-teal-200 rounded-2xl sm:rounded-3xl blur-lg sm:blur-xl opacity-20"></div>
                <div className="relative bg-white/70 backdrop-blur-xl p-0.5 sm:p-1 rounded-2xl sm:rounded-3xl border border-white/50 shadow-xl sm:shadow-2xl">
                  <div className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 lg:p-6 xl:p-8 shadow-lg overflow-hidden">

                    {/* Form Header */}
                    <div className="text-center mb-4 sm:mb-6">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 pulse-glow">
                        <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                      </div>
                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                        Start Growing Today
                      </h2>
                      <p className="text-sm sm:text-base text-gray-600 px-2">
                        Create your account and begin your adventure. If you already have an account, please <Link href="/sign-in" className="text-emerald-600 hover:underline">sign in</Link>. Otherwise You will face issues.
                      </p>
                    </div>

                    {/* Clerk Sign Up Component */}
                    <div className="clerk-signup-container w-full overflow-hidden">
                      <SignUp
                        path="/sign-up"
                        routing="path"
                        signInUrl="/sign-in"
                        redirectUrl="/chose-role"
                        appearance={{
                          variables: {
                            colorPrimary: "#10b981",
                            colorBackground: "#ffffff",
                            colorText: "#1f2937",
                            fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
                            borderRadius: "12px",
                            spacingUnit: "0.75rem",
                          },
                          elements: {
                            card: {
                              width: "100%",
                              boxShadow: "none",
                              backgroundColor: "transparent",
                              border: "none",
                              padding: "0",
                            },
                            footer: {
                              background: "transparent",
                            },
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Brand */}
      <div className="relative z-10 pb-4 sm:pb-6">
        <div className="text-center px-3 sm:px-4">
          <p className="text-xs sm:text-sm text-gray-500">
            © 2025 Nexus LMS. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}