'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useUser, useClerk } from '@clerk/nextjs'
import { BookOpen, Settings, BarChart3, LogOut, Plus, GraduationCap, FileText, Bell, BookCopy, BookCheck } from 'lucide-react'


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

// Professional Stats Card Component
type StatsCardProps = {
  icon: React.ReactNode
  label: string
  value: number | string
  color: string
}
// This component is used to display statistics in a card format
const StatsCard = ({ icon, label, value, color }: StatsCardProps) => (
  <div className="bg-slate-800/50 backdrop-blur-lg p-6 rounded-2xl border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 hover:bg-slate-800/70 group">
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-xl ${color} shadow-lg backdrop-blur-sm group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-slate-400 font-medium mb-1">{label}</p>
        <p className="text-3xl font-bold text-slate-100">{value}</p>
      </div>
    </div>
  </div>
)

// Professional Class Card Component
type ClassType = {
  id: string
  name: string
  whichClass?: string
  inviteCode?: string
  _count: {
    assignments: number
    notes: number
    notices: number
    enrolledStudents: number
  }
}

// This component is used to display each class in a card format
const ClassCard = ({ cls, index }: { cls: ClassType; index: number }) => (
  <Link key={cls.id} href={`/teacher/classes/${cls.id}`}>
    <div
      className="group relative bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 hover:bg-slate-800/70 transition-all duration-500 border border-slate-700/50 hover:border-blue-500/50 transform hover:-translate-y-2 cursor-pointer overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10"
      style={{
        animationDelay: `${index * 100}ms`
      }}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <h3 className="font-bold text-xl text-slate-100 group-hover:text-blue-400 transition-colors duration-300 mb-2">
              {cls.name}
            </h3>
            {cls.whichClass && (
              <p className="text-slate-400 text-sm font-medium bg-slate-700/50 px-3 py-1 rounded-full inline-block backdrop-blur-sm">
                {cls.whichClass}
              </p>
            )}
          </div>
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
            {cls.name.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-white text-xs font-bold">
              📝
            </div>
            <div className="flex-1">
              <p className="text-xs text-slate-400">Assignments</p>
              <p className="font-bold text-slate-100">{cls._count.assignments}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center text-white text-xs font-bold">
              📚
            </div>
            <div className="flex-1">
              <p className="text-xs text-slate-400">Notes</p>
              <p className="font-bold text-slate-100">{cls._count.notes}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
              📢
            </div>
            <div className="flex-1">
              <p className="text-xs text-slate-400">Notices</p>
              <p className="font-bold text-slate-100">{cls._count.notices}</p>
            </div>
          </div>
        </div>

        {/* Invite Code */}
        {cls.inviteCode && (
          <div className="bg-slate-700/30 backdrop-blur-sm p-3 rounded-xl border border-slate-600/30">
            <p className="text-xs text-slate-400 mb-1 font-medium">Invite Code</p>
            <p className="font-mono font-bold text-slate-100 tracking-wider">
              {cls.inviteCode}
            </p>
          </div>
        )}

        {/* Hover indicator */}
        <div className="absolute bottom-4 right-4 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
          →
        </div>
      </div>
    </div>
  </Link>
)

export default function Dashboard() {
  const { user, isLoaded: userLoaded } = useUser()
  const { signOut } = useClerk()
  const router = useRouter()
  const [classes, setClasses] = useState<ClassType[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [tabLoading, setTabLoading] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  useEffect(() => {
    if (userLoaded) {
      fetchClasses()
    }
  }, [userLoaded])

  const fetchClasses = async () => {
    try {
      const response = await fetch('/api/classes')
      const data = await response.json()

      if (Array.isArray(data)) {
        setClasses(data)
      } else {
        setClasses([])
      }
    } catch (error) {
      console.error('Failed to fetch classes:', error)
      setClasses([])
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (tabId: string) => {
    if (tabId === activeTab) return

    if (tabId === 'freemeterial') {
      router.push('/teacher/freemeterial')
      return
    }
    if (tabId === 'profile') {
      router.push('/teacher/profile')
      return
    }

    setTabLoading(true)

    setTimeout(() => {
      setActiveTab(tabId)
      setTabLoading(false)
    }, 800)
  }

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await signOut({ redirectUrl: '/' })
    } catch (error) {
      console.error('Logout failed:', error)
      setLoggingOut(false)
    }
  }

  const getUserInitials = () => {
    if (!user) return 'U'

    const firstName = user.firstName || ''
    const lastName = user.lastName || ''

    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
    } else if (firstName) {
      return firstName.substring(0, 2).toUpperCase()
    } else if (lastName) {
      return lastName.substring(0, 2).toUpperCase()
    } else if (user.emailAddresses?.[0]?.emailAddress) {
      return user.emailAddresses[0].emailAddress.substring(0, 2).toUpperCase()
    }

    return 'U'
  }

  const getUserDisplayName = () => {
    if (!user) return 'User'

    const firstName = user.firstName || ''
    const lastName = user.lastName || ''

    if (firstName && lastName) {
      return `${firstName} ${lastName}`
    } else if (firstName) {
      return firstName
    } else if (lastName) {
      return lastName
    } else if (user.emailAddresses?.[0]?.emailAddress) {
      return user.emailAddresses[0].emailAddress.split('@')[0]
    }

    return 'User'
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'classes', label: 'All Classes', icon: GraduationCap },
    { id: 'freemeterial', label: 'Free Meterials', icon: BookCopy },
    { id: 'profile', label: 'Profile Settings', icon: Settings },
    { id: 'logout', label: 'Logout', icon: LogOut }
  ]

  

  const renderOverview = () => (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-100 mb-2">
            Welcome back, {user?.firstName || 'there'}!
          </h2>
          <p className="text-slate-300">Here is what is happening with your classes today.</p>
        </div>
        <Link href="/teacher/classes/create">
          <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm font-medium">
            <Plus className="w-5 h-5" />
            Create New Class
          </button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          icon={<GraduationCap className="w-6 h-6 text-white" />}
          label="Total Classes"
          value={classes.length}
          color="bg-gradient-to-r from-blue-500 to-indigo-600"
        />
        <StatsCard
          icon={<FileText className="w-6 h-6 text-white" />}
          label="Total Assignments"
          value={classes.reduce((acc, cls) => acc + cls._count.assignments, 0)}
          color="bg-gradient-to-r from-emerald-500 to-teal-600"
        />
        <StatsCard
          icon={<Bell className="w-6 h-6 text-white" />}
          label="Total Notices"
          value={classes.reduce((acc, cls) => acc + cls._count.notices, 0)}
          color="bg-gradient-to-r from-orange-500 to-red-600"
        />
        <StatsCard
          icon={<BookCheck className="w-6 h-6 text-white" />}
          label="Total Created Paid Notes"
          value={classes.reduce((acc, cls) => acc + cls._count.notes, 0)}
          color="bg-gradient-to-r from-orange-500 to-red-600"
        />
        

      </div>
    </div>
  )

  const renderAllClasses = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-slate-100">All Classes</h2>
        <Link href="/teacher/classes/create">
          <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl">
            <Plus className="w-5 h-5" />
            Create Class
          </button>
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-8"><LoadingSpinner /></div>
      ) : classes.length === 0 ? (
        <div className="text-center py-12 bg-slate-800/50 backdrop-blur-lg rounded-2xl border border-slate-700/50">
          <GraduationCap className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-300 mb-4">No classes found. Create one to get started.</p>
          <Link href="/teacher/classes/create">
            <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl transition-all duration-300">
              Create Your First Class
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((cls, index) => (
            <ClassCard key={cls.id} cls={cls} index={index} />
          ))}
        </div>
      )}
    </div>
  )

  const renderContent = () => {
    if (tabLoading) {
      const tabNames: Record<string, string> = {
        'overview': 'Loading Overview',
        'classes': 'Loading Classes'
      }
      return <LoadingSpinner message={tabNames[activeTab] ?? 'Loading...'} />
    }

    switch (activeTab) {
      case 'overview':
        return renderOverview()
      case 'classes':
        return renderAllClasses()
      default:
        return renderOverview()
    }
  }

  if (!userLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center relative">
        <ProfessionalAnimatedBackground />
        <LoadingSpinner message="Loading Nexus LMS Dashboard" />
      </div>
    )
  }

  if (loggingOut) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center relative">
        <ProfessionalAnimatedBackground />
        <div className="text-center relative z-10">
          <div className="relative mb-8">
            <LogOut className="w-16 h-16 text-red-400 mx-auto animate-pulse" />
          </div>
          <h2 className="text-xl font-semibold text-slate-100 animate-pulse">Logging you out...</h2>
          <p className="text-slate-300">Signing out securely</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center relative">
        <ProfessionalAnimatedBackground />
        <div className="text-center relative z-10">
          <p className="text-slate-300 mb-4">Please sign in to access the dashboard.</p>
          <Link
            href="/sign-in"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl transition-all duration-300"
          >
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative">
      <ProfessionalAnimatedBackground />

      {/* Top Navigation */}
      <header className="bg-slate-800/80 backdrop-blur-lg border-b border-slate-700/50 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Title */}
            <div className="flex items-center gap-2 sm:gap-3">
              <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
              <div className="flex flex-col">
                <h1 className="text-base sm:text-l font-bold text-slate-100 leading-tight break-words sm:truncate">
                  Nexus LMS
                </h1>

                <p className="text-[10px] sm:text-xs text-slate-400">Teacher Dashboard</p>
              </div>
            </div>

            {/* User Profile */}
            <Link href="/teacher/profile" className="flex items-center gap-3 hover:bg-slate-700/50 rounded-xl p-3 transition-all duration-300 backdrop-blur-sm">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                {getUserInitials()}
              </div>
              <span className="hidden sm:block text-sm font-medium text-slate-200">
                {getUserDisplayName()}
              </span>
            </Link>
          </div>
        </div>
      </header>
      <div className="flex relative z-10">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 bg-slate-800/50 backdrop-blur-lg border-r border-slate-700/50 min-h-screen">
          <nav className="p-4 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id

              if (tab.id === 'logout') {
                return (
                  <button
                    key={tab.id}
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-300 disabled:opacity-50 backdrop-blur-sm"
                  >
                    {loggingOut ? (
                      <div className="w-5 h-5 animate-spin rounded-full border-2 border-red-300 border-t-red-500"></div>
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                    <span className="font-medium">
                      {loggingOut ? 'Logging out...' : tab.label}
                    </span>
                  </button>
                )
              }

              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  disabled={tabLoading}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 disabled:opacity-50 backdrop-blur-sm ${isActive
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-slate-100'
                    }`}
                >
                  {tabLoading && activeTab === tab.id ? (
                    <div className="w-5 h-5 animate-spin rounded-full border-2 border-blue-300 border-t-blue-500"></div>
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                  <span className="font-medium">{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
          {renderContent()}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-slate-800/80 backdrop-blur-lg border-t border-slate-700/50 px-4 py-2 z-40">
        <div className="flex justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id

            if (tab.id === 'logout') {
              return (
                <button
                  key={tab.id}
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex flex-col items-center gap-1 p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-300 disabled:opacity-50"
                >
                  {loggingOut ? (
                    <div className="w-5 h-5 animate-spin rounded-full border-2 border-red-300 border-t-red-500"></div>
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                  <span className="text-xs font-medium">Logout</span>
                </button>
              )
            }

            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                disabled={tabLoading}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-300 disabled:opacity-50 ${isActive
                  ? 'text-blue-400 bg-blue-500/20'
                  : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
                  }`}
              >
                {tabLoading && activeTab === tab.id ? (
                  <div className="w-5 h-5 animate-spin rounded-full border-2 border-blue-300 border-t-blue-500"></div>
                ) : (
                  <Icon className="w-5 h-5" />
                )}
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </nav>
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