/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import useSWR from "swr";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ArrowLeft, FileText, Bell, BookText, BarChart2, Clock, Award, AlertTriangle, Check, Download, X, Search, Filter } from "lucide-react";
import { toast, Toaster } from 'sonner'

const fetcher = (url: string) => fetch(url).then((res) => res.json());

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

export default function StudentClassPage() {
  const { id } = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"assignments" | "notices" | "materials" | "scores">("assignments");
  const [isClient, setIsClient] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [tabLoading, setTabLoading] = useState(false);

  const statusOptions = [
    { value: 'ACTIVE', label: 'Active', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30' },
    { value: 'SUBMITTED', label: 'Submitted', color: 'bg-blue-500/20 text-blue-300 border-blue-400/30' },
    { value: 'GRADED', label: 'Graded', color: 'bg-purple-500/20 text-purple-300 border-purple-400/30' },
    { value: 'OVERDUE', label: 'Overdue', color: 'bg-red-500/20 text-red-300 border-red-400/30' }
  ];

  // Initialize client state
  useEffect(() => {
    setIsClient(true);
  }, []);

  // API Data fetching
  const { data: assignments, error: assignmentError, isLoading: assignmentsLoading } = useSWR(`/api/class/${id}/assignments`, fetcher);
  const { data: notices, error: noticeError, isLoading: noticesLoading } = useSWR(`/api/class/${id}/notices`, fetcher);
  const { data: materials, error: materialError, isLoading: materialsLoading } = useSWR(`/api/class/${id}/materials`, fetcher);
  const { data: scores, error: scoreError, isLoading: scoresLoading } = useSWR(`/api/class/${id}/submit`, fetcher);

  // Enhanced tab switching with loading
  const handleTabSwitch = (tabId: string) => {
    if (tabId === activeTab) return;

    setTabLoading(true);
    setTimeout(() => {
      setActiveTab(tabId as any);
      setTabLoading(false);
    }, 300); // Simulate loading time
  };

  // Filter data based on search query
  const getAssignmentStatus = (assignment: any, submissions: any[] = []) => {
    const now = new Date();
    const deadline = new Date(assignment.deadline);
    const submission = submissions?.find((s: any) => s.assignmentId === assignment.id);

    if (submission?.marksObtained !== undefined && submission?.marksObtained !== null) {
      return {
        status: 'GRADED',
        color: 'from-purple-500 to-indigo-600',
        icon: <Award className="text-purple-400" />,
        bg: 'bg-gradient-to-br from-purple-500/10 to-indigo-500/10',
        textColor: 'text-purple-600 dark:text-purple-400',
        borderColor: 'border-purple-200 dark:border-purple-800'
      };
    }
    if (submission) {
      return {
        status: 'SUBMITTED',
        color: 'from-blue-500 to-cyan-500',
        icon: <Check className="text-blue-400" />,
        bg: 'bg-gradient-to-br from-blue-500/10 to-cyan-500/10',
        textColor: 'text-blue-600 dark:text-blue-400',
        borderColor: 'border-blue-200 dark:border-blue-800'
      };
    }
    if (now > deadline) {
      return {
        status: 'OVERDUE',
        color: 'from-red-500 to-pink-600',
        icon: <AlertTriangle className="text-red-400" />,
        bg: 'bg-gradient-to-br from-red-500/10 to-pink-500/10',
        textColor: 'text-red-600 dark:text-red-400',
        borderColor: 'border-red-200 dark:border-red-800'
      };
    }
    return {
      status: 'ACTIVE',
      color: 'from-green-500 to-emerald-500',
      icon: <Clock className="text-emerald-400" />,
      bg: 'bg-gradient-to-br from-green-500/10 to-emerald-500/10',
      textColor: 'text-green-600 dark:text-green-400',
      borderColor: 'border-green-200 dark:border-green-800'
    };
  };

  const filteredAssignments = assignments?.filter((assignment: any) => {
    const matchesSearch =
      assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.description?.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedStatus.length === 0) return matchesSearch;

    const status = getAssignmentStatus(assignment, scores || []).status;
    return matchesSearch && selectedStatus.includes(status);
  }) || [];

  const filteredNotices = notices?.filter((notice: any) =>
    notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    notice.content.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const filteredMaterials = materials?.filter((material: any) =>
    material.noteName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    material.noteTopic.toLowerCase().includes(searchQuery.toLowerCase()) ||
    material.notesLinks.some((link: string) => link.toLowerCase().includes(searchQuery.toLowerCase()))
  ) || [];

  const filteredScores = scores?.filter((score: any) =>
    score.assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    score.feedback?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  // Toggle status filter
  const toggleStatusFilter = (status: string) => {
    setSelectedStatus((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedStatus([]);
    setSearchQuery("");
  };

  const tabs = [
    { key: "assignments", label: "Assignments", icon: FileText, count: assignments?.length || 0 },
    { key: "notices", label: "Notices", icon: Bell, count: notices?.length || 0 },
    { key: "materials", label: "Materials", icon: BookText, count: materials?.length || 0 },
    { key: "scores", label: "Scores", icon: BarChart2, count: scores?.length || 0 }
  ];

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <ProfessionalAnimatedBackground />
        <LoadingSpinner message="Loading interface..." />
      </div>
    );
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
                  The Learning Tree
                </h1>
                <p className="text-xs text-slate-400 hidden sm:block font-medium">Student Dashboard</p>
              </div>
            </div>

            {/* Dashboard Button */}
            <button
              onClick={() => router.push('/student/dashboard')}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-3 py-2 rounded-lg text-sm transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
          </div>
        </div>
      </header>

      {/* Desktop Tabs */}
      <div className="bg-slate-800/40 backdrop-blur-lg border-b border-slate-700/50 hidden md:block relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => handleTabSwitch(tab.key)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-semibold text-sm whitespace-nowrap transition-all duration-200 ${activeTab === tab.key
                    ? 'border-blue-400 text-blue-300 shadow-lg'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {tab.count > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-xs bg-blue-500/20 text-blue-300">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
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
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-4 py-3 bg-slate-800/60 backdrop-blur-lg border border-slate-600/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 text-slate-100 placeholder-slate-400 font-medium shadow-lg transition-all duration-200"
            />
            <Search className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3.5 p-1 rounded-md hover:bg-slate-700/50"
              >
                <X className="h-5 w-5 text-slate-400" />
              </button>
            )}
          </div>

          {/* Filters for Assignments */}
          {activeTab === "assignments" && (
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <button
                  onClick={() => setShowStatusFilter(!showStatusFilter)}
                  className={`flex-1 px-3 py-3 bg-slate-800/60 backdrop-blur-lg border ${selectedStatus.length > 0
                    ? 'border-blue-400/50 bg-blue-500/20'
                    : 'border-slate-600/50'
                    } rounded-xl text-slate-100 font-medium shadow-lg flex items-center justify-between`}
                >
                  <span>Filter by Status</span>
                  <Filter className="h-5 w-5" />
                </button>

                {/* Status Filter Dropdown */}
                <AnimatePresence>
                  {showStatusFilter && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute z-10 mt-2 w-full bg-slate-800/90 backdrop-blur-lg border border-slate-700/50 rounded-xl shadow-xl overflow-hidden"
                    >
                      <div className="p-2">
                        <div className="px-3 py-2 text-sm font-medium border-b border-slate-700/50">
                          Filter by Status
                        </div>
                        <div className="p-2 space-y-1">
                          {statusOptions.map((option) => (
                            <div
                              key={option.value}
                              className="flex items-center px-3 py-2 rounded-md cursor-pointer hover:bg-slate-700/50"
                              onClick={() => toggleStatusFilter(option.value)}
                            >
                              <input
                                type="checkbox"
                                checked={selectedStatus.includes(option.value)}
                                readOnly
                                className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500"
                              />
                              <span className={`ml-3 text-sm ${option.color} px-2 py-1 rounded-full border`}>
                                {option.label}
                              </span>
                            </div>
                          ))}
                        </div>
                        {selectedStatus.length > 0 && (
                          <div className="px-3 py-2 border-t border-slate-700/50">
                            <button
                              onClick={clearFilters}
                              className="w-full text-sm text-blue-400 hover:underline"
                            >
                              Clear all filters
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Active Filters Display */}
          {activeTab === "assignments" && selectedStatus.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedStatus.map(status => {
                const option = statusOptions.find(opt => opt.value === status);
                return (
                  <span
                    key={status}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${option?.color} border`}
                  >
                    {option?.label}
                    <button
                      onClick={() => toggleStatusFilter(status)}
                      className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-slate-700/30"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                );
              })}
              {selectedStatus.length > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-blue-400 hover:underline ml-2"
                >
                  Clear all
                </button>
              )}
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50">
          {/* Assignments Tab */}
          {activeTab === "assignments" && (
            <div className="p-6">
              {assignmentsLoading ? (
                <LoadingSpinner />
              ) : assignmentError ? (
                <div className="text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-slate-400" />
                  <h3 className="mt-2 text-sm font-semibold text-slate-200">Error Loading Assignments</h3>
                  <p className="mt-1 text-sm text-slate-400">Please try refreshing the page</p>
                </div>
              ) : filteredAssignments.length ? (
                <div className="space-y-4">
                  {filteredAssignments.map((assignment: any) => {
                    const status = getAssignmentStatus(assignment, scores || []);
                    const submission = scores?.find((s: any) => s.assignmentId === assignment.id);
                    const deadline = new Date(assignment.deadline);
                    const isExpired = deadline < new Date();

                    return (
                      <Link
                        key={assignment.id}
                        href={`/student/class/${id}/assignments/${assignment.id}`}
                        className="block"
                      >
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`relative rounded-2xl overflow-hidden border ${status.borderColor} shadow-lg hover:shadow-xl transition-shadow`}
                        >
                          <div className={`absolute inset-0 ${status.bg} opacity-50`}></div>
                          <div className="relative p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h3 className="text-xl font-bold text-slate-100 mb-1">
                                  {assignment.title}
                                </h3>
                                <div className="flex items-center space-x-3">
                                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${status.textColor} ${status.bg} border ${status.borderColor}`}>
                                    {status.icon}
                                    <span className="ml-1.5">{status.status}</span>
                                  </span>
                                  <div className="flex items-center text-sm text-slate-300">
                                    <Clock className="w-4 h-4 mr-1" />
                                    <span>
                                      Due {deadline.toLocaleDateString('en-US', {
                                        month: 'short', day: 'numeric', year: 'numeric'
                                      })}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              {submission?.marksObtained !== undefined && submission?.marksObtained !== null && (
                                <div className="flex items-center space-x-2">
                                  <div className="text-right">
                                    <div className="text-2xl font-bold text-slate-100">
                                      {submission.marksObtained}
                                      <span className="text-sm font-normal text-slate-300">/{assignment.totalMarks}</span>
                                    </div>
                                    <div className="text-xs text-slate-400">
                                      {Math.round((submission.marksObtained / assignment.totalMarks) * 100)}%
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>

                            <p className="text-slate-300 mb-6">{assignment.description}</p>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                {assignment.attachmentUrl && (
                                  <a
                                    href={assignment.attachmentUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-slate-700/50 hover:bg-slate-700/70 text-slate-200 relative z-10 border border-slate-600/50"
                                  >
                                    <Download className="w-4 h-4 mr-2" />
                                    Download Files
                                  </a>
                                )}
                              </div>

                              <div className="flex items-center space-x-3">
                                <div
                                  onClick={(e) => e.stopPropagation()}
                                  className={`inline-flex items-center px-4 py-2 rounded-lg ${status.status === 'OVERDUE'
                                    ? 'bg-gradient-to-r from-slate-600 to-slate-700 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg'
                                    } text-white text-sm font-medium shadow-md transition-all relative z-10`}
                                >
                                  {status.status === 'ACTIVE' && 'Submit Assignment'}
                                  {status.status === 'SUBMITTED' && 'View Submission'}
                                  {status.status === 'GRADED' && 'View Feedback'}
                                  {status.status === 'OVERDUE' && 'Deadline Passed'}
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-slate-400" />
                  <h3 className="mt-2 text-sm font-semibold text-slate-200">
                    {searchQuery ? "No matching assignments found" : "No Assignments Yet"}
                  </h3>
                  <p className="mt-1 text-sm text-slate-400">
                    {searchQuery
                      ? "Try a different search term"
                      : "Your instructor hasn't posted any assignments yet"}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Materials Tab */}
          {activeTab === "materials" && (
            <div className="p-6">
              {materialsLoading ? (
                <LoadingSpinner />
              ) : materialError ? (
                <div className="text-center py-12">
                  <BookText className="mx-auto h-12 w-12 text-slate-400" />
                  <h3 className="mt-2 text-sm font-semibold text-slate-200">Error Loading Materials</h3>
                  <p className="mt-1 text-sm text-slate-400">Please try refreshing the page</p>
                </div>
              ) : filteredMaterials.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMaterials.map((material: any) => (
                    <motion.div
                      key={material.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-2xl overflow-hidden border border-slate-700/50 bg-slate-800/50 backdrop-blur-sm hover:shadow-lg transition-all"
                    >
                      <div className="p-6">
                        <div className="flex items-start mb-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0 mr-4">
                            <BookText className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-slate-100">{material.noteName}</h3>
                            <p className="text-sm text-slate-300">{material.noteTopic}</p>
                          </div>
                        </div>

                        <div className="space-y-3 mt-4">
                          {material.notesLinks.map((link: string, idx: number) => (
                            <a
                              key={idx}
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between p-3 rounded-lg transition-all bg-slate-700/50 hover:bg-slate-700/70"
                            >
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center mr-3">
                                  <span className="text-blue-400 font-medium">{idx + 1}</span>
                                </div>
                                <span className="text-sm font-medium text-slate-200">Resource {idx + 1}</span>
                              </div>
                              <Download className="w-4 h-4 text-slate-400" />
                            </a>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookText className="mx-auto h-12 w-12 text-slate-400" />
                  <h3 className="mt-2 text-sm font-semibold text-slate-200">
                    {searchQuery ? "No matching materials found" : "No Materials Shared"}
                  </h3>
                  <p className="mt-1 text-sm text-slate-400">
                    {searchQuery
                      ? "Try a different search term"
                      : "Your instructor hasn't shared any learning materials yet"}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Notices Tab */}
          {activeTab === "notices" && (
            <div className="p-6">
              {noticesLoading ? (
                <LoadingSpinner />
              ) : noticeError ? (
                <div className="text-center py-12">
                  <Bell className="mx-auto h-12 w-12 text-slate-400" />
                  <h3 className="mt-2 text-sm font-semibold text-slate-200">Error Loading Notices</h3>
                  <p className="mt-1 text-sm text-slate-400">Please try refreshing the page</p>
                </div>
              ) : filteredNotices.length ? (
                <div className="space-y-4">
                  {filteredNotices.map((notice: any) => (
                    <motion.div
                      key={notice.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="relative rounded-2xl overflow-hidden border border-slate-700/50 bg-slate-800/50 backdrop-blur-sm hover:shadow-lg transition-all"
                    >
                      <div className="absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-blue-500 to-purple-600" />
                      <div className="p-6 pl-8">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-lg font-bold text-slate-100">
                            {notice.title || "Untitled Notice"}
                          </h3>
                          <span className="text-xs text-slate-400">
                            {notice.createdAt ? new Date(notice.createdAt).toLocaleDateString('en-US', {
                              month: 'short', day: 'numeric', year: 'numeric'
                            }) : "No date"}
                          </span>
                        </div>
                        <p className="text-slate-300 mb-4">
                          {notice.content || "No content available"}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-slate-400">
                            Posted by: {notice.author || "Instructor"}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Bell className="mx-auto h-12 w-12 text-slate-400" />
                  <h3 className="mt-2 text-sm font-semibold text-slate-200">
                    {searchQuery ? "No matching notices found" : "No Notices Yet"}
                  </h3>
                  <p className="mt-1 text-sm text-slate-400">
                    {searchQuery
                      ? "Try a different search term"
                      : "Important announcements from your instructor will appear here"}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Scores Tab */}
          {activeTab === "scores" && (
            <div className="p-6">
              {scoresLoading ? (
                <LoadingSpinner />
              ) : scoreError ? (
                <div className="text-center py-12">
                  <BarChart2 className="mx-auto h-12 w-12 text-slate-400" />
                  <h3 className="mt-2 text-sm font-semibold text-slate-200">Error Loading Scores</h3>
                  <p className="mt-1 text-sm text-slate-400">Please try refreshing the page</p>
                </div>
              ) : filteredScores.length ? (
                <div className="space-y-6">


                  {/* Scores List */}
                  <div className="space-y-4">
                    {filteredScores.map((score: any) => (
                      <motion.div
                        key={score.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-2xl p-6 border border-slate-700/50 bg-slate-800/50 backdrop-blur-sm"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="text-lg font-bold text-slate-100">{score.assignment.title}</h4>

                          </div>

                          {score.marksObtained !== null && (
                            <div className="flex items-center space-x-4">
                              <div className="text-right">
                                <div className="text-2xl font-bold text-slate-100">
                                  {score.marksObtained}
                                  <span className="text-sm font-normal text-slate-300">/{score.assignment.totalMarks}</span>
                                </div>
                                <div className="text-xs text-slate-400">
                                  {Math.round((score.marksObtained / score.assignment.totalMarks) * 100)}%
                                </div>
                              </div>
                              <div className="relative w-12 h-12">
                                <svg className="w-full h-full" viewBox="0 0 36 36">
                                  <path
                                    d="M18 2.0845
                                      a 15.9155 15.9155 0 0 1 0 31.831
                                      a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="#334155"
                                    strokeWidth="3"
                                  />
                                  <path
                                    d="M18 2.0845
                                      a 15.9155 15.9155 0 0 1 0 31.831
                                      a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke={
                                      (score.marksObtained / score.assignment.totalMarks) >= 0.7
                                        ? '#10b981'
                                        : (score.marksObtained / score.assignment.totalMarks) >= 0.5
                                          ? '#f59e0b'
                                          : '#ef4444'
                                    }
                                    strokeWidth="3"
                                    strokeDasharray={`${(score.marksObtained / score.assignment.totalMarks) * 100}, 100`}
                                  />
                                </svg>
                              </div>
                            </div>
                          )}
                        </div>

                        {score.feedback && (
                          <div className="mt-4 p-4 rounded-lg bg-slate-700/50">
                            <h5 className="text-sm font-medium text-slate-200 mb-2">Instructor Feedback:</h5>
                            <p className="text-sm text-slate-300">{score.feedback}</p>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <BarChart2 className="mx-auto h-12 w-12 text-slate-400" />
                  <h3 className="mt-2 text-sm font-semibold text-slate-200">
                    {searchQuery ? "No matching scores found" : "No Scores Yet"}
                  </h3>
                  <p className="mt-1 text-sm text-slate-400">
                    {searchQuery
                      ? "Try a different search term"
                      : "Submit assignments to see your grades and performance metrics"}
                  </p>
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
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => handleTabSwitch(tab.key)}
                className={`flex-1 flex flex-col items-center justify-center py-2 px-1 transition-all duration-200 ${activeTab === tab.key
                  ? 'text-blue-300 border-t-2 border-blue-400'
                  : 'text-slate-400 hover:text-slate-200'
                  }`}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs font-semibold">{tab.label}</span>
                {tab.count > 0 && (
                  <span className="absolute top-1 right-4 px-1.5 py-0.5 rounded-full text-[10px] bg-blue-500/20 text-blue-300">
                    {tab.count}
                  </span>
                )}
              </button>
            );
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
    </div>
  );
}