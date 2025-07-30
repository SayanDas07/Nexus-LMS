/* eslint-disable @typescript-eslint/no-explicit-any */
// teacher/classes/[classId]/assignments/[assignmentId]/page.tsx
'use client'
import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { BookOpen, ArrowLeft, FileText } from 'lucide-react'
import { toast, Toaster } from 'sonner'

interface Assignment {
  id: string
  title: string
  deadline: string
  totalMarks: number
  type: 'DRIVE' | 'MCQ'
  driveLink?: string
  status: string
  teacher: { name: string }
  classId: { name: string }
  mcqQuestions: any[]
  submittedAssignments: any[]
}

interface Submission {
  id: string
  studentId: string
  submissionLink?: string
  selectedOptions: string[]
  grade?: string
  marksObtained?: number
  createdAt: string
  student: {
    name: string
    email: string
  }
  assignment: {
    type: string
    totalMarks: number
    mcqQuestions: any[]
  }
}

interface MCQQuestion {
  id?: string
  question: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  correctOption: string
}

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

export default function AssignmentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [assignment, setAssignment] = useState<Assignment | null>(null)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [activeTab, setActiveTab] = useState('details')
  const [loading, setLoading] = useState(true)
  const [gradingStudent, setGradingStudent] = useState<string | null>(null)
  const [gradeMarks, setGradeMarks] = useState('')
  const [tabLoading, setTabLoading] = useState(false)

  // Edit mode states
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editDeadline, setEditDeadline] = useState('')
  const [editTotalMarks, setEditTotalMarks] = useState('')
  const [editType, setEditType] = useState<'DRIVE' | 'MCQ'>('DRIVE')
  const [editDriveLink, setEditDriveLink] = useState('')
  const [editMcqQuestions, setEditMcqQuestions] = useState<MCQQuestion[]>([])
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchAssignmentData()
    fetchSubmissions()
  }, [params.assignmentId])

  const fetchAssignmentData = async () => {
    try {
      const response = await fetch(`/api/classes/${params.classId}/assignments/${params.assignmentId}`)
      const data = await response.json()
      setAssignment(data)
      setEditTitle(data.title)
      setEditDeadline(data.deadline)
      setEditTotalMarks(data.totalMarks.toString())
      setEditType(data.type)
      setEditDriveLink(data.driveLink || '')
      setEditMcqQuestions(data.mcqQuestions || [])
    } catch (error) {
      console.error('Failed to fetch assignment:', error)
      toast.error('Failed to load assignment data')
    }
  }

  const fetchSubmissions = async () => {
    try {
      const response = await fetch(`/api/classes/${params.classId}/assignments/${params.assignmentId}/submissions`)
      const data = await response.json()
      setSubmissions(data)
    } catch (error) {
      console.error('Failed to fetch submissions:', error)
      toast.error('Failed to load submissions')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
    setActiveTab('details')
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    if (assignment) {
      setEditTitle(assignment.title)
      setEditDeadline(assignment.deadline)
      setEditTotalMarks(assignment.totalMarks.toString())
      setEditType(assignment.type)
      setEditDriveLink(assignment.driveLink || '')
      setEditMcqQuestions(assignment.mcqQuestions || [])
    }
  }

  const handleSaveEdit = async () => {
    setUpdating(true)
    try {
      const response = await fetch(`/api/classes/${params.classId}/assignments/${params.assignmentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTitle,
          deadline: editDeadline,
          totalMarks: parseInt(editTotalMarks),
          type: editType,
          driveLink: editType === 'DRIVE' ? editDriveLink : null,
          mcqQuestions: editType === 'MCQ' ? editMcqQuestions : []
        })
      })

      if (response.ok) {
        setIsEditing(false)
        fetchAssignmentData()
        toast.success('Assignment updated successfully!')
      } else {
        toast.error('Failed to update assignment')
      }
    } catch {
      toast.error('Error updating assignment')
    } finally {
      setUpdating(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this assignment?')) return

    try {
      const response = await fetch(`/api/classes/${params.classId}/assignments/${params.assignmentId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        router.push(`/teacher/classes/${params.classId}`)
        toast.success('Assignment deleted successfully')
      } else {
        toast.error('Failed to delete assignment')
      }
    } catch (error) {
      console.error('Error deleting assignment:', error)
      toast.error('Error deleting assignment')
    }
  }

  const handleGradeSubmission = async (studentId: string) => {
    const marks = parseInt(gradeMarks)
    if (isNaN(marks) || marks < 0 || (assignment && marks > assignment.totalMarks)) {
      toast.error(`Marks must be between 0 and ${assignment?.totalMarks}`)
      return
    }

    try {
      const response = await fetch(`/api/classes/${params.classId}/assignments/${params.assignmentId}/grade`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          marksObtained: marks
        })
      })

      if (response.ok) {
        setGradingStudent(null)
        setGradeMarks('')
        fetchSubmissions()
        toast.success('Submission graded successfully')
      } else {
        toast.error('Failed to grade submission')
      }
    } catch (error) {
      console.error('Error grading submission:', error)
      toast.error('Error grading submission')
    }
  }

  const handleEditGrade = (studentId: string, currentMarks: number | null) => {
    setGradingStudent(studentId)
    setGradeMarks(currentMarks?.toString() || '')
  }

  const calculateMCQMarks = (selectedOptions: string[], mcqQuestions: any[]): number => {
    let correct = 0
    selectedOptions.forEach((selected, index) => {
      if (mcqQuestions[index] && selected === mcqQuestions[index].correctOption) {
        correct++
      }
    })
    return Math.round((correct / mcqQuestions.length) * (assignment?.totalMarks || 0))
  }

  const addMCQQuestion = () => {
    setEditMcqQuestions([...editMcqQuestions, {
      question: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctOption: 'A'
    }])
  }

  const updateMCQQuestion = (index: number, field: keyof MCQQuestion, value: string) => {
    const updated = [...editMcqQuestions]
    updated[index] = { ...updated[index], [field]: value }
    setEditMcqQuestions(updated)
  }

  const removeMCQQuestion = (index: number) => {
    setEditMcqQuestions(editMcqQuestions.filter((_, i) => i !== index))
  }

  const handleTabSwitch = (tabId: string) => {
    if (tabId === activeTab || (isEditing && tabId !== 'details')) return
    setTabLoading(true)
    setTimeout(() => {
      setActiveTab(tabId)
      setTabLoading(false)
    }, 300)
  }

  const tabs = [
    { id: 'details', name: 'Details', icon: FileText },
    { id: 'submissions', name: 'Submissions', icon: FileText }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <ProfessionalAnimatedBackground />
        <header className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-50 shadow-2xl">
          <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-14 sm:h-16">
              <div className="flex items-center gap-2 sm:gap-3">
                <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 drop-shadow-lg" />
                <div className="text-left">
                  <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-slate-100 to-blue-200 bg-clip-text text-transparent">
                    The Learning Tree
                  </h1>
                  <p className="text-xs text-slate-400 hidden sm:block font-medium">Teacher Dashboard</p>
                </div>
              </div>
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
        <div className="relative z-10">
          <LoadingSpinner message="Loading assignment data..." />
        </div>
      </div>
    )
  }

  if (!assignment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <ProfessionalAnimatedBackground />
        <header className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-50 shadow-2xl">
          <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-14 sm:h-16">
              <div className="flex items-center gap-2 sm:gap-3">
                <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 drop-shadow-lg" />
                <div className="text-left">
                  <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-slate-100 to-blue-200 bg-clip-text text-transparent">
                    The Learning Tree
                  </h1>
                  <p className="text-xs text-slate-400 hidden sm:block font-medium">Teacher Dashboard</p>
                </div>
              </div>
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
        <div className="flex justify-center items-center h-64 relative z-10">
          <div className="text-lg font-semibold text-slate-200">Assignment not found</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pb-16 md:pb-0 relative overflow-hidden">
      <ProfessionalAnimatedBackground />
      <header className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-3">
              <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 drop-shadow-lg" />
              <div className="text-left">
                <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-slate-100 to-blue-200 bg-clip-text text-transparent">
                  The Learning Tree
                </h1>

              </div>
            </div>
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

      <div className="bg-slate-800/60 backdrop-blur-lg border-b border-slate-700/50 relative z-10 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-100 to-blue-200 bg-clip-text text-transparent">
                {assignment.title}
              </h1>

              <p className="text-sm text-slate-400 font-medium">
                Due: {new Date(assignment.deadline).toLocaleString()}
              </p>
            </div>
            <div className="flex space-x-3 mt-3 sm:mt-0">
              {!isEditing ? (
                <>
                  <button
                    onClick={handleEdit}
                    className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-semibold rounded-xl shadow-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
                  >
                    Edit Assignment
                  </button>
                  <button
                    onClick={handleDelete}
                    className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-semibold rounded-xl shadow-lg text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transition-all duration-200"
                  >
                    Delete Assignment
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleSaveEdit}
                    disabled={updating}
                    className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-semibold rounded-xl shadow-lg text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 transition-all duration-200 disabled:opacity-50"
                  >
                    {updating ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-semibold rounded-xl shadow-lg text-white bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 transition-all duration-200"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/40 backdrop-blur-lg border-b border-slate-700/50 hidden md:block relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabSwitch(tab.id)}
                  disabled={isEditing && tab.id !== 'details'}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-semibold text-sm whitespace-nowrap transition-all duration-200 ${activeTab === tab.id
                      ? 'border-blue-400 text-blue-300 shadow-lg'
                      : isEditing && tab.id !== 'details'
                        ? 'border-transparent text-slate-400 opacity-50 cursor-not-allowed'
                        : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.name}
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        {tabLoading && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 flex items-center justify-center">
            <LoadingSpinner message="Switching tab..." />
          </div>
        )}

        <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50">
          {activeTab === 'details' && (
            <div className="p-6">
              {isEditing ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="border border-slate-600/50 bg-slate-700/30 backdrop-blur-lg rounded-xl p-4">
                      <h3 className="font-semibold text-lg text-slate-100 mb-4">Edit Assignment</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-1">Title</label>
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="w-full pl-4 pr-4 py-3 bg-slate-800/60 backdrop-blur-lg border border-slate-600/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 text-slate-100 placeholder-slate-400 font-medium shadow-lg transition-all duration-200"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-1">Deadline</label>
                          <input
                            type="datetime-local"
                            value={editDeadline}
                            onChange={(e) => setEditDeadline(e.target.value)}
                            className="w-full pl-4 pr-4 py-3 bg-slate-800/60 backdrop-blur-lg border border-slate-600/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 text-slate-100 placeholder-slate-400 font-medium shadow-lg transition-all duration-200"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-1">Total Marks</label>
                          <input
                            type="number"
                            value={editTotalMarks}
                            onChange={(e) => setEditTotalMarks(e.target.value)}
                            className="w-full pl-4 pr-4 py-3 bg-slate-800/60 backdrop-blur-lg border border-slate-600/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 text-slate-100 placeholder-slate-400 font-medium shadow-lg transition-all duration-200"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-1">Type</label>
                          <select
                            value={editType}
                            onChange={(e) => setEditType(e.target.value as 'DRIVE' | 'MCQ')}
                            className="w-full pl-4 pr-4 py-3 bg-slate-800/60 backdrop-blur-lg border border-slate-600/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 text-slate-100 font-medium shadow-lg"
                          >
                            <option value="DRIVE">Drive Link</option>
                            <option value="MCQ">MCQ</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="border border-slate-600/50 bg-slate-700/30 backdrop-blur-lg rounded-xl p-4">
                      <h3 className="font-semibold text-lg text-slate-100 mb-2">Teacher</h3>
                      <p className="text-slate-300 font-medium">{assignment.teacher.name}</p>
                    </div>
                  </div>

                  {editType === 'DRIVE' && (
                    <div className="border border-slate-600/50 bg-slate-700/30 backdrop-blur-lg rounded-xl p-4">
                      <h3 className="font-semibold text-lg text-slate-100 mb-2">Drive Link</h3>
                      <input
                        type="url"
                        value={editDriveLink}
                        onChange={(e) => setEditDriveLink(e.target.value)}
                        placeholder="https://drive.google.com/..."
                        className="w-full pl-4 pr-4 py-3 bg-slate-800/60 backdrop-blur-lg border border-gray-600/20 rounded-lg text-gray-50 placeholder-gray-400 focus:ring"
                      />
                    </div>
                  )}

                  {editType === 'MCQ' && (
                    <div className="border border-slate-600/50 bg-slate-700/30 backdrop-blur-lg rounded-xl p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-lg text-slate-100">MCQ Questions</h3>
                        <button
                          onClick={addMCQQuestion}
                          className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-semibold rounded-xl shadow-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
                        >
                          Add Question
                        </button>
                      </div>
                      <div className="space-y-4">
                        {editMcqQuestions.map((question, index) => (
                          <div key={index} className="border-l-4 border-blue-400/30 pl-4 py-2">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium text-slate-100">Question {index + 1}</h4>
                              <button
                                onClick={() => removeMCQQuestion(index)}
                                className="text-red-400 text-sm font-semibold hover:text-red-300 transition-colors"
                              >
                                Remove
                              </button>
                            </div>
                            <div className="space-y-2">
                              <input
                                type="text"
                                value={question.question}
                                onChange={(e) => updateMCQQuestion(index, 'question', e.target.value)}
                                placeholder="Enter question"
                                className="w-full px-2 py-1 bg-slate-800/60 backdrop-blur-lg border border-slate-600/50 rounded-xl text-sm text-slate-100 placeholder-gray-400 font-medium"
                              />
                              <div className="grid grid-cols-2 gap-2">
                                <input
                                  type="text"
                                  value={question.optionA}
                                  onChange={(e) => updateMCQQuestion(index, 'optionA', e.target.value)}
                                  placeholder="Option A"
                                  className="px-2 py-1 bg-gray-800 bg-opacity-50 border border-gray-600 rounded-md text-gray-50 text-sm sm:text-base"
                                />
                                <input
                                  type="text"
                                  value={question.optionB}
                                  onChange={(e) => updateMCQQuestion(index, 'optionB', e.target.value)}
                                  placeholder="Option B"
                                  className="px-2 py-1 bg-gray-800 bg-opacity-50 border border-gray-600 rounded-md text-gray-50 text-sm sm:text-base"
                                />
                                <input
                                  type="text"
                                  value={question.optionC}
                                  onChange={(e) => updateMCQQuestion(index, 'optionC', e.target.value)}
                                  placeholder="Option C"
                                  className="px-2 py-1 bg-gray-800 bg-opacity-50 border border-gray-600 rounded-md text-gray-50 text-sm sm:text-base"
                                />
                                <input
                                  type="text"
                                  value={question.optionD}
                                  onChange={(e) => updateMCQQuestion(index, 'optionD', e.target.value)}
                                  placeholder="Option D"
                                  className="px-2 py-1 bg-gray-800 bg-opacity-50 border border-gray-600 rounded-md text-gray-50 text-sm sm:text-base"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-slate-300 mb-1">Correct Answer:</label>
                                <select
                                  value={question.correctOption}
                                  onChange={(e) => updateMCQQuestion(index, 'correctOption', e.target.value)}
                                  className="px-2 py-1 bg-slate-700 bg-opacity-50 border border-gray-600 rounded-md text-gray-50 text-sm sm:text-sm"
                                >
                                  <option value="A">A</option>
                                  <option value="B">B</option>
                                  <option value="C">C</option>
                                  <option value="D">D</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="border border-slate-600/50 bg-slate-700/30 backdrop-blur-lg rounded-xl p-4">
                      <h3 className="font-semibold text-lg text-slate-100 mb-2">Assignment Info</h3>
                      <p className="text-slate-300 font-medium">Type: {assignment.type}</p>
                      <p className="text-slate-300 font-medium">Total Marks: {assignment.totalMarks}</p>
                      <p className="text-slate-300 font-medium">Status: {assignment.status}</p>
                      <p className="text-slate-300 font-medium">Submissions: {assignment.submittedAssignments.length}</p>
                    </div>
                    <div className="border border-slate-600/50 bg-slate-700/30 backdrop-blur-lg rounded-xl p-4">
                      <h3 className="font-semibold text-lg text-slate-100 mb-2">Teacher</h3>
                      <p className="text-slate-300 font-medium">{assignment.teacher.name}</p>
                    </div>
                  </div>

                  {assignment.type === 'DRIVE' && assignment.driveLink && (
                    <div className="border border-slate-600/50 bg-slate-700/30 backdrop-blur-lg rounded-xl p-4">
                      <h3 className="font-semibold text-lg text-slate-100 mb-2">Drive Link</h3>
                      <a
                        href={assignment.driveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 font-medium"
                      >
                        {assignment.driveLink}
                      </a>
                    </div>
                  )}

                  {assignment.type === 'MCQ' && assignment.mcqQuestions.length > 0 && (
                    <div className="border border-slate-600/50 bg-slate-700/30 backdrop-blur-lg rounded-xl p-4">
                      <h3 className="font-semibold text-lg text-slate-100 mb-4">MCQ Questions ({assignment.mcqQuestions.length})</h3>
                      <div className="space-y-4">
                        {assignment.mcqQuestions.map((question, index) => (
                          <div key={question.id} className="border-l-4 border-blue-400/30 pl-4">
                            <h4 className="font-medium text-slate-100 mb-2">Q{index + 1}: {question.question}</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm text-slate-300">
                              <p className={question.correctOption === 'A' ? 'font-bold text-green-400' : ''}>
                                A) {question.optionA}
                              </p>
                              <p className={question.correctOption === 'B' ? 'font-bold text-green-400' : ''}>
                                B) {question.optionB}
                              </p>
                              <p className={question.correctOption === 'C' ? 'font-bold text-green-400' : ''}>
                                C) {question.optionC}
                              </p>
                              <p className={question.correctOption === 'D' ? 'font-bold text-green-400' : ''}>
                                D) {question.optionD}
                              </p>
                            </div>
                            <p className="text-xs text-green-400 font-medium mt-2">Correct Answer: {question.correctOption}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'submissions' && (
            <div className="p-6">
              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-400/30 rounded-xl p-4 mb-6 backdrop-blur-sm">
                <h3 className="font-bold text-blue-200 mb-2">Submission Statistics</h3>
                <p className="text-blue-100 font-medium">Total Submissions: {submissions.length}</p>
              </div>

              {submissions.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-slate-400" />
                  <h3 className="mt-2 text-sm font-semibold text-slate-200">No submissions</h3>
                  <p className="mt-1 text-sm text-slate-400">No students have submitted yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {submissions.map((submission) => (
                    <div
                      key={submission.id}
                      className="border border-slate-600/50 bg-slate-700/30 backdrop-blur-lg rounded-xl p-4 hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-slate-100">{submission.student.name}</h3>
                          <p className="text-sm text-slate-300 font-medium">{submission.student.email}</p>
                          <p className="text-xs text-slate-400 font-medium">
                            Submitted: {new Date(submission.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-sm text-slate-300 font-medium">
                          {assignment.type === 'MCQ' ? (
                            <div>
                              <p className="font-semibold">
                                Score: {calculateMCQMarks(submission.selectedOptions, assignment.mcqQuestions)}/{assignment.totalMarks}
                              </p>
                              {submission.grade && (
                                <p className="text-sm text-slate-400">Grade: {submission.grade}</p>
                              )}
                            </div>
                          ) : (
                            <div>
                              {submission.marksObtained !== null ? (
                                <div>
                                  {gradingStudent === submission.studentId ? (
                                    <div className="flex items-center space-x-2">
                                      <input
                                        type="number"
                                        value={gradeMarks}
                                        onChange={(e) => setGradeMarks(e.target.value)}
                                        placeholder="Marks"
                                        className="w-20 pl-4 pr-4 py-2 bg-slate-800/60 backdrop-blur-lg border border-slate-600/50 rounded-xl text-center text-sm text-slate-100 placeholder-slate-400 font-semibold"
                                        min="0"
                                        max={assignment.totalMarks}
                                      />
                                      <button
                                        onClick={() => handleGradeSubmission(submission.studentId)}
                                        className="inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm font-semibold rounded-xl shadow-sm text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 transition-all duration-300"
                                      >
                                        Save
                                      </button>
                                      <button
                                        onClick={() => setGradingStudent(null)}
                                        className="inline-flex justify-center items-center px-3 py-2 border border-gray-600/20 text-sm border text-sm font-semibold rounded shadow-sm text-gray-50 bg-gradient-to-b from-gray-700 to-gray-800 hover:bg-gray-200 hover:text-gray-900 transition-all duration-150"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="flex items-center space-x-2">
                                      <p className="font-semibold">
                                        Score: {submission.marksObtained}/{assignment.totalMarks}
                                      </p>
                                      <button
                                        onClick={() => handleEditGrade(submission.studentId, submission.marksObtained ?? null)}
                                        className="inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm font-semibold rounded-xl shadow-sm text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
                                      >
                                        Edit Grade
                                      </button>
                                    </div>
                                  )}
                                  {submission.grade && (
                                    <p className="text-sm text-slate-400">Grade: {submission.grade}</p>
                                  )}
                                </div>
                              ) : (
                                <div>
                                  {gradingStudent === submission.studentId ? (
                                    <div className="flex items-center space-x-2">
                                      <input
                                        type="number"
                                        value={gradeMarks}
                                        onChange={(e) => setGradeMarks(e.target.value)}
                                        placeholder="Marks"
                                        className="w-20 pl-4 pr-4 py-2 bg-slate-800/60 backdrop-blur-lg border border-slate-600/50 rounded-xl text-center text-sm text-slate-100 placeholder-gray-400 font-semibold"
                                        min="0"
                                        max={assignment.totalMarks}
                                      />
                                      <button
                                        onClick={() => handleGradeSubmission(submission.studentId)}
                                        className="inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm font-semibold rounded-lg shadow-sm text-gray-50 bg-gradient-to-b from-green-600 to dark-green-700 hover:bg-green-200 hover:text-green-900 transition-all duration-200"
                                      >
                                        Save
                                      </button>
                                      <button
                                        onClick={() => setGradingStudent(null)}
                                        className="inline-flex justify-center items-center px-3 py-2 border border-gray-600/20 text-sm border text-sm font-semibold rounded shadow-sm text-gray-50 bg-gradient-to-b from-blue-400 to-blue-50 hover:bg-gray-200 hover:text-gray-900 transition-all duration-150"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => setGradingStudent(submission.studentId)}
                                      className="inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-semibold rounded-lg shadow-sm text-gray-50 bg-blue-600 hover:bg-blue-700 transition-all duration-200"
                                    >
                                      Grade
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {assignment.type === 'DRIVE' && submission.submissionLink && (
                        <div className="mt-4 p-4 bg-gray-600 bg-opacity-20 backdrop-blur rounded-lg">
                          <p className="text-sm font-medium text-gray-400 mb-2">Submission Link:</p>
                          <a
                            href={submission.submissionLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 font-medium"
                          >
                            {submission.submissionLink}
                          </a>
                        </div>
                      )}

                      {assignment.type === 'MCQ' && (
                        <div className="mt-4 bg-gray-600 bg-opacity-20 backdrop-blur rounded-lg p-4">
                          <p className="text-sm font-medium text-gray-400 mb-2">Selected Answers:</p>
                          <div className="space-y-2">
                            {submission.selectedOptions.map((selected, index) => (
                              <div key={index} className="flex items-center space-x-2 text-sm text-gray-300">
                                <span className="font-medium">Q{index + 1}: </span>
                                <span className={
                                  selected === assignment.mcqQuestions[index]?.correctOption
                                    ? 'text-green-400 font-semibold'
                                    : 'text-red-400'
                                }>
                                  {selected}
                                </span>
                                {selected === assignment.mcqQuestions[index]?.correctOption ? (
                                  <span className="text-green-400">✓</span>
                                ) : (
                                  <span className="text-red-400">✗ (Correct: {assignment.mcqQuestions[index]?.correctOption})</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-xl border-t border-gray-600/20 shadow-lg">
        <div className="flex">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => handleTabSwitch(tab.id)}
                disabled={isEditing && tab.id !== 'details'}
                className={`flex-1 flex flex-col items-center justify-center py-2 px-1 border-t-2 transition-all duration-200 ${activeTab === tab.id
                    ? 'text-blue-300 border-blue-400'
                    : isEditing && tab.id !== 'details'
                      ? 'text-gray-400 opacity-50 cursor-not-allowed'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs font-semibold">{tab.name}</span>
              </button>
            )
          })}
        </div>
      </nav>

      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: 'rgba(30, 41, 59, 0.9)',
            color: 'white',
            border: '1px solid rgba(148, 163, 184, 0.3)',
            backdropFilter: 'blur(12px)',
          },
          className: 'text-sm font-medium',
        }}
        richColors
        closeButton
      />
    </div>
  )
}