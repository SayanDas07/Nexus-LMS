'use client'
import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Plus, Trash2, Save, ArrowLeft, FileText, HelpCircle, Clock, Hash, BookOpen } from 'lucide-react'


interface MCQQuestion {
  question: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  correctOption: string
}

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

export default function CreateAssignmentPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [assignmentType, setAssignmentType] = useState<'DRIVE' | 'MCQ'>('DRIVE')

  // Form data
  const [title, setTitle] = useState('')
  const [deadline, setDeadline] = useState('')
  const [totalMarks, setTotalMarks] = useState('')
  const [driveLink, setDriveLink] = useState('')
  const [mcqQuestions, setMcqQuestions] = useState<MCQQuestion[]>([])

  const addMCQQuestion = () => {
    setMcqQuestions([...mcqQuestions, {
      question: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctOption: 'A'
    }])
  }

  const updateMCQQuestion = (index: number, field: keyof MCQQuestion, value: string) => {
    const updated = [...mcqQuestions]
    updated[index] = { ...updated[index], [field]: value }
    setMcqQuestions(updated)
  }

  const removeMCQQuestion = (index: number) => {
    setMcqQuestions(mcqQuestions.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    setLoading(true)

    try {
      const response = await fetch(`/api/classes/${params.classId}/assignments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          deadline,
          totalMarks,
          type: assignmentType,
          driveLink: assignmentType === 'DRIVE' ? driveLink : null,
          mcqQuestions: assignmentType === 'MCQ' ? mcqQuestions : [],
        })
      })

      if (response.ok) {
        router.push(`/teacher/classes/${params.classId}`)
      } else {
        alert('Failed to create assignment')
      }
    } catch (error) {
      console.error('Error creating assignment:', error)
      alert('Error creating assignment')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      <ProfessionalAnimatedBackground />
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo and Title */}
            <div className="flex items-center gap-2 sm:gap-3">
              <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 drop-shadow-lg" />
              <div className="text-left">
                <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-slate-100 to-blue-200 bg-clip-text text-transparent">
                  The Learning Tree
                </h1>
               
              </div>
            </div>

            {/* Back Button */}
            <button
              onClick={() => router.push(`/teacher/classes/${params.classId}`)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-3 py-2 rounded-lg text-sm transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Class</span>
            </button>
          </div>
        </div>
      </header>

      {/* Page Header */}
      <div className="bg-slate-800/60 backdrop-blur-lg border-b border-slate-700/50 relative z-10 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-400 drop-shadow-lg" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-100 to-blue-200 bg-clip-text text-transparent">
                Create Assignment
              </h1>
              <p className="text-slate-300 mt-1 font-medium">Create assignments and assessments for your students</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        <div className="space-y-6">
          {/* Basic Information Card */}
          <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50">
            <div className="p-6 sm:p-8">
              <h2 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                Basic Information
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-3">
                    Assignment Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700/50 backdrop-blur-lg border border-slate-600/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 text-slate-100 placeholder-slate-400 font-medium shadow-lg transition-all duration-200"
                    placeholder="Enter assignment title..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-1">
                      <Clock className="w-4 h-4 text-blue-400" />
                      <span>Deadline <span className="text-red-400">*</span></span>
                    </label>
                    <input
                      type="datetime-local"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-700/50 backdrop-blur-lg border border-slate-600/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 text-slate-100 placeholder-slate-400 font-medium shadow-lg transition-all duration-200"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-1">
                      <Hash className="w-4 h-4 text-blue-400" />
                      <span>Total Marks <span className="text-red-400">*</span></span>
                    </label>
                    <input
                      type="number"
                      value={totalMarks}
                      onChange={(e) => setTotalMarks(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-700/50 backdrop-blur-lg border border-slate-600/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 text-slate-100 placeholder-slate-400 font-medium shadow-lg transition-all duration-200"
                      placeholder="Enter total marks..."
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Assignment Type Card */}
          <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50">
            <div className="p-6 sm:p-8">
              <h2 className="text-xl font-bold text-slate-100 mb-6 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-400" />
                Assignment Type
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className={`relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${assignmentType === 'DRIVE'
                    ? 'border-blue-500/70 bg-blue-500/10 backdrop-blur-lg'
                    : 'border-slate-600/50 bg-slate-700/30 backdrop-blur-lg hover:border-slate-500/70'
                  }`}>
                  <input
                    type="radio"
                    value="DRIVE"
                    checked={assignmentType === 'DRIVE'}
                    onChange={(e) => setAssignmentType(e.target.value as 'DRIVE')}
                    className="sr-only"
                  />
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${assignmentType === 'DRIVE'
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-slate-400'
                      }`}>
                      {assignmentType === 'DRIVE' && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-100">Drive Link</div>
                      <div className="text-sm text-slate-300">Upload files via Google Drive</div>
                    </div>
                  </div>
                </label>

                <label className={`relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${assignmentType === 'MCQ'
                    ? 'border-blue-500/70 bg-blue-500/10 backdrop-blur-lg'
                    : 'border-slate-600/50 bg-slate-700/30 backdrop-blur-lg hover:border-slate-500/70'
                  }`}>
                  <input
                    type="radio"
                    value="MCQ"
                    checked={assignmentType === 'MCQ'}
                    onChange={(e) => setAssignmentType(e.target.value as 'MCQ')}
                    className="sr-only"
                  />
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${assignmentType === 'MCQ'
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-slate-400'
                      }`}>
                      {assignmentType === 'MCQ' && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-100">MCQ Test</div>
                      <div className="text-sm text-slate-300">Create multiple choice questions</div>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Drive Link Section */}
          {assignmentType === 'DRIVE' && (
            <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50">
              <div className="p-6 sm:p-8">
                <h2 className="text-xl font-bold text-slate-100 mb-6">Drive Link Details</h2>

                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-3">
                    Google Drive Link <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="url"
                    value={driveLink}
                    onChange={(e) => setDriveLink(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700/50 backdrop-blur-lg border border-slate-600/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 text-slate-100 placeholder-slate-400 font-medium shadow-lg transition-all duration-200"
                    placeholder="https://drive.google.com/..."
                    required
                  />
                  <p className="text-sm text-slate-400 mt-2 font-medium">
                    Make sure the link is accessible to students with viewing permissions.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* MCQ Section */}
          {assignmentType === 'MCQ' && (
            <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50">
              <div className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 mb-6">
                  <h2 className="text-xl font-bold text-slate-100">MCQ Questions</h2>
                  <button
                    type="button"
                    onClick={addMCQQuestion}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Add Question
                  </button>
                </div>

                {mcqQuestions.length === 0 ? (
                  <div className="text-center py-12 bg-slate-700/30 backdrop-blur-lg rounded-xl border border-slate-600/50">
                    <HelpCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-200 mb-2">No questions added yet</h3>
                    <p className="text-slate-400 font-medium">Click &quot;Add Question&quot; to start creating your MCQ test.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {mcqQuestions.map((question, index) => (
                      <div key={index} className="bg-slate-700/30 backdrop-blur-lg rounded-xl border border-slate-600/50 overflow-hidden">
                        <div className="bg-slate-800/50 px-4 py-3 flex items-center justify-between">
                          <h4 className="font-semibold text-slate-100">Question {index + 1}</h4>
                          <button
                            type="button"
                            onClick={() => removeMCQQuestion(index)}
                            className="inline-flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors duration-200 font-medium"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="hidden sm:inline">Remove</span>
                          </button>
                        </div>

                        <div className="p-4 space-y-4">
                          <div>
                            <label className="block text-sm font-semibold text-slate-200 mb-2">
                              Question Text <span className="text-red-400">*</span>
                            </label>
                            <textarea
                              value={question.question}
                              onChange={(e) => updateMCQQuestion(index, 'question', e.target.value)}
                              className="w-full px-4 py-3 bg-slate-700/50 backdrop-blur-lg border border-slate-600/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 text-slate-100 placeholder-slate-400 font-medium shadow-lg transition-all duration-200"
                              rows={3}
                              placeholder="Enter your question here..."
                              required
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {['A', 'B', 'C', 'D'].map((option) => (
                              <div key={option}>
                                <label className="block text-sm font-semibold text-slate-200 mb-2">
                                  Option {option} <span className="text-red-400">*</span>
                                </label>
                                <input
                                  type="text"
                                  value={question[`option${option}` as keyof MCQQuestion]}
                                  onChange={(e) => updateMCQQuestion(index, `option${option}` as keyof MCQQuestion, e.target.value)}
                                  className="w-full px-4 py-3 bg-slate-700/50 backdrop-blur-lg border border-slate-600/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 text-slate-100 placeholder-slate-400 font-medium shadow-lg transition-all duration-200"
                                  placeholder={`Enter option ${option}...`}
                                  required
                                />
                              </div>
                            ))}
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-slate-200 mb-2">
                              Correct Answer <span className="text-red-400">*</span>
                            </label>
                            <select
                              value={question.correctOption}
                              onChange={(e) => updateMCQQuestion(index, 'correctOption', e.target.value)}
                              className="w-full px-4 py-3 bg-slate-700/50 backdrop-blur-lg border border-slate-600/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 text-slate-100 font-medium shadow-lg transition-all duration-200"
                            >
                              <option value="A">Option A</option>
                              <option value="B">Option B</option>
                              <option value="C">Option C</option>
                              <option value="D">Option D</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Submit Actions */}
          <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 sm:flex-none px-6 py-3 border border-slate-600/50 text-slate-300 font-semibold rounded-xl bg-slate-700/30 hover:bg-slate-700/50 backdrop-blur-lg transition-all duration-200 shadow-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                {loading ? 'Creating...' : 'Create Assignment'}
              </button>
            </div>
          </div>

          {/* Help Section */}
          <div className="bg-blue-500/10 backdrop-blur-lg border border-blue-400/30 rounded-xl p-4">
            <h3 className="font-semibold text-blue-200 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Assignment Guidelines
            </h3>
            <ul className="text-blue-100 text-sm space-y-1 font-medium">
              <li>• Choose a clear and descriptive title for your assignment</li>
              <li>• Set appropriate deadlines and total marks</li>
              <li>• For Drive assignments, ensure links are accessible to students</li>
              <li>• For MCQ tests, create clear questions with distinct options</li>
              <li>• Review all questions before submitting</li>
            </ul>
          </div>
        </div>
      </main>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 flex items-center justify-center">
          <LoadingSpinner message="Creating assignment..." />
        </div>
      )}
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