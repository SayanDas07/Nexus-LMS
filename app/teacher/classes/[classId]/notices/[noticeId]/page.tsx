/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { BookOpen, ArrowLeft, Bell, Edit, Trash2, Eye, AlertTriangle, X } from 'lucide-react'
import { noticeSchema, type NoticeFormData } from '@/lib/validations/notice'
import { Toaster, toast } from 'sonner'

interface Notice {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
  creator: {
    name: string
    email: string
  }
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

export default function NoticeDetail() {
  const { classId, noticeId } = useParams()
  const router = useRouter()
  const [notice, setNotice] = useState<Notice | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [formData, setFormData] = useState<NoticeFormData>({
    title: '',
    content: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchNotice()
  }, [])

  const fetchNotice = async () => {
    try {
      const response = await fetch(`/api/classes/${classId}/notices/${noticeId}`)
      if (response.ok) {
        const noticeData = await response.json()
        setNotice(noticeData)
        setFormData({
          title: noticeData.title,
          content: noticeData.content
        })
      } else {
        toast.error('Failed to fetch notice')
      }
    } catch (error) {
      console.error('Error fetching notice:', error)
      toast.error('Error fetching notice')
    }
  }

  const getWordCount = (text: string) => {
    return text.trim() === '' ? 0 : text.trim().split(/\s+/).length
  }

  const validateForm = () => {
    try {
      noticeSchema.parse(formData)
      setErrors({})
      return true
    } catch (error) {
      // Type guard for ZodError-like structure
      if (
        typeof error === 'object' &&
        error !== null &&
        'issues' in error &&
        Array.isArray((error as any).issues)
      ) {
        const validationErrors: Record<string, string> = {}

        ;(error as { issues: Array<{ path: string[]; message: string }> }).issues.forEach((issue) => {
          validationErrors[issue.path[0]] = issue.message
        })
        setErrors(validationErrors)
      }
      return false
    }
  }

  const handleUpdate = async () => {
    if (!validateForm()) {
      toast.error('Please fix the form errors')
      return
    }
    
    setLoading(true)
    try {
      const response = await fetch(`/api/classes/${classId}/notices/${noticeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const updatedNotice = await response.json()
        setNotice(updatedNotice)
        setIsEditing(false)
        toast.success('Notice updated successfully!')
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to update notice')
      }
    } catch (error) {
      console.error('Error updating notice:', error)
      toast.error('Error updating notice')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setLoading(true)
    setShowDeleteModal(false)
    
    try {
      const response = await fetch(`/api/classes/${classId}/notices/${noticeId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Notice deleted successfully!')
        setTimeout(() => {
          router.push(`/teacher/classes/${classId}`)
        }, 1000)
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Failed to delete notice')
      }
    } catch (error) {
      console.error('Error deleting notice:', error)
      toast.error('Error deleting notice')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    if (notice) {
      setFormData({
        title: notice.title,
        content: notice.content
      })
    }
    setIsEditing(false)
    setErrors({})
  }

  const wordCount = getWordCount(formData.content)
  const isWordCountExceeded = wordCount > 100

  if (!notice) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <LoadingSpinner message="Loading notice..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated Background - You mentioned you have this */}
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
              onClick={() => router.back()}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-3 py-2 rounded-lg text-sm transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </button>
          </div>
        </div>
      </header>

      {/* Page Header */}
      <div className="bg-slate-800/60 backdrop-blur-lg border-b border-slate-700/50 relative z-10 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isEditing ? <Edit className="w-8 h-8 text-amber-400 drop-shadow-lg" /> : <Eye className="w-8 h-8 text-blue-400 drop-shadow-lg" />}
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-100 to-blue-200 bg-clip-text text-transparent">
                  {isEditing ? 'Edit Notice' : 'Notice Details'}
                </h1>
                <p className="text-slate-300 mt-1 font-medium">
                  {isEditing ? 'Update your notice information' : 'View and manage your notice'}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            {!isEditing && (
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white px-3 py-2 rounded-lg text-sm transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                >
                  <Edit className="w-4 h-4" />
                  <span className="hidden sm:inline">Edit</span>
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  disabled={loading}
                  className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white px-3 py-2 rounded-lg text-sm transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50">
          <div className="p-6 sm:p-8">
            {isEditing ? (
              <form className="space-y-6">
                {/* Title Field */}
                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-3">
                    Notice Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Enter notice title..."
                    className={`w-full px-4 py-3 bg-slate-700/50 backdrop-blur-lg border rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 text-slate-100 placeholder-slate-400 font-medium shadow-lg transition-all duration-200 ${
                      errors.title ? 'border-red-500/70 focus:ring-red-500/50' : 'border-slate-600/50'
                    }`}
                    required
                  />
                  {errors.title && (
                    <p className="text-red-400 text-sm mt-2 font-medium flex items-center gap-1">
                      <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                      {errors.title}
                    </p>
                  )}
                </div>

                {/* Content Field */}
                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-3">
                    Notice Content <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    placeholder="Write your notice content here..."
                    rows={8}
                    className={`w-full px-4 py-3 bg-slate-700/50 backdrop-blur-lg border rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 text-slate-100 placeholder-slate-400 font-medium shadow-lg transition-all duration-200 resize-none ${
                      errors.content ? 'border-red-500/70 focus:ring-red-500/50' : 'border-slate-600/50'
                    }`}
                    required
                  />
                  
                  {/* Word Count and Error Display */}
                  <div className="flex justify-between items-center mt-2">
                    <div>
                      {errors.content && (
                        <p className="text-red-400 text-sm font-medium flex items-center gap-1">
                          <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                          {errors.content}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-medium ${
                        isWordCountExceeded 
                          ? 'text-red-400' 
                          : wordCount > 80 
                          ? 'text-amber-400' 
                          : 'text-slate-400'
                      }`}>
                        {wordCount}/100 words
                      </p>
                      {isWordCountExceeded && (
                        <p className="text-xs text-red-400 mt-1">
                          Exceeds maximum word limit
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 sm:flex-none px-6 py-3 border border-slate-600/50 text-slate-300 font-semibold rounded-xl bg-slate-700/30 hover:bg-slate-700/50 backdrop-blur-lg transition-all duration-200 shadow-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleUpdate}
                    disabled={loading || isWordCountExceeded}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {loading ? 'Updating...' : 'Update Notice'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                {/* Notice Title */}
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-100 to-blue-200 bg-clip-text text-transparent mb-4">
                    {notice.title}
                  </h2>
                </div>

                {/* Notice Content */}
                <div className="bg-slate-700/30 backdrop-blur-lg rounded-xl p-6 border border-slate-600/50">
                  <h3 className="text-lg font-semibold text-slate-200 mb-3 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-blue-400" />
                    Notice Content
                  </h3>
                  <div className="prose max-w-none">
                    <p className="text-slate-300 whitespace-pre-wrap leading-relaxed font-medium">
                      {notice.content}
                    </p>
                  </div>
                </div>

                {/* Notice Metadata */}
                <div className="bg-slate-700/30 backdrop-blur-lg rounded-xl p-6 border border-slate-600/50">
                  <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                    <Eye className="w-5 h-5 text-blue-400" />
                    Notice Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-400 font-medium">Created by</p>
                      <p className="text-slate-200 font-semibold">{notice.creator.name}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 font-medium">Email</p>
                      <p className="text-slate-200 font-semibold">{notice.creator.email}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 font-medium">Created</p>
                      <p className="text-slate-200 font-semibold">{new Date(notice.createdAt).toLocaleString()}</p>
                    </div>
                    {notice.updatedAt !== notice.createdAt && (
                      <div>
                        <p className="text-slate-400 font-medium">Last Updated</p>
                        <p className="text-slate-200 font-semibold">{new Date(notice.updatedAt).toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Help Section */}
        {isEditing && (
          <div className="mt-6 bg-blue-500/10 backdrop-blur-lg border border-blue-400/30 rounded-xl p-4">
            <h3 className="font-semibold text-blue-200 mb-2 flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notice Guidelines
            </h3>
            <ul className="text-blue-100 text-sm space-y-1 font-medium">
              <li>• Keep your notice title clear and descriptive</li>
              <li>• Content should be concise and under 100 words</li>
              <li>• Use simple language that all students can understand</li>
              <li>• Include all necessary details like dates, times, and requirements</li>
            </ul>
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-500/20 rounded-full">
                    <AlertTriangle className="w-6 h-6 text-red-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-100">Delete Notice</h3>
                </div>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="text-slate-400 hover:text-slate-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="mb-6">
                <p className="text-slate-300 mb-3">
                  Are you sure you want to delete this notice? This action cannot be undone.
                </p>
                <div className="bg-slate-700/30 backdrop-blur-lg rounded-lg p-3 border border-slate-600/50">
                  <p className="text-slate-200 font-semibold text-sm truncate">
                    &quot;{notice.title}&quot;
                  </p>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2.5 border border-slate-600/50 text-slate-300 font-semibold rounded-lg bg-slate-700/30 hover:bg-slate-700/50 backdrop-blur-lg transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Delete Notice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 flex items-center justify-center">
          <LoadingSpinner message={isEditing ? "Updating notice..." : "Processing..."} />
        </div>
      )}

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