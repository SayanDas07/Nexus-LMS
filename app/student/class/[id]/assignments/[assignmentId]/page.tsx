"use client";

import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import { useState, useRef, useEffect } from "react";
import { toast, Toaster } from "sonner";
import { BookOpen, ArrowLeft, CheckCircle, XCircle, Clock } from "lucide-react";

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
  <div className="min-h-[400px] flex items-center justify-center relative z-10">
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

export default function StudentAssignmentPage() {
  const { id, assignmentId } = useParams();
  const router = useRouter();
  
  const [submissionLink, setSubmissionLink] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const { data: assignment, error, mutate } = useSWR(
    `/api/class/${id}/assignments/${assignmentId}/student`,
    fetcher
  );

  const { data: results } = useSWR(
    showResults ? `/api/class/${id}/assignments/${assignmentId}/results` : null,
    fetcher
  );

  if (error) return <div className="p-6 text-red-400 relative z-10">Failed to load assignment</div>;
  if (!assignment) return (
    <div className="relative min-h-screen">
      <ProfessionalAnimatedBackground />
      <LoadingSpinner message="Loading assignment..." />
    </div>
  );

  const isSubmitted = assignment.submittedAssignments?.length > 0;
  const submission = assignment.submittedAssignments?.[0];
  const isDeadlinePassed = new Date() > new Date(assignment.deadline);

  const handleOptionChange = (questionIndex: number, option: string) => {
    const newOptions = [...selectedOptions];
    newOptions[questionIndex] = option;
    setSelectedOptions(newOptions);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/class/${id}/assignments/${assignmentId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          submissionLink: assignment.type === 'DRIVE' ? submissionLink : null,
          selectedOptions: assignment.type === 'MCQ' ? selectedOptions : null,
        }),
      });

      if (response.ok) {
        mutate();
        if (assignment.type === 'MCQ') {
          setShowResults(true);
        }
        toast.success('Assignment submitted successfully!');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to submit assignment');
      }
    } catch (error) {
      console.error('Error submitting assignment:', error);
      toast.error('Failed to submit assignment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <ProfessionalAnimatedBackground />
      
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-14 sm:h-16 gap-4">
            <button 
              onClick={() => router.back()}
              className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back to Class</span>
            </button>
            <div className="flex-1 text-center">
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-slate-100 to-blue-200 bg-clip-text text-transparent">
                {assignment.title}
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-100 mb-2">{assignment.title}</h2>
              <div className="flex flex-wrap gap-2">
                <span className="text-sm bg-slate-700/50 text-slate-300 px-3 py-1 rounded-full">
                  {assignment.class.name}
                </span>
                <span className="text-sm bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full">
                  {assignment.type}
                </span>
                <span className="text-sm bg-purple-500/10 text-purple-400 px-3 py-1 rounded-full">
                  {assignment.totalMarks} marks
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-slate-300 mb-1">Teacher: {assignment.teacher.name}</p>
              <p className={`flex items-center justify-end gap-1 ${isDeadlinePassed ? 'text-red-400' : 'text-slate-300'}`}>
                <Clock className="w-4 h-4" />
                Deadline: {new Date(assignment.deadline).toLocaleDateString()}
                {isDeadlinePassed && ' (Passed)'}
              </p>
            </div>
          </div>

          {isSubmitted && (
            <div className="bg-green-900/20 border border-green-800/50 rounded-xl p-4 mb-6 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <h3 className="text-lg font-semibold text-green-400">Submission Complete</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-slate-300">
                <p>Submitted on: {new Date(submission.createdAt).toLocaleDateString()}</p>
                {submission.marksObtained !== null && (
                  <p>Score: {submission.marksObtained} / {assignment.totalMarks}</p>
                )}
                {submission.grade && (
                  <p>Grade: {submission.grade}</p>
                )}
              </div>
              
              {assignment.type === 'MCQ' && (
                <button
                  onClick={() => setShowResults(true)}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  View Results
                </button>
              )}
            </div>
          )}

          {showResults && results && (
            <div className="mb-8 bg-slate-800/60 rounded-xl p-6 border border-slate-700/50">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-100">Results</h2>
                <button
                  onClick={() => setShowResults(false)}
                  className="text-slate-400 hover:text-slate-200 transition-colors"
                >
                  Close
                </button>
              </div>
              
              <div className="bg-slate-800/80 rounded-lg p-4 mb-6 border border-slate-700/50">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-slate-400">Score</p>
                    <p className="text-2xl font-bold text-slate-100">
                      {results.submission.marksObtained} / {results.assignment.totalMarks}
                    </p>
                  </div>
                  {results.submission.grade && (
                    <div>
                      <p className="text-slate-400">Grade</p>
                      <p className="text-2xl font-bold text-slate-100">{results.submission.grade}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-6">
                {results.results.map((result: any, index: number) => (
                  <div key={index} className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-semibold text-slate-100">
                        Question {index + 1}: {result.question}
                      </h4>
                      {result.isCorrect ? (
                        <span className="flex items-center gap-1 text-green-400">
                          <CheckCircle className="w-4 h-4" /> Correct
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-400">
                          <XCircle className="w-4 h-4" /> Incorrect
                        </span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {['A', 'B', 'C', 'D'].map((option) => (
                        <div
                          key={option}
                          className={`p-3 rounded-lg border ${
                            result.correctOption === option
                              ? 'bg-green-900/20 border-green-700/50'
                              : result.selectedOption === option && result.selectedOption !== result.correctOption
                              ? 'bg-red-900/20 border-red-700/50'
                              : 'bg-slate-700/20 border-slate-600/50'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <span className={`font-bold ${
                              result.correctOption === option
                                ? 'text-green-400'
                                : result.selectedOption === option && result.selectedOption !== result.correctOption
                                ? 'text-red-400'
                                : 'text-slate-400'
                            }`}>
                              {option}:
                            </span>
                            <p className="text-slate-300">{result[`option${option}`]}</p>
                          </div>
                          {result.correctOption === option && (
                            <p className="text-xs text-green-400 mt-1">✓ Correct answer</p>
                          )}
                          {result.selectedOption === option && result.selectedOption !== result.correctOption && (
                            <p className="text-xs text-red-400 mt-1">✗ Your answer</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!isSubmitted && !isDeadlinePassed && (
            <div>
              {assignment.type === 'DRIVE' && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-slate-100 mb-4">Submit Your Work</h2>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Google Drive Link *
                    </label>
                    <input
                      type="url"
                      value={submissionLink}
                      onChange={(e) => setSubmissionLink(e.target.value)}
                      placeholder="https://drive.google.com/..."
                      className="w-full p-3 bg-slate-800/60 border border-slate-700/50 rounded-lg text-slate-100 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 transition-all"
                      required
                    />
                    <p className="text-xs text-slate-500 mt-2">
                      Make sure your file is accessible to your teacher
                    </p>
                  </div>
                </div>
              )}

              {assignment.type === 'MCQ' && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-slate-100 mb-6">MCQ Questions</h2>
                  <div className="space-y-6">
                    {assignment.mcqQuestions.map((question: any, index: number) => (
                      <div key={question.id} className="bg-slate-800/60 p-4 rounded-lg border border-slate-700/50">
                        <h3 className="font-semibold text-slate-100 mb-4">
                          Question {index + 1}: {question.question}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {['A', 'B', 'C', 'D'].map((option) => (
                            <label key={option} className="flex items-start gap-3 p-3 bg-slate-800/40 rounded-lg border border-slate-700/50 hover:border-blue-500/50 transition-colors cursor-pointer">
                              <input
                                type="radio"
                                name={`question-${index}`}
                                value={option}
                                checked={selectedOptions[index] === option}
                                onChange={() => handleOptionChange(index, option)}
                                className="mt-1"
                              />
                              <div>
                                <span className="font-medium text-slate-300">{option}:</span>
                                <p className="text-slate-400">{question[`option${option}`]}</p>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={handleSubmit}
                  disabled={
                    isSubmitting ||
                    (assignment.type === 'DRIVE' && !submissionLink.trim()) ||
                    (assignment.type === 'MCQ' && selectedOptions.length !== assignment.mcqQuestions.length)
                  }
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 font-medium disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : 'Submit Assignment'}
                </button>
                
                <button
                  onClick={() => router.back()}
                  className="px-6 py-3 rounded-lg border border-slate-700/50 hover:border-slate-600/70 text-slate-300 hover:text-slate-100 transition-colors"
                >
                  Back to Class
                </button>
              </div>
            </div>
          )}

          {isDeadlinePassed && !isSubmitted && (
            <div className="bg-red-900/20 border border-red-800/50 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-400" />
                <h3 className="text-lg font-semibold text-red-400">Submission Closed</h3>
              </div>
              <p className="text-slate-300 mt-2">The deadline for this assignment has passed.</p>
            </div>
          )}
        </div>
      </main>

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