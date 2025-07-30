'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { toast } from 'sonner'
import { BookOpen } from 'lucide-react'

// Zod validation schema
const createClassSchema = z.object({
  name: z.string()
    .min(1, 'Class name is required')
    .refine((name) => {
      const boards = ['ICSE', 'ISC', 'WBBSE', 'WBCHSE', 'CBSE']
      return boards.some(board => name.toUpperCase().includes(board))
    }, 'Board name is required in class name (ICSE/ISC/WBBSE/WBCHSE/CBSE)'),
  whichClass: z.string()
    .min(1, 'Grade/Level is required')
    .refine((grade) => {
      const num = parseInt(grade)
      return !isNaN(num) && num >= 1 && num <= 12
    }, 'Grade must be a valid number between 1-12')
})

//This the Animation
const ProfessionalAnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let time = 0

    // Network nodes for connection lines
    const nodes: Array<{
      x: number
      y: number
      vx: number
      vy: number
      size: number
      opacity: number
      color: string
      pulse: number
      originalX: number
      originalY: number
    }> = []

    // Floating geometric shapes
    const geometricShapes: Array<{
      x: number
      y: number
      vx: number
      vy: number
      size: number
      rotation: number
      rotationSpeed: number
      opacity: number
      type: 'triangle' | 'square' | 'hexagon' | 'circle'
      color: string
    }> = []

    // Data flow particles
    const dataFlowParticles: Array<{
      x: number
      y: number
      targetX: number
      targetY: number
      progress: number
      speed: number
      size: number
      opacity: number
      color: string
    }> = []

    // Grid lines for tech feel
    const gridLines: Array<{
      x1: number
      y1: number
      x2: number
      y2: number
      opacity: number
      animationOffset: number
    }> = []

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      createElements()
    }

    const createElements = () => {
      // Create network nodes
      nodes.length = 0
      const nodeCount = Math.min(50, Math.floor((canvas.width * canvas.height) / 15000))

      for (let i = 0; i < nodeCount; i++) {
        const x = Math.random() * canvas.width
        const y = Math.random() * canvas.height
        nodes.push({
          x,
          y,
          originalX: x,
          originalY: y,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.4 + 0.2,
          color: ['#60a5fa', '#a78bfa', '#34d399', '#fbbf24'][Math.floor(Math.random() * 4)],
          pulse: Math.random() * Math.PI * 2
        })
      }

      // Create geometric shapes
      geometricShapes.length = 0
      const shapeCount = Math.min(15, Math.floor(canvas.width / 150))
      const shapeTypes: Array<'triangle' | 'square' | 'hexagon' | 'circle'> = ['triangle', 'square', 'hexagon', 'circle']

      for (let i = 0; i < shapeCount; i++) {
        geometricShapes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 40 + 20,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.02,
          opacity: Math.random() * 0.1 + 0.05,
          type: shapeTypes[Math.floor(Math.random() * shapeTypes.length)],
          color: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'][Math.floor(Math.random() * 4)]
        })
      }

      // Create data flow particles
      dataFlowParticles.length = 0
      for (let i = 0; i < 20; i++) {
        dataFlowParticles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          targetX: Math.random() * canvas.width,
          targetY: Math.random() * canvas.height,
          progress: 0,
          speed: Math.random() * 0.01 + 0.005,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.6 + 0.3,
          color: ['#60a5fa', '#a78bfa', '#34d399'][Math.floor(Math.random() * 3)]
        })
      }

      // Create grid lines
      gridLines.length = 0
      const gridSpacing = 80

      // Vertical lines
      for (let x = 0; x <= canvas.width; x += gridSpacing) {
        gridLines.push({
          x1: x,
          y1: 0,
          x2: x,
          y2: canvas.height,
          opacity: 0.03,
          animationOffset: Math.random() * Math.PI * 2
        })
      }

      // Horizontal lines
      for (let y = 0; y <= canvas.height; y += gridSpacing) {
        gridLines.push({
          x1: 0,
          y1: y,
          x2: canvas.width,
          y2: y,
          opacity: 0.03,
          animationOffset: Math.random() * Math.PI * 2
        })
      }
    }

    const drawGrid = () => {
      gridLines.forEach(line => {
        const opacity = line.opacity + Math.sin(time * 0.01 + line.animationOffset) * 0.01
        ctx.beginPath()
        ctx.moveTo(line.x1, line.y1)
        ctx.lineTo(line.x2, line.y2)
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`
        ctx.lineWidth = 1
        ctx.stroke()
      })
    }

    const drawGeometricShape = (shape: typeof geometricShapes[0]) => {
      ctx.save()
      ctx.translate(shape.x, shape.y)
      ctx.rotate(shape.rotation)

      ctx.strokeStyle = `${shape.color}${Math.floor(shape.opacity * 255).toString(16).padStart(2, '0')}`
      ctx.lineWidth = 2
      ctx.beginPath()

      switch (shape.type) {
        case 'triangle':
          ctx.moveTo(0, -shape.size)
          ctx.lineTo(-shape.size * 0.866, shape.size * 0.5)
          ctx.lineTo(shape.size * 0.866, shape.size * 0.5)
          ctx.closePath()
          break
        case 'square':
          ctx.rect(-shape.size / 2, -shape.size / 2, shape.size, shape.size)
          break
        case 'hexagon':
          for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3
            const x = Math.cos(angle) * shape.size
            const y = Math.sin(angle) * shape.size
            if (i === 0) ctx.moveTo(x, y)
            else ctx.lineTo(x, y)
          }
          ctx.closePath()
          break
        case 'circle':
          ctx.arc(0, 0, shape.size, 0, Math.PI * 2)
          break
      }

      ctx.stroke()
      ctx.restore()
    }

    const drawDataFlowParticles = () => {
      dataFlowParticles.forEach(particle => {
        particle.progress += particle.speed

        if (particle.progress >= 1) {
          particle.x = Math.random() * canvas.width
          particle.y = Math.random() * canvas.height
          particle.targetX = Math.random() * canvas.width
          particle.targetY = Math.random() * canvas.height
          particle.progress = 0
        }

        const currentX = particle.x + (particle.targetX - particle.x) * particle.progress
        const currentY = particle.y + (particle.targetY - particle.y) * particle.progress

        // Draw trail
        const trailLength = 5
        for (let i = 0; i < trailLength; i++) {
          const trailProgress = Math.max(0, particle.progress - i * 0.1)
          const trailX = particle.x + (particle.targetX - particle.x) * trailProgress
          const trailY = particle.y + (particle.targetY - particle.y) * trailProgress
          const trailOpacity = particle.opacity * (1 - i / trailLength) * 0.5

          ctx.beginPath()
          ctx.arc(trailX, trailY, particle.size * (1 - i / trailLength), 0, Math.PI * 2)
          ctx.fillStyle = `${particle.color}${Math.floor(trailOpacity * 255).toString(16).padStart(2, '0')}`
          ctx.fill()
        }

        // Draw main particle
        ctx.beginPath()
        ctx.arc(currentX, currentY, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `${particle.color}${Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')}`
        ctx.fill()

        // Add glow
        ctx.shadowBlur = 10
        ctx.shadowColor = particle.color
        ctx.fill()
        ctx.shadowBlur = 0
      })
    }

    const drawNodes = () => {
      // Update node positions with subtle drift
      nodes.forEach(node => {
        node.x += node.vx
        node.y += node.vy
        node.pulse += 0.03

        // Gentle boundaries
        if (node.x < -20 || node.x > canvas.width + 20) node.vx *= -1
        if (node.y < -20 || node.y > canvas.height + 20) node.vy *= -1

        // Subtle return to original position
        node.vx += (node.originalX - node.x) * 0.0001
        node.vy += (node.originalY - node.y) * 0.0001

        // Draw node
        const pulseSize = node.size + Math.sin(node.pulse) * 0.5
        const pulseOpacity = node.opacity + Math.sin(node.pulse) * 0.1

        ctx.beginPath()
        ctx.arc(node.x, node.y, pulseSize, 0, Math.PI * 2)
        ctx.fillStyle = `${node.color}${Math.floor(pulseOpacity * 255).toString(16).padStart(2, '0')}`
        ctx.fill()
      })

      // Draw connections
      nodes.forEach((node, i) => {
        nodes.slice(i + 1).forEach(otherNode => {
          const dx = node.x - otherNode.x
          const dy = node.y - otherNode.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            const opacity = (1 - distance / 150) * 0.1
            const gradient = ctx.createLinearGradient(node.x, node.y, otherNode.x, otherNode.y)
            gradient.addColorStop(0, `${node.color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`)
            gradient.addColorStop(1, `${otherNode.color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`)

            ctx.beginPath()
            ctx.moveTo(node.x, node.y)
            ctx.lineTo(otherNode.x, otherNode.y)
            ctx.strokeStyle = gradient
            ctx.lineWidth = 1
            ctx.stroke()
          }
        })
      })
    }

    const animate = () => {
      time += 1

      // Professional gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, '#0f172a')    // slate-900
      gradient.addColorStop(0.25, '#1e293b')  // slate-800
      gradient.addColorStop(0.5, '#334155')   // slate-700
      gradient.addColorStop(0.75, '#475569')  // slate-600
      gradient.addColorStop(1, '#64748b')     // slate-500

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Add subtle radial overlay
      const radialGradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
      )
      radialGradient.addColorStop(0, `rgba(59, 130, 246, ${0.05 + Math.sin(time * 0.01) * 0.02})`)
      radialGradient.addColorStop(1, 'rgba(30, 41, 59, 0.1)')

      ctx.fillStyle = radialGradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw all elements
      drawGrid()
      drawNodes()
      drawDataFlowParticles()

      // Update and draw geometric shapes
      geometricShapes.forEach(shape => {
        shape.x += shape.vx
        shape.y += shape.vy
        shape.rotation += shape.rotationSpeed

        // Boundary checks
        if (shape.x < -shape.size || shape.x > canvas.width + shape.size) shape.vx *= -1
        if (shape.y < -shape.size || shape.y > canvas.height + shape.size) shape.vy *= -1

        drawGeometricShape(shape)
      })

      animationId = requestAnimationFrame(animate)
    }

    resizeCanvas()
    animate()

    const handleResize = () => {
      resizeCanvas()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
      />
      {/* Additional professional CSS animations */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Subtle floating orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute top-1/3 right-20 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-float-reverse"></div>
        <div className="absolute bottom-20 left-1/4 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl animate-pulse-gentle"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-blue-500/3 to-purple-500/3 rounded-full blur-3xl animate-rotate-slow"></div>
      </div>
    </>
  )
}
// Loading spinner component with animated background styling
const LoadingSpinner = ({ message = "Loading..." }) => (
  <div className="min-h-[400px] flex items-center justify-center">
    <div className="text-center">
      {/* Animated Logo */}
      <div className="relative mb-8">
        <div className="absolute inset-0 animate-ping">
          <BookOpen className="w-16 h-16 text-blue-400 mx-auto opacity-75" />
        </div>
        <BookOpen className="w-16 h-16 text-blue-500 mx-auto relative z-10 animate-pulse" />
      </div>

      {/* Multi-layered spinner */}
      <div className="relative mb-6">
        {/* Outer ring */}
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-slate-600 mx-auto"></div>
        {/* Middle ring */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-blue-500 border-r-blue-400"></div>
        {/* Inner ring */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 animate-spin rounded-full h-12 w-12 border-3 border-transparent border-t-purple-500 border-l-purple-400" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        {/* Center dot */}
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
      </div>

      {/* Animated text */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-100 animate-pulse">{message}</h2>
        <div className="flex items-center justify-center space-x-1">
          <span className="text-slate-300">Please wait</span>
          <div className="flex space-x-1">
            <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-8 w-64 mx-auto">
        <div className="bg-slate-700 rounded-full h-2 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  </div>
)


export default function CreateClass() {
  const [formData, setFormData] = useState({
    name: '',
    whichClass: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [successData, setSuccessData] = useState<{ classId: string; inviteCode: string } | null>(null)

  const router = useRouter()



  const validateField = (field: string, value: string) => {
    try {
      if (field === 'name') {
        createClassSchema.shape.name.parse(value)
      } else if (field === 'whichClass') {
        createClassSchema.shape.whichClass.parse(value)
      }
      setErrors(prev => ({ ...prev, [field]: '' }))
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(prev => ({ ...prev, [field]: error.errors[0].message }))
      }
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    validateField(field, value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      createClassSchema.parse(formData)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {}
        error.errors.forEach(err => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message
          }
        })
        setErrors(fieldErrors)
        toast.error('Please fix the errors below')
        return
      }
    }

    setLoading(true)

    try {
      const response = await fetch('/api/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Class created successfully!')
        setSuccessData({
          classId: data.classId || data.id,
          inviteCode: data.inviteCode || data.code
        })

        setTimeout(() => {
          router.push(`/teacher/classes/${data.classId || data.id}`)
        }, 2000)
      } else {
        toast.error(data.error || 'Failed to create class')
      }
    } catch (error) {
      console.error('Error creating class:', error)
      toast.error('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const goToDashboard = () => {
    router.push('/teacher/dashboard')
  }

  if (loading) {
    return (
      <div className="min-h-screen relative">
        <ProfessionalAnimatedBackground />
        <LoadingSpinner message={loading ? "Creating your class..." : "Loading..."} />
      </div>
    )
  }

  // Success message component with fixed responsive header
  if (successData) {
    return (
      <div className="min-h-screen relative">
        <ProfessionalAnimatedBackground />

        {/* Fixed Responsive Header */}
        <header className="bg-slate-800/90 backdrop-blur-lg border-b border-slate-700/50 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-14 sm:h-16">
              {/* Logo and Title */}
              <div className="flex items-center gap-2 sm:gap-3">
                <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-slate-100">The Learning Tree</h1>
                  <p className="text-xs text-slate-400 hidden sm:block">Teacher Dashboard</p>
                </div>
              </div>

              {/* Dashboard Button */}
              <button
                onClick={goToDashboard}
                className="text-slate-300 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 hover:bg-slate-700/50"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </header>

        <div className="relative z-10 min-h-screen flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto w-full">
            <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-6 sm:p-8 text-center">
              <div className="mx-auto h-16 w-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h1 className="text-2xl font-bold text-white mb-4">Class Created Successfully!</h1>

              <div className="bg-slate-700/50 backdrop-blur-sm rounded-xl p-4 mb-6 border border-slate-600/30">
                <p className="text-sm text-slate-300 mb-2">Share this invite code with your students:</p>
                <div className="bg-slate-900/70 border-2 border-dashed border-blue-400/50 rounded-lg p-3">
                  <code className="text-lg font-mono font-bold text-blue-400">{successData.inviteCode}</code>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={goToDashboard}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                >
                  Go to Dashboard
                </button>

                <p className="text-sm text-slate-400">
                  Redirecting to your class page in a moment...
                </p>
              </div>
            </div>
          </div>
        </div>
        <style jsx>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

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

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(50px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(-40px) translateX(0);
          }
          75% {
            transform: translateY(-20px) translateX(-10px);
          }
        }

        @keyframes float-reverse {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(20px) translateX(-10px);
          }
          50% {
            transform: translateY(40px) translateX(0);
          }
          75% {
            transform: translateY(20px) translateX(10px);
          }
        }

        @keyframes pulse-gentle {
          0%, 100% {
            opacity: 0.05;
            transform: scale(1);
          }
          50% {
            opacity: 0.1;
            transform: scale(1.05);
          }
        }

        @keyframes rotate-slow {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }

        .animate-float-reverse {
          animation: float-reverse 10s ease-in-out infinite;
        }

        .animate-pulse-gentle {
          animation: pulse-gentle 6s ease-in-out infinite;
        }

        .animate-rotate-slow {
          animation: rotate-slow 20s linear infinite;
        }
      `}</style>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      <ProfessionalAnimatedBackground />

      {/* Fixed Responsive Header */}
      <header className="bg-slate-800/90 backdrop-blur-lg border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="flex justify-start items-center h-14 sm:h-16">
            {/* Logo and Title */}
            <div className="flex items-center gap-2 sm:gap-3">
              <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
              <div className="text-left">
                <h1 className="text-lg sm:text-xl font-bold text-slate-100 text-left">The Learning Tree</h1>
                <p className="text-xs text-slate-400 hidden sm:block text-left">Teacher Dashboard</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="relative z-10 min-h-screen py-8 px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="max-w-md mx-auto w-full">
          {/* Form Header */}
          <div className="text-center mb-8">

            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Create New Class</h1>
            <p className="text-slate-300">Set up a new class for your students</p>
          </div>

          {/* Form Card */}
          <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Class Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-slate-200 mb-2">
                  Class Name *
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-4 py-3 bg-slate-700/50 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200 text-white placeholder-slate-400 backdrop-blur-sm ${errors.name ? 'border-red-500 bg-red-900/20' : 'border-slate-600 hover:border-slate-500'
                    }`}
                  placeholder="e.g., English CBSE, English ICSE"
                  required
                  autoComplete="off"
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-400 flex items-center">
                    <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.name}
                  </p>
                )}
                <p className="mt-1 text-xs text-slate-400">
                  Include board name: ICSE, ISC, WBBSE, WBCHSE, or CBSE
                </p>
              </div>

              {/* Grade/Level Field */}
              <div>
                <label htmlFor="whichClass" className="block text-sm font-semibold text-slate-200 mb-2">
                  Grade/Level *
                </label>
                <input
                  id="whichClass"
                  type="number"
                  min="1"
                  max="12"
                  value={formData.whichClass}
                  onChange={(e) => handleInputChange('whichClass', e.target.value)}
                  className={`w-full px-4 py-3 bg-slate-700/50 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200 text-white placeholder-slate-400 backdrop-blur-sm ${errors.whichClass ? 'border-red-500 bg-red-900/20' : 'border-slate-600 hover:border-slate-500'
                    }`}
                  placeholder="Enter grade number (1-12)"
                  required
                  autoComplete="off"
                />
                {errors.whichClass && (
                  <p className="mt-2 text-sm text-red-400 flex items-center">
                    <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.whichClass}
                  </p>
                )}
                <p className="mt-1 text-xs text-slate-400">
                  Enter a number between 1 and 12
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={Object.values(errors).some(error => error !== '')}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-xl font-semibold text-sm uppercase tracking-wide shadow-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Create Class
                </button>

                <button
                  type="button"
                  onClick={goToDashboard}
                  className="w-full bg-slate-700/50 backdrop-blur-sm text-slate-200 py-3 px-4 rounded-xl font-semibold text-sm hover:bg-slate-600/50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all duration-200 border border-slate-600/50 hover:border-slate-500/50"
                >
                  Go to Dashboard
                </button>
              </div>
            </form>

            {/* Additional Info */}
            <div className="mt-6 p-4 bg-blue-900/20 backdrop-blur-sm rounded-xl border border-blue-500/20">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-blue-400 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="text-sm font-semibold text-blue-300 mb-1">Quick Guide : </h3>
                  <p className="text-sm text-blue-200">
                    After creating the class, you will receive an invite code that students can use to join your class.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

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

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(50px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(-40px) translateX(0);
          }
          75% {
            transform: translateY(-20px) translateX(-10px);
          }
        }

        @keyframes float-reverse {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(20px) translateX(-10px);
          }
          50% {
            transform: translateY(40px) translateX(0);
          }
          75% {
            transform: translateY(20px) translateX(10px);
          }
        }

        @keyframes pulse-gentle {
          0%, 100% {
            opacity: 0.05;
            transform: scale(1);
          }
          50% {
            opacity: 0.1;
            transform: scale(1.05);
          }
        }

        @keyframes rotate-slow {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }

        .animate-float-reverse {
          animation: float-reverse 10s ease-in-out infinite;
        }

        .animate-pulse-gentle {
          animation: pulse-gentle 6s ease-in-out infinite;
        }

        .animate-rotate-slow {
          animation: rotate-slow 20s linear infinite;
        }
      `}</style>
    </div>
  )
}