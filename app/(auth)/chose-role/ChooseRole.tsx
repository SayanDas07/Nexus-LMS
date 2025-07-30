//This Page is for choosing the role of the user (student or teacher) before proceeding with registration.
'use client'
import { useRouter } from "next/navigation"
import { User, Users, BookOpen, ArrowRight, GraduationCap } from "lucide-react"

export default function ChooseRole() {
  const router = useRouter()
     
// Function to handle role selection and redirect to the appropriate registration page
  const handleRoleSelection = (role: string) => {
    if (role === 'student') {
      router.push('/student/complete-registration')
    } else if (role === 'teacher') {
      router.push('/teacher/complete-registration')
    }
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navbar */}
      <header className="bg-slate-800/80 backdrop-blur-lg border-b border-slate-700/50 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-blue-400" />
              <div>
                <h1 className="text-xl font-bold text-slate-100">Nexus LMS</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4 sm:p-6">
        <div className="w-full max-w-2xl">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-6 shadow-xl">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
              Choose Your Learning Path
            </h1>
            <p className="text-lg text-slate-600 max-w-md mx-auto">
              Select your role to get started on your educational journey
            </p>
          </div>

          {/* Role Selection Cards */}
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Student Card */}
            <div 
              onClick={() => handleRoleSelection('student')}
              className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-slate-200 hover:border-blue-300 transform hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <ArrowRight className="w-6 h-6 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-300" />
                </div>
                
                <h3 className="text-2xl font-bold text-slate-800 mb-3">Student</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Join our learning community and access courses, assignments, and interactive content
                </p>
                
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">Learn</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">Practice</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">Grow</span>
                </div>
              </div>
            </div>

            {/* Teacher Card */}
            <div 
              onClick={() => handleRoleSelection('teacher')}
              className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-slate-200 hover:border-green-300 transform hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <ArrowRight className="w-6 h-6 text-slate-400 group-hover:text-green-500 group-hover:translate-x-1 transition-all duration-300" />
                </div>
                
                <h3 className="text-2xl font-bold text-slate-800 mb-3">Teacher</h3>
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Create courses, manage students, and share your knowledge with the world
                </p>
                
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Teach</span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Guide</span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">Inspire</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Text */}
          <div className="text-center mt-12">
            <p className="text-slate-500 text-sm">
              If you are a student then you have to contact the teacher first to get the class INVITE CODE.
            </p>
          </div>
          <div className="relative z-10 pt-5 sm:pb-6">
        <div className="text-center px-3 sm:px-4">
          <p className="text-xs sm:text-sm text-gray-500">
            © 2025 Nexus LMS. All rights reserved.
          </p>
        </div>
      </div>
        </div>
      </div>
    </div>
  )
}