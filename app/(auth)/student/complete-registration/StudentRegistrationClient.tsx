'use client'
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"
import { BookOpen, User, Phone, Building, Users, CheckCircle, AlertCircle, TreePine, Library, Award, X, Calendar } from "lucide-react"

export default function CompleteRegistration() {
  const { user, isSignedIn } = useUser()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formProgress, setFormProgress] = useState(0)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | null }>({ message: '', type: null })

  const [form, setForm] = useState({
    name: user?.fullName ?? "",
    email: "",
    school: "",
    phoneNo: "",
    guardianName: "",
    guardianPhoneNo: "",
    dob: ""
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [fieldStatus, setFieldStatus] = useState<Record<string, 'valid' | 'invalid' | 'pending'>>({
    name: 'pending',
    school: 'pending',
    phoneNo: 'pending',
    guardianName: 'pending',
    guardianPhoneNo: 'pending',
    dob: 'pending',
  })

  // Calculate form progress - Fixed to include all required fields
  useEffect(() => {
    const requiredFields = ['school', 'phoneNo', 'guardianName', 'guardianPhoneNo', 'dob']
    const filledFields = requiredFields.filter(field => form[field as keyof typeof form].trim() !== '').length
    setFormProgress((filledFields / requiredFields.length) * 100)
  }, [form])

  useEffect(() => {
    if (user?.emailAddresses[0]?.emailAddress && !form.email) {
      setForm(prev => ({
        ...prev,
        email: user.emailAddresses[0].emailAddress,
        name: user.fullName || prev.name
      }))
    }
  }, [user, form.email])

  // Validation matching API's Zod schema
  const validateField = (field: string, value: string) => {
    let error = ""
    let status: 'valid' | 'invalid' | 'pending' = 'pending'

    switch (field) {
      case 'name':
      case 'guardianName':
        if (!value.trim()) {
          error = `${field === 'name' ? 'Student name' : 'Guardian name'} is required`
          status = 'invalid'
        } else if (!/^[A-Za-z\s]+$/.test(value.trim())) {
          error = `${field === 'name' ? 'Student name' : 'Guardian name'} can only contain letters and spaces`
          status = 'invalid'
        } else {
          status = 'valid'
        }
        break
      case 'school':
        if (!value.trim()) {
          error = "School name is required"
          status = 'invalid'
        } else {
          status = 'valid'
        }
        break
      case 'phoneNo':
      case 'guardianPhoneNo':
        if (!value.trim()) {
          error = `${field === 'phoneNo' ? 'Student phone number' : "Guardian phone number"} is required`
          status = 'invalid'
        } else if (!/^\d{10}$/.test(value.trim())) {
          error = `${field === 'phoneNo' ? 'Student phone number' : 'Guardian phone number'} must be 10 digits`
          status = 'invalid'
        } else {
          status = 'valid'
        }
        break
      case 'dob':
        if (!value.trim()) {
          error = "Date of birth is required"
          status = 'invalid'
        } else {
          const selectedDate = new Date(value)
          const today = new Date()
          let age = today.getFullYear() - selectedDate.getFullYear()
          const monthDiff = today.getMonth() - selectedDate.getMonth()

          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < selectedDate.getDate())) {
            age--
          }

          if (selectedDate >= today) {
            error = "Date of birth cannot be in the future"
            status = 'invalid'
          } else if (age < 5) {
            error = "Student must be at least 5 years old"
            status = 'invalid'
          } else if (age > 25) {
            error = "Please verify the date of birth"
            status = 'invalid'
          } else {
            status = 'valid'
          }
        }
        break
    }

    return { error, status }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    const newFieldStatus: Record<string, 'valid' | 'invalid' | 'pending'> = {}

    Object.keys(form).forEach(field => {
      if (field !== 'email') {
        const { error, status } = validateField(field, form[field as keyof typeof form])
        if (error) newErrors[field] = error
        newFieldStatus[field] = status
      } else {
        newFieldStatus[field] = 'valid' // Email is auto-filled and non-editable
      }
    })

    setErrors(newErrors)
    setFieldStatus(newFieldStatus)
    return Object.keys(newErrors).length === 0
  }

  // Add this useEffect to monitor toast state for navigation
  useEffect(() => {
    if (toast.type === 'success') {
      const timer = setTimeout(() => {
        router.replace('/student/dashboard'); // Use replace instead of push
      }, 1500);
      return () => clearTimeout(timer); // Cleanup timer on unmount
    }
  }, [toast.type, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setToast({ message: 'Please fix the errors in the form', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/storeStudent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, clerkId: user?.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setToast({ message: errorData.error || 'Failed to store student information', type: 'error' });
        throw new Error(errorData.error || 'Failed to store student information');
      }

      // Set success toast, navigation will be handled by useEffect
      setToast({ message: 'Registration completed successfully!', type: 'success' });
    } catch (error) {
      console.error('Error:', error);
      setToast({ message: error instanceof Error ? error.message : 'Failed to complete registration', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
    setTouched(prev => ({ ...prev, [field]: true }))

    const { error, status } = validateField(field, value)
    setErrors(prev => ({ ...prev, [field]: error }))
    setFieldStatus(prev => ({ ...prev, [field]: status }))
  }

  const getFieldIcon = (field: string) => {
    if (!touched[field]) return null
    const status = fieldStatus[field]
    if (status === 'valid') return <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
    if (status === 'invalid') return <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
    return null
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center px-4 sm:px-6">
        <div className="bg-white shadow-xl border border-emerald-100 rounded-2xl p-6 sm:p-12 w-full max-w-md">
          <div className="text-center">
            <div className="inline-flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-emerald-100 mb-4 sm:mb-6">
              <TreePine className="h-8 w-8 sm:h-10 sm:w-10 text-emerald-600" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Authentication Required</h2>
            <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">Please sign in to join The Learning Tree</p>
            <Link href="/sign-in">
              <button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-lg shadow-lg hover:from-emerald-700 hover:to-teal-700 transition-all font-medium text-sm sm:text-base">
                Sign In to Continue
              </button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Toast Notification */}
      {toast.type && (
        <div className={`fixed top-4 right-4 z-50 max-w-sm w-full p-4 rounded-xl shadow-lg flex items-center justify-between transition-all duration-300 ${toast.type === 'success' ? 'bg-green-100 border-green-200' : 'bg-red-100 border-red-200'
          }`}>
          <div className="flex items-center gap-2">
            {toast.type === 'success' ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600" />
            )}
            <span className={`text-sm font-medium ${toast.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
              {toast.message}
            </span>
          </div>
          <button onClick={() => setToast({ message: '', type: null })} className="ml-2">
            <X className="h-4 w-4 text-gray-600 hover:text-gray-800" />
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-white shadow-sm border-b border-emerald-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg shadow-lg"></div>
              <div className="absolute inset-0 bg-white rounded-lg flex items-center justify-center border-2 border-emerald-200">
                <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" />
              </div>
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                The Learning Tree
              </span>
              <p className="text-xs sm:text-sm text-gray-500 font-medium">English Learning Platform</p>
            </div>
          </div>

          {user && (
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="text-right">
                <p className="text-gray-600 text-xs sm:text-sm">
                  Welcome, <span className="text-emerald-700 font-semibold">{user.firstName || user.username || "Student"}!</span>
                </p>
                <p className="text-emerald-600 text-xs font-medium">Student</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-6 sm:py-12">
        <div className="w-full max-w-6xl">
          {/* Progress Bar */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-700 font-semibold text-sm sm:text-base flex items-center gap-2">
                <Award className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
                Registration Progress
              </h3>
              <span className="text-emerald-600 text-xs sm:text-sm font-medium bg-emerald-100 px-3 py-1 rounded-full">
                {Math.round(formProgress)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full transition-all duration-500 ease-out shadow-sm"
                style={{ width: `${formProgress}%` }}
              ></div>
            </div>
          </div>

          {/* Header */}
          <div className="mb-8 sm:mb-16 text-center">
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-3">Join The Learning Tree</h1>
            <div className="h-1 w-20 sm:w-32 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto rounded-full"></div>
            <p className="text-gray-600 mt-4 sm:mt-6 text-sm sm:text-lg px-4 max-w-2xl mx-auto">
              Complete your student profile to unlock personalized English learning resources
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 lg:grid lg:grid-cols-2 lg:gap-8 lg:space-y-0">
            {/* Student Information */}
            <div className="bg-white shadow-lg border border-emerald-100 rounded-2xl p-4 sm:p-8 hover:shadow-xl transition-all duration-300">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center">
                <Library className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600 mr-3" />
                Student Information
              </h2>

              <div className="space-y-4 sm:space-y-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <label className="text-gray-700 text-sm font-semibold">Student Name*</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter student's full name"
                      className={`w-full bg-gray-50 border-2 ${errors.name ? 'border-red-300 bg-red-50' :
                        fieldStatus.name === 'valid' ? 'border-emerald-300 bg-emerald-50' : 'border-gray-200'
                        } rounded-xl pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 text-gray-800 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 text-sm sm:text-base font-medium`}
                      required
                    />
                    <div className="absolute right-3 top-3">
                      {getFieldIcon('name')}
                    </div>
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-xs sm:text-sm flex items-center gap-1 font-medium">
                      <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Email Field - Non-editable */}
                <div className="space-y-2">
                  <label className="text-gray-700 text-sm font-semibold flex items-center gap-2">
                    Email Address*
                    <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full font-medium">Auto-filled</span>
                  </label>
                  <div className="relative">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="absolute left-3 top-3 h-4 w-4 sm:h-5 sm:w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <input
                      type="email"
                      value={form.email || 'No email available'}
                      readOnly
                      className="w-full bg-gray-100 border-2 border-gray-200 rounded-xl pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 text-gray-600 cursor-not-allowed text-sm sm:text-base font-medium"
                    />
                    <div className="absolute right-3 top-3">
                      {form.email ? (
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                      )}
                    </div>
                  </div>
                  <p className="text-gray-500 text-xs">
                    {form.email ? 'This email is automatically retrieved from your account' : 'No email found in your account'}
                  </p>
                </div>

                {/* Date of Birth Field - Fixed field reference */}
                <div className="space-y-2">
                  <label className="text-gray-700 text-sm font-semibold">Date of Birth*</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    <input
                      type="date"
                      value={form.dob}
                      onChange={(e) => handleInputChange('dob', e.target.value)}
                      max={new Date().toISOString().split('T')[0]}
                      className={`w-full bg-gray-50 border-2 ${errors.dob ? 'border-red-300 bg-red-50' :
                        fieldStatus.dob === 'valid' ? 'border-emerald-300 bg-emerald-50' : 'border-gray-200'
                        } rounded-xl pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 text-gray-800 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 text-sm sm:text-base font-medium`}
                      required
                    />
                    <div className="absolute right-3 top-3">
                      {getFieldIcon('dob')}
                    </div>
                  </div>
                  {errors.dob && (
                    <p className="text-red-500 text-xs sm:text-sm flex items-center gap-1 font-medium">
                      <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                      {errors.dob}
                    </p>
                  )}
                </div>

                {/* School Field */}
                <div className="space-y-2">
                  <label className="text-gray-700 text-sm font-semibold">School Name*</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    <input
                      type="text"
                      value={form.school}
                      onChange={(e) => handleInputChange('school', e.target.value)}
                      placeholder="Enter your school name"
                      className={`w-full bg-gray-50 border-2 ${errors.school ? 'border-red-300 bg-red-50' :
                        fieldStatus.school === 'valid' ? 'border-emerald-300 bg-emerald-50' : 'border-gray-200'
                        } rounded-xl pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 text-gray-800 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 text-sm sm:text-base font-medium`}
                      required
                    />
                    <div className="absolute right-3 top-3">
                      {getFieldIcon('school')}
                    </div>
                  </div>
                  {errors.school && (
                    <p className="text-red-500 text-xs sm:text-sm flex items-center gap-1 font-medium">
                      <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                      {errors.school}
                    </p>
                  )}
                </div>

                {/* Student Phone Number */}
                <div className="space-y-2">
                  <label className="text-gray-700 text-sm font-semibold">Student Phone Number*</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    <input
                      type="tel"
                      value={form.phoneNo}
                      onChange={(e) => handleInputChange('phoneNo', e.target.value)}
                      placeholder="Enter student's phone number"
                      className={`w-full bg-gray-50 border-2 ${errors.phoneNo ? 'border-red-300 bg-red-50' :
                        fieldStatus.phoneNo === 'valid' ? 'border-emerald-300 bg-emerald-50' : 'border-gray-200'
                        } rounded-xl pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 text-gray-800 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 text-sm sm:text-base font-medium`}
                      required
                    />
                    <div className="absolute right-3 top-3">
                      {getFieldIcon('phoneNo')}
                    </div>
                  </div>
                  {errors.phoneNo && (
                    <p className="text-red-500 text-xs sm:text-sm flex items-center gap-1 font-medium">
                      <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                      {errors.phoneNo}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Guardian Information */}
            <div className="bg-white shadow-lg border border-emerald-100 rounded-2xl p-4 sm:p-8 hover:shadow-xl transition-all duration-300">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600 mr-3" />
                Guardian Details
              </h2>

              <div className="space-y-4 sm:space-y-6">
                {/* Guardian's Name */}
                <div className="space-y-2">
                  <label className="text-gray-700 text-sm font-semibold">Guardian Name*</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    <input
                      type="text"
                      value={form.guardianName}
                      onChange={(e) => handleInputChange('guardianName', e.target.value)}
                      placeholder="Enter guardian name"
                      className={`w-full bg-gray-50 border-2 ${errors.guardianName ? 'border-red-300 bg-red-50' :
                        fieldStatus.guardianName === 'valid' ? 'border-emerald-300 bg-emerald-50' : 'border-gray-200'
                        } rounded-xl pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 text-gray-800 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 text-sm sm:text-base font-medium`}
                      required
                    />
                    <div className="absolute right-3 top-3">
                      {getFieldIcon('guardianName')}
                    </div>
                  </div>
                  {errors.guardianName && (
                    <p className="text-red-500 text-xs sm:text-sm flex items-center gap-1 font-medium">
                      <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                      {errors.guardianName}
                    </p>
                  )}
                </div>

                {/* Guardian's Phone */}
                <div className="space-y-2">
                  <label className="text-gray-700 text-sm font-semibold">Guardian Phone*</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    <input
                      type="tel"
                      value={form.guardianPhoneNo}
                      onChange={(e) => handleInputChange('guardianPhoneNo', e.target.value)}
                      placeholder="Enter guardian phone number"
                      className={`w-full bg-gray-50 border-2 ${errors.guardianPhoneNo ? 'border-red-300 bg-red-50' :
                        fieldStatus.guardianPhoneNo === 'valid' ? 'border-emerald-300 bg-emerald-50' : 'border-gray-200'
                        } rounded-xl pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 text-gray-800 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all duration-200 text-sm sm:text-base font-medium`}
                      required
                    />
                    <div className="absolute right-3 top-3">
                      {getFieldIcon('guardianPhoneNo')}
                    </div>
                  </div>
                  {errors.guardianPhoneNo && (
                    <p className="text-red-500 text-xs sm:text-sm flex items-center gap-1 font-medium">
                      <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                      {errors.guardianPhoneNo}
                    </p>
                  )}
                </div>
                {/* Learning Benefits */}
                <div className="mt-6 sm:mt-8 space-y-4">
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 rounded-xl p-4 sm:p-6">
                    <div className="flex items-center gap-3 mb-3 sm:mb-4">
                      <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" />
                      <span className="text-emerald-700 font-bold text-base sm:text-lg">What You will Get</span>
                    </div>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex items-center gap-2 text-gray-700 text-xs sm:text-sm">
                        <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-600 flex-shrink-0" />
                        <span><span className="font-semibold">Personalized English lessons</span> tailored to your needs</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700 text-xs sm:text-sm">
                        <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-600 flex-shrink-0" />
                        <span><span className="font-semibold">Interactive grammar</span> and vocabulary exercises</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700 text-xs sm:text-sm">
                        <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-600 flex-shrink-0" />
                        <span><span className="font-semibold">Reading comprehension</span> and writing practice</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700 text-xs sm:text-sm">
                        <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-600 flex-shrink-0" />
                        <span><span className="font-semibold">Progress tracking</span> and performance reports</span>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading || formProgress < 100}
                    className={`w-full px-4 sm:px-6 py-4 sm:py-5 rounded-xl shadow-lg font-bold transition-all duration-300 transform text-sm sm:text-base ${loading || formProgress < 100
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 hover:scale-105 hover:shadow-xl active:scale-95'
                      }`}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0116 0"></path>
                        </svg>
                        <span className="text-xs sm:text-base">Creating Your Account...</span>
                      </span>
                    ) : formProgress < 100 ? (
                      <span className="flex items-center justify-center gap-2">
                        <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="text-xs sm:text-base">Complete All Fields ({Math.round(formProgress)}%)</span>
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <TreePine className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="text-xs sm:text-base">Start My English Learning Journey</span>
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}