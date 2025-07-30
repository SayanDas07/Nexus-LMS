'use client'
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"
import { User, Mail, Phone, CheckCircle, AlertCircle, Send, Shield, GraduationCap, Calendar, Building2, BookOpen } from "lucide-react"

export default function TeacherRegistration() {
  const { user, isSignedIn } = useUser()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | null }>({ message: '', type: null })

  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNo: "",
    collegeName: "",
    specialization: "",
    dob: "",
    otp: ""
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (user?.emailAddresses[0]?.emailAddress && !form.email) {
      setForm(prev => ({
        ...prev,
        email: user.emailAddresses[0].emailAddress,
        name: user.fullName || prev.name
      }))
    }
  }, [user, form.email])

  const validateField = (field: string, value: string) => {
    let error = ""
    switch (field) {
      case 'name':
        if (!value.trim()) error = "Name is required"
        else if (!/^[A-Za-z\s]+$/.test(value.trim())) error = "Name can only contain letters and spaces"
        break
      case 'phoneNo':
        if (!value.trim()) error = "Phone number is required"
        else if (!/^\d{10}$/.test(value.trim())) error = "Phone number must be 10 digits"
        break
      case 'collegeName':
        if (!value.trim()) error = "College name is required"
        else if (value.trim().length < 3) error = "College name must be at least 3 characters"
        break
      case 'specialization':
        if (!value.trim()) error = "Specialization is required"
        else if (value.trim().length < 2) error = "Specialization must be at least 2 characters"
        break
      case 'dob':
        if (!value.trim()) error = "Date of birth is required"
        else {
          const dobDate = new Date(value)
          const today = new Date()
          let age = today.getFullYear() - dobDate.getFullYear()
          const monthDiff = today.getMonth() - dobDate.getMonth()
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) age--
          if (age < 18) error = "You must be at least 18 years old"
          else if (age > 100) error = "Please enter a valid date of birth"
        }
        break
      case 'otp':
        if (!value.trim()) error = "OTP is required"
        else if (!/^\d{6}$/.test(value.trim())) error = "OTP must be 6 digits"
        break
    }
    return error
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!otpSent) {
      Object.keys(form).forEach(field => {
        if (field !== 'otp' && field !== 'email') {
          const error = validateField(field, form[field as keyof typeof form])
          if (error) newErrors[field] = error
        }
      })
    } else if (!otpVerified) {
      const error = validateField('otp', form.otp)
      if (error) newErrors.otp = error
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isFormComplete = () => {
    return form.name.trim() &&
      form.email.trim() &&
      form.phoneNo.trim() &&
      form.collegeName.trim() &&
      form.specialization.trim() &&
      form.dob.trim() &&
      Object.keys(errors).every(key => !errors[key])
  }

  const handleSendOtp = async (isResend: boolean = false) => {
    // Skip OTP validation if resending or if OTP hasn't been sent yet
    if (!isResend && !validateForm()) {
      setToast({ message: 'Please fix all errors in the form', type: 'error' });
      return;
    }
    if (!isResend && !isFormComplete()) {
      setToast({ message: 'Please fill all required fields', type: 'error' });
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/sendOtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phoneNo: form.phoneNo,
          collegeName: form.collegeName,
          specialization: form.specialization,
          dob: form.dob,
          clerkId: user?.id,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to send OTP');
      setOtpSent(true);
      setToast({ message: 'OTP sent to admin for verification!', type: 'success' });
    } catch (error) {
      setToast({
        message: error instanceof Error ? error.message : 'Failed to send OTP',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setForm((prev) => ({ ...prev, otp: '' }));
    setErrors((prev) => ({ ...prev, otp: '' }));
    await handleSendOtp(true); // Pass true to indicate resend
  };

  const handleVerifyOtp = async () => {
    if (!validateForm()) {
      setToast({ message: 'Please enter a valid OTP', type: 'error' })
      return
    }
    setLoading(true)
    try {
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          otp: form.otp,
          name: form.name,
          phoneNo: form.phoneNo,
          College: form.collegeName,
          Specialization: form.specialization,
          DOB: form.dob,
          clerkId: user?.id
        })
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Failed to verify OTP')
      setOtpVerified(true)
      setToast({ message: 'Registration completed successfully!', type: 'success' })
      setTimeout(() => router.push('/teacher/dashboard'), 1500)
    } catch (error) {
      setToast({ message: error instanceof Error ? error.message : 'Failed to verify OTP', type: 'error' })
    } finally {
      setLoading(false)
    }
  }


  const handleInputChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    const error = validateField(field, value)
    setErrors(prev => ({ ...prev, [field]: error }))
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg p-6 sm:p-8 w-full max-w-md">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <BookOpen className="h-12 w-12 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Authentication Required</h2>
            <p className="text-gray-600 mb-6">Please sign in to continue</p>
            <Link href="/sign-in">
              <button className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                Sign In to Continue
              </button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Notification - Mobile Responsive */}
      {toast.type && (
        <div className={`fixed top-4 left-4 right-4 sm:right-4 sm:left-auto sm:max-w-sm z-50 p-3 sm:p-4 rounded-lg shadow-lg flex items-center justify-between ${toast.type === 'success' ? 'bg-green-100 border-green-200' : 'bg-red-100 border-red-200'}`}>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {toast.type === 'success' ? (
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
            )}
            <span className={`text-sm font-medium ${toast.type === 'success' ? 'text-green-800' : 'text-red-800'} truncate`}>
              {toast.message}
            </span>
          </div>
          <button
            onClick={() => setToast({ message: '', type: null })}
            className="ml-2 flex-shrink-0 p-1 hover:bg-gray-200 rounded"
          >
            <span className="text-gray-600 text-lg leading-none">×</span>
          </button>
        </div>
      )}

      <div className="flex items-center justify-center min-h-screen p-4 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg p-6 sm:p-8 w-full max-w-lg">
          <div className="text-center mb-6 sm:mb-8">
            <div className="flex justify-center mb-4">
              <BookOpen className="h-10 w-10 sm:h-12 sm:w-12 text-blue-600" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Teacher Registration</h1>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">Complete your teacher profile</p>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {/* Basic Form - Show when OTP not sent */}
            {!otpSent && (
              <>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Full Name*</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter your full name"
                      className={`w-full pl-10 pr-4 py-3 text-black border ${errors.name ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base`}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">Email*</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      value={form.email}
                      readOnly
                      className="w-full pl-10 pr-4 py-3 text-black border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed text-sm sm:text-base"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">Phone Number*</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      value={form.phoneNo}
                      onChange={(e) => handleInputChange('phoneNo', e.target.value)}
                      placeholder="Enter your phone number"
                      className={`w-full pl-10 pr-4 py-3 text-black border ${errors.phoneNo ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base`}
                    />
                  </div>
                  {errors.phoneNo && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.phoneNo}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">College Name*</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={form.collegeName}
                      onChange={(e) => handleInputChange('collegeName', e.target.value)}
                      placeholder="Enter your college name"
                      className={`w-full pl-10 pr-4 py-3 text-black border ${errors.collegeName ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base`}
                    />
                  </div>
                  {errors.collegeName && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.collegeName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">Specialization*</label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={form.specialization}
                      onChange={(e) => handleInputChange('specialization', e.target.value)}
                      placeholder="e.g., Computer Science, Mathematics"
                      className={`w-full pl-10 pr-4 py-3 text-black border ${errors.specialization ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base`}
                    />
                  </div>
                  {errors.specialization && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.specialization}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">Date of Birth*</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      value={form.dob}
                      onChange={(e) => handleInputChange('dob', e.target.value)}
                      max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                      className={`w-full pl-10 pr-4 py-3 text-black border ${errors.dob ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base`}
                    />
                  </div>
                  {errors.dob && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.dob}</p>
                  )}
                </div>

                <button
                  onClick={() => handleSendOtp()}
                  disabled={loading || !isFormComplete()}
                  className={`w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm sm:text-base ${!isFormComplete()
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                    } disabled:bg-gray-400`}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Sending OTP...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send OTP
                    </>
                  )}
                </button>
              </>
            )}

            {/* OTP Verification - Show when OTP sent but not verified */}
            {otpSent && !otpVerified && (
              <>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-xs sm:text-sm text-blue-800">
                    OTP has been sent to admin for verification. Please enter the OTP when received.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">Enter OTP*</label>
                  <input
                    type="text"
                    value={form.otp}
                    onChange={(e) => handleInputChange('otp', e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    className={`w-full px-4 py-3 text-black border ${errors.otp ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-lg tracking-widest`}
                  />
                  {errors.otp && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.otp}</p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleVerifyOtp}
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center gap-2 transition-colors text-sm sm:text-base"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Verifying...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        Verify OTP
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleResendOtp}
                    disabled={loading}
                    className="px-4 py-3 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 flex items-center justify-center gap-2 transition-colors text-sm sm:text-base sm:flex-shrink-0"
                  >
                    <Send className="h-4 w-4" />
                    Resend
                  </button>
                </div>

                <button
                  onClick={() => setOtpSent(false)}
                  className="w-full text-gray-600 py-2 hover:text-gray-800 transition-colors text-sm sm:text-base"
                >
                  ← Back to Edit Details
                </button>
              </>
            )}

            {/* Success State */}
            {otpVerified && (
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <CheckCircle className="h-10 w-10 sm:h-12 sm:w-12 text-green-600 mx-auto mb-2" />
                <h3 className="text-lg font-semibold text-green-800">Registration Successful!</h3>
                <p className="text-xs sm:text-sm text-green-600 mt-2">
                  Redirecting to teacher dashboard...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}