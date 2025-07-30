/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { BookOpen, ArrowLeft, Users, BookText, Bell, FileText, Check, Copy } from 'lucide-react'
import { toast, Toaster } from 'sonner'

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface Assignment {
  id: string
  title: string
  type: string
  deadline: string
  totalMarks: number
  _count?: { submittedAssignments?: number }
  status: string
}

interface Note {
  id: string
  noteName: string
  noteTopic: string
  createdAt: string
  updatedAt: string
  creator: User
}

interface Notice {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
  creator: User
}

interface ClassData {
  id: string
  name: string
  whichClass?: string
  inviteCode?: string
  assignments: Assignment[]
  notes: Note[]
  notices: Notice[]
  teachers: User[]
  enrolledStudents: User[]
  currentUserRole?: 'teacher' | 'student'
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
export default function ClassPage() {
  const params = useParams()
  const router = useRouter()
  const [classData, setClassData] = useState<ClassData | null>(null)
  const [activeTab, setActiveTab] = useState('assignments')
  const [loading, setLoading] = useState(true)
  const [tabLoading, setTabLoading] = useState(false) // New state for tab switching
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchClassData()
  }, [params.classId])

  const fetchClassData = async () => {
    try {
      const response = await fetch(`/api/classes/${params.classId}`)
      if (!response.ok) throw new Error('Failed to fetch class data')

      const data = await response.json()
      setClassData(data)
      // toast.success('Class data loaded successfully')
    } catch (error) {
      console.error('Failed to fetch class data:', error)
      toast.error('Failed to load class data')
    } finally {
      setLoading(false)
    }
  }

  // Enhanced tab switching with loading
  const handleTabSwitch = (tabId: string) => {
    if (tabId === activeTab) return

    setTabLoading(true)
    setTimeout(() => {
      setActiveTab(tabId)
      setTabLoading(false)
    }, 300) // Simulate loading time
  }

  const handleNoticeClick = (noticeId: string) => {
    router.push(`/teacher/classes/${params.classId}/notices/${noticeId}`)
  }

  const handleNotesClick = (noteId: string) => {
    router.push(`/teacher/classes/${params.classId}/notes/${noteId}`)
  }

  const handleAssignmentClick = (assignmentId: string) => {
    router.push(`/teacher/classes/${params.classId}/assignments/${assignmentId}`)
  }

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + '...'
  }

  const filterItems = (items: any[], type: 'assignments' | 'notes' | 'notices') => {
    if (!searchQuery && statusFilter === 'all' && typeFilter === 'all') return items

    return items.filter(item => {
      const matchesSearch = item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.noteName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.noteTopic?.toLowerCase().includes(searchQuery.toLowerCase())

      if (type === 'assignments') {
        const matchesStatus = statusFilter === 'all' || item.status === statusFilter
        const matchesType = typeFilter === 'all' || item.type === typeFilter
        return matchesSearch && matchesStatus && matchesType
      }

      return matchesSearch
    })
  }

  const copyToClipboard = async () => {
    if (!classData?.inviteCode) {
      toast.error('No invite code to copy');
      return;
    }
    try {
      await navigator.clipboard.writeText(classData.inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };
  const tabs = [
    { id: 'assignments', name: 'Assignments', icon: FileText },
    { id: 'notes', name: 'Notes', icon: BookText },
    { id: 'notices', name: 'Notices', icon: Bell },
    { id: 'students', name: 'Students', icon: Users }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        {/* Animated Background */}
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
                    Nexus LMS
                  </h1>
                  <p className="text-xs text-slate-400 hidden sm:block font-medium">Teacher Dashboard</p>
                </div>
              </div>

              {/* Dashboard Button */}
              <button
                onClick={() => router.push('/teacher/dashboard')}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-3 py-2 rounded-lg text-sm transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </button>
            </div>
          </div>
        </header>

        <div className="relative z-10">
          <LoadingSpinner message="Loading class data..." />
        </div>
      </div>
    )
  }

  if (!classData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        {/* Animated Background */}
        <ProfessionalAnimatedBackground />

        {/* Header */}
        <header className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-50 shadow-2xl">
          <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-14 sm:h-16">
              <div className="flex items-center gap-2 sm:gap-3">
                <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 drop-shadow-lg" />
                <div className="text-left">
                  <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-slate-100 to-blue-200 bg-clip-text text-transparent">
                    Nexus LMS
                  </h1>
                  <p className="text-xs text-slate-400 hidden sm:block font-medium">Teacher Dashboard</p>
                </div>
              </div>

              <button
                onClick={() => router.push('/teacher/dashboard')}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-3 py-2 rounded-lg text-sm transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </button>
            </div>
          </div>
        </header>

        <div className="flex justify-center items-center h-64 relative z-10">
          <div className="text-lg font-semibold text-slate-200">Class not found</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pb-16 md:pb-0 relative overflow-hidden">
      {/* Animated Background */}
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
                  Nexus LMS
                </h1>
                
              </div>
            </div>

            {/* Dashboard Button */}
            <button
              onClick={() => router.push('/teacher/dashboard')}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-3 py-2 rounded-lg text-sm transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
          </div>
        </div>
      </header>

      {/* Class Header */}
      <div className="bg-slate-800/60 backdrop-blur-lg border-b border-slate-700/50 relative z-10 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-100 to-blue-200 bg-clip-text text-transparent">
                {classData.name}
              </h1>
              {classData.whichClass && (
                <p className="text-slate-300 mt-1 font-medium">{classData.whichClass}</p>
              )}
              {classData.inviteCode && (
                <div className="mt-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-200 border border-blue-400/30 backdrop-blur-sm">
                    <span>Code: {classData.inviteCode}</span>
                    <button
                      onClick={copyToClipboard}
                      className="ml-1 p-1 rounded-md hover:bg-blue-400/20 transition-colors duration-200 group"
                      title={copied ? "Copied!" : "Copy code"}
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-blue-300 group-hover:text-blue-200" />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Desktop Tabs */}
      <div className="bg-slate-800/40 backdrop-blur-lg border-b border-slate-700/50 hidden md:block relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabSwitch(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-semibold text-sm whitespace-nowrap transition-all duration-200 ${activeTab === tab.id
                    ? 'border-blue-400 text-blue-300 shadow-lg'
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        {/* Tab Loading Overlay */}
        {tabLoading && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 flex items-center justify-center">
            <LoadingSpinner message="Switching tab..." />
          </div>
        )}

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          {/* Search Bar - Hide for students tab */}
          {activeTab !== 'students' && (
            <div className="relative">
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-4 py-3 bg-slate-800/60 backdrop-blur-lg border border-slate-600/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 text-slate-100 placeholder-slate-400 font-medium shadow-lg transition-all duration-200"
              />
            </div>
          )}

          {/* Filters for Assignments */}
          {activeTab === 'assignments' && (
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex-1 px-3 py-3 bg-slate-800/60 backdrop-blur-lg border border-slate-600/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 text-slate-100 font-medium shadow-lg"
              >
                <option value="all">All Status</option>
                <option value="OPEN">Open</option>
                <option value="CLOSED">Closed</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="flex-1 px-3 py-3 bg-slate-800/60 backdrop-blur-lg border border-slate-600/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 text-slate-100 font-medium shadow-lg"
              >
                <option value="all">All Types</option>
                <option value="MCQ">MCQ</option>
                <option value="DRIVE">
                  Descriptive Type
                </option>
              </select>
            </div>
          )}

          {/* Create Button - Show for non-students tab */}
          {activeTab !== 'students' && (
            <div className="flex justify-end">
              <Link
                href={`/teacher/classes/${params.classId}/${activeTab}/create`}
                className="inline-flex justify-center items-center px-4 py-3 border border-transparent text-sm font-semibold rounded-xl shadow-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
              >
                Create {activeTab.slice(0, -1)}
              </Link>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50">
          {activeTab === 'assignments' && (
            <div className="p-6">
              {classData.assignments.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-slate-400" />
                  <h3 className="mt-2 text-sm font-semibold text-slate-200">No assignments</h3>
                  <p className="mt-1 text-sm text-slate-400">Get started by creating a new assignment.</p>
                  <div className="mt-6">
                    <Link
                      href={`/teacher/classes/${params.classId}/assignments/create`}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-lg text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
                    >
                      Create Assignment
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {filterItems(classData.assignments, 'assignments').map((assignment) => {
                    const deadline = new Date(assignment.deadline);
                    const isExpired = deadline < new Date();
                    const status = assignment.status;

                    const statusConfig = {
                      OPEN: { bg: 'bg-emerald-500/20', text: 'text-emerald-300', border: 'border-emerald-400/30', label: 'OPEN' },
                      CLOSED: { bg: 'bg-red-500/20', text: 'text-red-300', border: 'border-red-400/30', label: 'CLOSED' },
                      PENDING: { bg: 'bg-amber-500/20', text: 'text-amber-300', border: 'border-amber-400/30', label: 'PENDING' },
                    };

                    const currentStatus = statusConfig[status as keyof typeof statusConfig] || {
                      bg: 'bg-slate-500/20', text: 'text-slate-300', border: 'border-slate-400/30', label: status
                    };

                    return (
                      <div
                        key={assignment.id}
                        onClick={() => handleAssignmentClick(assignment.id)}
                        className="border border-slate-600/50 bg-slate-700/30 backdrop-blur-lg rounded-xl p-4 hover:shadow-xl hover:bg-slate-700/50 cursor-pointer transition-all duration-300 hover:scale-[1.02]"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-slate-100">{assignment.title}</h3>
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border backdrop-blur-sm ${assignment.type === 'MCQ'
                                ? 'bg-purple-500/20 text-purple-300 border-purple-400/30'
                                : 'bg-blue-500/20 text-blue-300 border-blue-400/30'
                                }`}>
                                {assignment.type}
                              </span>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border backdrop-blur-sm ${currentStatus.bg} ${currentStatus.text} ${currentStatus.border}`}>
                                {currentStatus.label}
                              </span>
                            </div>
                          </div>

                          <div className="text-sm text-slate-300 font-medium">
                            <div className={isExpired ? 'text-red-400' : 'text-slate-300'}>
                              Due: {deadline.toLocaleDateString()} at {deadline.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between mt-3 text-sm text-slate-300 font-medium">
                          <div className="flex flex-wrap items-center gap-4">
                            <span>Total Marks: {assignment.totalMarks}</span>
                            <span>Submissions: {assignment._count?.submittedAssignments || 0}</span>
                          </div>
                          {isExpired && (
                            <span className="text-red-400 font-semibold">Deadline passed</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="p-6">
              {classData.notes.length === 0 ? (
                <div className="text-center py-12">
                  <BookText className="mx-auto h-12 w-12 text-slate-400" />
                  <h3 className="mt-2 text-sm font-semibold text-slate-200">No notes</h3>
                  <p className="mt-1 text-sm text-slate-400">Get started by creating a new note.</p>
                  <div className="mt-6">
                    <Link
                      href={`/teacher/classes/${params.classId}/notes/create`}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-lg text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
                    >
                      Create Note
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {filterItems(classData.notes, 'notes').map((note) => (
                    <div
                      key={note.id}
                      onClick={() => handleNotesClick(note.id)}
                      className="border border-slate-600/50 bg-slate-700/30 backdrop-blur-lg rounded-xl p-4 hover:shadow-xl hover:bg-slate-700/50 cursor-pointer transition-all duration-300 hover:scale-[1.02]"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-slate-100">{note.noteName}</h3>
                          <p className="text-slate-300 mt-1 font-medium">{note.noteTopic}</p>
                          <p className="text-sm text-slate-400 mt-2">By: {note.creator.name}</p>
                        </div>

                        <div className="flex flex-col sm:items-end gap-2">
                          <span className="text-sm text-slate-300 font-medium">
                            {new Date(note.createdAt).toLocaleDateString()}
                          </span>
                          {note.updatedAt !== note.createdAt && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-400/30 backdrop-blur-sm">
                              Updated
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'notices' && (
            <div className="p-6">
              {classData.notices.length === 0 ? (
                <div className="text-center py-12">
                  <Bell className="mx-auto h-12 w-12 text-slate-400" />
                  <h3 className="mt-2 text-sm font-semibold text-slate-200">No notices</h3>
                  <p className="mt-1 text-sm text-slate-400">Get started by creating a new notice.</p>
                  <div className="mt-6">
                    <Link
                      href={`/teacher/classes/${params.classId}/notices/create`}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-lg text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
                    >
                      Create Notice
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {filterItems(classData.notices, 'notices').map((notice) => (
                    <div
                      key={notice.id}
                      onClick={() => handleNoticeClick(notice.id)}
                      className="border border-slate-600/50 bg-slate-700/30 backdrop-blur-lg rounded-xl p-4 hover:shadow-xl hover:bg-slate-700/50 cursor-pointer transition-all duration-300 hover:scale-[1.02]"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-slate-100">{notice.title}</h3>
                          <p className="text-slate-300 mt-2 font-medium">{truncateContent(notice.content)}</p>
                          <p className="text-sm text-slate-400 mt-2">By: {notice.creator.name}</p>
                        </div>

                        <div className="text-sm text-slate-300 font-medium">
                          {new Date(notice.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'students' && (
            <div className="p-6">
              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-400/30 rounded-xl p-4 mb-6 backdrop-blur-sm">
                <h3 className="font-bold text-blue-200 mb-2">Class Statistics</h3>
                <p className="text-blue-100 font-medium">Total Students: {classData.enrolledStudents.length}</p>
              </div>

              {classData.enrolledStudents.length > 0 ? (
                <div className="space-y-4">
                  {classData.enrolledStudents.map((student) => (
                    <div key={student.id} className="border border-slate-600/50 bg-slate-700/30 backdrop-blur-lg rounded-xl p-4 hover:bg-slate-700/50 transition-all duration-300">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                          <h3 className="font-bold text-slate-100">{student.name}</h3>
                          <p className="text-slate-300 font-medium">{student.email}</p>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 mt-2 backdrop-blur-sm">
                            Student
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="mx-auto h-12 w-12 text-slate-400" />
                  <h3 className="mt-2 text-sm font-semibold text-slate-200">No students enrolled</h3>
                  <p className="mt-1 text-sm text-slate-400">Share the invite code to get students to join.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-xl border-t border-slate-700/50 z-40 shadow-2xl">
        <div className="flex">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => handleTabSwitch(tab.id)}
                className={`flex-1 flex flex-col items-center justify-center py-2 px-1 transition-all duration-200 ${activeTab === tab.id
                  ? 'text-blue-300 border-t-2 border-blue-400'
                  : 'text-slate-400 hover:text-slate-200'
                  }`}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs font-semibold">{tab.name}</span>
              </button>
            )
          })}
        </div>
      </nav>

      {/* Toast Container */}
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