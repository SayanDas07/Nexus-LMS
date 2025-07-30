'use client';

import { ArrowLeft, BookMarked, BookOpen, Brain, Edit2, FileText, GraduationCap, HelpCircle, ListOrdered, Loader2, Plus, Save, Sparkles, Trash2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { toast, Toaster } from 'sonner';

interface FreeMaterial {
  id: string;
  question?: string;
  optionA?: string;
  optionB?: string;
  optionC?: string;
  optionD?: string;
  correctAns?: string;
  explanation?: string;
  topic?: string;
  notesLink?: string;
  createdAt: string;
  creator: {
    name: string;
    email: string;
  };
}

interface CreateMaterialForm {
  type: 'mcq' | 'notes';
  topic: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAns: string;
  explanation: string;
  notesLink: string;
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

export default function FreeMaterialsPage() {
  const [materials, setMaterials] = useState<FreeMaterial[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<FreeMaterial | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'mcq' | 'notes'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  // AI Generation Modal State
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiForm, setAiForm] = useState({
    subject: '',
    topic: '',
    subTopic: '',
    className: '',
    numberOfQuestions: 5,
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    questionType: 'mixed' as 'factual' | 'conceptual' | 'analytical' | 'mixed'
  });

  const router = useRouter();

  const [form, setForm] = useState<CreateMaterialForm>({
    type: 'mcq',
    topic: '',
    question: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAns: 'A',
    explanation: '',
    notesLink: ''
  });

  const fetchMaterials = async () => {
    try {
      const response = await fetch('/api/freematerial');
      const data = await response.json();
      if (data.success) {
        setMaterials(data.data);
      }
    } catch (error) {
      console.error('Error fetching materials:', error);
      toast.error('Failed to fetch materials');
    } finally {
      setLoading(false);
    }
  };

  const handleAIGeneration = async () => {
    setAiGenerating(true);
    
    try {
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aiForm)
      });

      if (response.ok) {
        const data = await response.json();
        
        // Create materials from generated questions
        const createdMaterials = [];
        for (const question of data.questions) {
          const payload = {
            question: question.question,
            optionA: question.optionA,
            optionB: question.optionB,
            optionC: question.optionC,
            optionD: question.optionD,
            correctAns: question.correctOption,
            explanation: question.explanation || '',
            topic: aiForm.topic
          };

          const createResponse = await fetch('/api/freematerial', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });

          if (createResponse.ok) {
            createdMaterials.push(payload);
          }
        }

        setShowAIModal(false);
        // Reset AI form
        setAiForm({
          subject: '',
          topic: '',
          subTopic: '',
          className: '',
          numberOfQuestions: 5,
          difficulty: 'medium',
          questionType: 'mixed'
        });
        
        fetchMaterials(); // Refresh the materials list
        toast.success(`Generated and created ${createdMaterials.length} questions successfully!`);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to generate questions');
      }
    } catch (error) {
      console.error('Error generating questions:', error);
      toast.error('Error generating questions');
    } finally {
      setAiGenerating(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = form.type === 'mcq'
        ? {
          question: form.question,
          optionA: form.optionA,
          optionB: form.optionB,
          optionC: form.optionC,
          optionD: form.optionD,
          correctAns: form.correctAns,
          explanation: form.explanation,
          topic: form.topic
        }
        : {
          notesLink: form.notesLink,
          topic: form.topic
        };

      const response = await fetch('/api/freematerial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setShowCreateForm(false);
        resetForm();
        fetchMaterials();
        toast.success('Material created successfully!');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to create material');
      }
    } catch (error) {
      console.error('Error creating material:', error);
      toast.error('Failed to create material');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMaterial) return;

    setSubmitting(true);

    try {
      const payload = form.type === 'mcq'
        ? {
          question: form.question,
          optionA: form.optionA,
          optionB: form.optionB,
          optionC: form.optionC,
          optionD: form.optionD,
          correctAns: form.correctAns,
          explanation: form.explanation,
          topic: form.topic
        }
        : {
          notesLink: form.notesLink,
          topic: form.topic
        };

      const response = await fetch(`/api/freematerial/${editingMaterial.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setEditingMaterial(null);
        resetForm();
        fetchMaterials();
        toast.success('Material updated successfully!');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update material');
      }
    } catch (error) {
      console.error('Error updating material:', error);
      toast.error('Failed to update material');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/freematerial/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchMaterials();
        toast.success('Material deleted successfully!');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to delete material');
      }
    } catch (error) {
      console.error('Error deleting material:', error);
      toast.error('Failed to delete material');
    } finally {
      setShowDeleteModal(false);
      setMaterialToDelete(null);
    }
  };

  const openDeleteModal = (id: string) => {
    setMaterialToDelete(id);
    setShowDeleteModal(true);
  };

  const resetForm = () => {
    setForm({
      type: 'mcq',
      topic: '',
      question: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctAns: 'A',
      explanation: '',
      notesLink: ''
    });
  };

  const startEdit = (material: FreeMaterial) => {
    setEditingMaterial(material);
    setShowCreateForm(true);
    setForm({
      type: material.question ? 'mcq' : 'notes',
      topic: material.topic || '',
      question: material.question || '',
      optionA: material.optionA || '',
      optionB: material.optionB || '',
      optionC: material.optionC || '',
      optionD: material.optionD || '',
      correctAns: material.correctAns || 'A',
      explanation: material.explanation || '',
      notesLink: material.notesLink || ''
    });
  };

  const handleAddQuestion = () => {
    setShowCreateForm(true);
    setEditingMaterial(null);
    setForm({
      ...form,
      type: 'mcq',
      question: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctAns: 'A',
      explanation: '',
      topic: ''
    });
  };

  const handleAddLink = () => {
    setShowCreateForm(true);
    setEditingMaterial(null);
    setForm({
      ...form,
      type: 'notes',
      notesLink: '',
      topic: ''
    });
  };

  // Filter and paginate materials
  const filteredMaterials = filterType === 'all'
    ? materials
    : materials.filter(material =>
      filterType === 'mcq' ? material.question : material.notesLink
    );

  const totalPages = Math.ceil(filteredMaterials.length / itemsPerPage);
  const paginatedMaterials = filteredMaterials.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    fetchMaterials();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      <Toaster position="top-right" richColors />
      <ProfessionalAnimatedBackground />

      {/* AI Generation Modal */}
      {showAIModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-100">Generate Questions with AI</h3>
                    <p className="text-slate-400 text-sm">Let AI create MCQ questions for your materials</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAIModal(false)}
                  className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors duration-200"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              {/* AI Form */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
                      <BookMarked className="w-4 h-4 text-purple-400" />
                      Subject <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={aiForm.subject}
                      onChange={(e) => setAiForm({ ...aiForm, subject: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-700/50 backdrop-blur-lg border border-slate-600/50 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/50 text-slate-100 placeholder-slate-400 font-medium shadow-lg transition-all duration-200"
                      placeholder="e.g., Mathematics, Physics, History"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-purple-400" />
                      Class <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={aiForm.className}
                      onChange={(e) => setAiForm({ ...aiForm, className: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-700/50 backdrop-blur-lg border border-slate-600/50 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/50 text-slate-100 placeholder-slate-400 font-medium shadow-lg transition-all duration-200"
                      placeholder="e.g., Grade 10, Class XII, University"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-3">
                    Topic <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={aiForm.topic}
                    onChange={(e) => setAiForm({ ...aiForm, topic: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700/50 backdrop-blur-lg border border-slate-600/50 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/50 text-slate-100 placeholder-slate-400 font-medium shadow-lg transition-all duration-200"
                    placeholder="e.g., Quadratic Equations, Photosynthesis, World War II"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-3">
                    Sub Topic (Optional)
                  </label>
                  <input
                    type="text"
                    value={aiForm.subTopic}
                    onChange={(e) => setAiForm({ ...aiForm, subTopic: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700/50 backdrop-blur-lg border border-slate-600/50 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/50 text-slate-100 placeholder-slate-400 font-medium shadow-lg transition-all duration-200"
                    placeholder="e.g., Solving by factorization, Chloroplast structure"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="text-sm font-semibold text-slate-200 mb-3 flex items-center gap-2">
                      <ListOrdered className="w-4 h-4 text-purple-400" />
                      Number of Questions
                    </label>
                    <select
                      value={aiForm.numberOfQuestions}
                      onChange={(e) => setAiForm({ ...aiForm, numberOfQuestions: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 bg-slate-700/50 backdrop-blur-lg border border-slate-600/50 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/50 text-slate-100 font-medium shadow-lg transition-all duration-200"
                    >
                      <option value={3}>3 Questions</option>
                      <option value={5}>5 Questions</option>
                      <option value={10}>10 Questions</option>
                      <option value={15}>15 Questions</option>
                      <option value={20}>20 Questions</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-3">
                      Difficulty Level
                    </label>
                    <select
                      value={aiForm.difficulty}
                      onChange={(e) => setAiForm({ ...aiForm, difficulty: e.target.value as 'easy' | 'medium' | 'hard' })}
                      className="w-full px-4 py-3 bg-slate-700/50 backdrop-blur-lg border border-slate-600/50 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/50 text-slate-100 font-medium shadow-lg transition-all duration-200"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-3">
                      Question Type
                    </label>
                    <select
                      value={aiForm.questionType}
                      onChange={(e) => setAiForm({ ...aiForm, questionType: e.target.value as 'factual' | 'conceptual' | 'analytical' | 'mixed' })}
                      className="w-full px-4 py-3 bg-slate-700/50 backdrop-blur-lg border border-slate-600/50 rounded-xl focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/50 text-slate-100 font-medium shadow-lg transition-all duration-200"
                    >
                      <option value="mixed">Mixed</option>
                      <option value="factual">Factual</option>
                      <option value="conceptual">Conceptual</option>
                      <option value="analytical">Analytical</option>
                    </select>
                  </div>
                </div>

                {/* Modal Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-700/50">
                  <button
                    type="button"
                    onClick={() => setShowAIModal(false)}
                    className="flex-1 sm:flex-none px-6 py-3 border border-slate-600/50 text-slate-300 font-semibold rounded-xl bg-slate-700/30 hover:bg-slate-700/50 backdrop-blur-lg transition-all duration-200 shadow-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAIGeneration}
                    disabled={aiGenerating || !aiForm.subject || !aiForm.topic || !aiForm.className}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    {aiGenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Generate Questions
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-6 max-w-sm w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-red-400" />
                Confirm Deletion
              </h2>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="text-slate-300 hover:text-slate-100 transition-colors duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="text-slate-300 mb-6">
              Are you sure you want to delete this material? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-slate-600/50 text-slate-300 font-semibold rounded-xl bg-slate-700/30 hover:bg-slate-700/50 backdrop-blur-lg transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => materialToDelete && handleDelete(materialToDelete)}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

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
              onClick={() => router.push(`/teacher/dashboard`)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-3 py-2 rounded-lg text-sm transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Dashboard</span>
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
                Free Materials
              </h1>
              <p className="text-slate-300 mt-1 font-medium">Manage and create educational resources</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        <div className="space-y-6">
          {/* Create/Edit Form */}
          {(showCreateForm || editingMaterial) && (
            <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50">
              <div className="p-6 sm:p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-400" />
                    {editingMaterial ? 'Edit Material' : 'Create New Material'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowCreateForm(false);
                      setEditingMaterial(null);
                      resetForm();
                    }}
                    className="text-slate-300 hover:text-slate-100 transition-colors duration-200"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={editingMaterial ? handleUpdate : handleCreate} className="space-y-6">
                  {/* Material Type Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-3 flex items-center gap-1">
                      <HelpCircle className="w-4 h-4 text-blue-400" />
                      Material Type <span className="text-red-400">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <label className={`relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${form.type === 'mcq'
                        ? 'border-blue-500/70 bg-blue-500/10 backdrop-blur-lg'
                        : 'border-slate-600/50 bg-slate-700/30 backdrop-blur-lg hover:border-slate-500/70'
                        }`}>
                        <input
                          type="radio"
                          value="mcq"
                          checked={form.type === 'mcq'}
                          onChange={(e) => setForm({ ...form, type: e.target.value as 'mcq' | 'notes' })}
                          className="sr-only"
                        />
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${form.type === 'mcq'
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-slate-400'
                            }`}>
                            {form.type === 'mcq' && (
                              <div className="w-2 h-2 rounded-full bg-white"></div>
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-100">MCQ Question</div>
                            <div className="text-sm text-slate-300">Create multiple choice questions</div>
                          </div>
                        </div>
                      </label>

                      <label className={`relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${form.type === 'notes'
                        ? 'border-blue-500/70 bg-blue-500/10 backdrop-blur-lg'
                        : 'border-slate-600/50 bg-slate-700/30 backdrop-blur-lg hover:border-slate-500/70'
                        }`}>
                        <input
                          type="radio"
                          value="notes"
                          checked={form.type === 'notes'}
                          onChange={(e) => setForm({ ...form, type: e.target.value as 'mcq' | 'notes' })}
                          className="sr-only"
                        />
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${form.type === 'notes'
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-slate-400'
                            }`}>
                            {form.type === 'notes' && (
                              <div className="w-2 h-2 rounded-full bg-white"></div>
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-100">Notes Link</div>
                            <div className="text-sm text-slate-300">Share study notes via link</div>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Topic */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-200 mb-3">
                      Topic <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.topic}
                      onChange={(e) => setForm({ ...form, topic: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-700/50 backdrop-blur-lg border border-slate-600/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 text-slate-100 placeholder-slate-400 font-medium shadow-lg transition-all duration-200"
                      placeholder="Enter topic..."
                      required
                    />
                  </div>

                  {/* MCQ Fields */}
                  {form.type === 'mcq' && (
                    <>
                      <div>
                        <label className="block text-sm font-semibold text-slate-200 mb-2">
                          Question Text <span className="text-red-400">*</span>
                        </label>
                        <textarea
                          value={form.question}
                          onChange={(e) => setForm({ ...form, question: e.target.value })}
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
                              value={form[`option${option}` as keyof CreateMaterialForm]}
                              onChange={(e) => setForm({ ...form, [`option${option}`]: e.target.value })}
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
                          value={form.correctAns}
                          onChange={(e) => setForm({ ...form, correctAns: e.target.value })}
                          className="w-full px-4 py-3 bg-slate-700/50 backdrop-blur-lg border border-slate-600/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 text-slate-100 font-medium shadow-lg transition-all duration-200"
                          required
                        >
                          <option value="A">Option A</option>
                          <option value="B">Option B</option>
                          <option value="C">Option C</option>
                          <option value="D">Option D</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-200 mb-2">
                          Explanation
                        </label>
                        <textarea
                          value={form.explanation}
                          onChange={(e) => setForm({ ...form, explanation: e.target.value })}
                          className="w-full px-4 py-3 bg-slate-700/50 backdrop-blur-lg border border-slate-600/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 text-slate-100 placeholder-slate-400 font-medium shadow-lg transition-all duration-200"
                          rows={4}
                          placeholder="Enter explanation (optional)..."
                        />
                      </div>
                    </>
                  )}

                  {/* Notes Link Field */}
                  {form.type === 'notes' && (
                    <div>
                      <label className="block text-sm font-semibold text-slate-200 mb-3">
                        Notes Link <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="url"
                        value={form.notesLink}
                        onChange={(e) => setForm({ ...form, notesLink: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-700/50 backdrop-blur-lg border border-slate-600/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400/50 text-slate-100 placeholder-slate-400 font-medium shadow-lg transition-all duration-200"
                        placeholder="https://..."
                        required
                      />
                      <p className="text-sm text-slate-400 mt-2 font-medium">
                        Ensure the link is accessible to users.
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateForm(false);
                        setEditingMaterial(null);
                        resetForm();
                      }}
                      className="flex-1 sm:flex-none px-6 py-3 border border-slate-600/50 text-slate-300 font-semibold rounded-xl bg-slate-700/30 hover:bg-slate-700/50 backdrop-blur-lg transition-all duration-200 shadow-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <Save className="w-5 h-5" />
                      {submitting ? 'Saving...' : (editingMaterial ? 'Update Material' : 'Create Material')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Materials List */}
        <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 mb-6">
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                All Materials ({filteredMaterials.length})
              </h2>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <select
                  value={filterType}
                  onChange={(e) => {
                    setFilterType(e.target.value as 'all' | 'mcq' | 'notes');
                    setCurrentPage(1);
                  }}
                  className="px-4 py-2 bg-slate-700/50 backdrop-blur-lg border border-slate-600/50 rounded-xl text-slate-100 font-medium shadow-lg transition-all duration-200"
                >
                  <option value="all">All Types</option>
                  <option value="mcq">MCQ Questions</option>
                  <option value="notes">Notes Links</option>
                </select>
                {!showCreateForm && !editingMaterial && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowAIModal(true)}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                    >
                      <Sparkles className="w-4 h-4" />
                      Generate with AI
                    </button>
                    <button
                      onClick={handleAddQuestion}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      Add Question
                    </button>
                    <button
                      onClick={handleAddLink}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      Add Link
                    </button>
                  </div>
                )}
              </div>
            </div>

            {paginatedMaterials.length === 0 ? (
              <div className="text-center py-12 bg-slate-700/30 backdrop-blur-lg rounded-xl border border-slate-600/50">
                <HelpCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-200 mb-2">No materials found</h3>
                <p className="text-slate-400 font-medium">Click &quot;Generate with AI&quot;, &quot;Add Question&quot; or &quot;Add Link&quot; to add your first resource.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {paginatedMaterials.map((material) => (
                  <div key={material.id} className="bg-slate-700/30 backdrop-blur-lg rounded-xl border border-slate-600/50 overflow-hidden">
                    <div className="bg-slate-800/50 px-4 py-3 flex items-center justify-between">
                      <h4 className="font-semibold text-slate-100">{material.topic}</h4>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(material)}
                          className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors duration-200 font-medium"
                        >
                          <Edit2 className="w-4 h-4" />
                          <span className="hidden sm:inline">Edit</span>
                        </button>
                        <button
                          onClick={() => openDeleteModal(material.id)}
                          className="inline-flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors duration-200 font-medium"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="hidden sm:inline">Delete</span>
                        </button>
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      <p className="text-sm text-slate-400">
                        Created by {material.creator.name} • {new Date(material.createdAt).toLocaleDateString()}
                      </p>

                      {material.question && (
                        <div className="space-y-2">
                          <p className="font-medium text-slate-100">{material.question}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            <p className="text-sm text-slate-300">A) {material.optionA}</p>
                            <p className="text-sm text-slate-300">B) {material.optionB}</p>
                            <p className="text-sm text-slate-300">C) {material.optionC}</p>
                            <p className="text-sm text-slate-300">D) {material.optionD}</p>
                          </div>
                          <p className="text-sm font-medium text-green-400">
                            Correct Answer: {material.correctAns}
                          </p>
                          {material.explanation && (
                            <p className="text-sm text-slate-400">
                              <strong>Explanation:</strong> {material.explanation}
                            </p>
                          )}
                        </div>
                      )}

                      {material.notesLink && (
                        <p className="text-sm text-slate-300">
                          <strong>Notes:</strong>{' '}
                          <a
                            href={material.notesLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                          >
                            {material.notesLink}
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex justify-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-slate-100">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Guidelines Section */}
        <div className="bg-blue-500/10 backdrop-blur-lg border border-blue-400/30 rounded-xl p-4">
          <h3 className="font-semibold text-blue-200 mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Material Guidelines
          </h3>
          <ul className="text-blue-100 text-sm space-y-1 font-medium">
            <li>• Use AI generation for quick creation of multiple questions</li>
            <li>• Provide clear and relevant topics for materials</li>
            <li>• For MCQs, ensure questions and options are distinct and unambiguous</li>
            <li>• For notes, verify that links are accessible and functional</li>
            <li>• Include explanations for MCQs where applicable</li>
            <li>• Review all content before submission</li>
          </ul>
        </div>
      </main>

      {/* Loading Overlay */}
      {(loading || submitting || aiGenerating) && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 flex items-center justify-center">
          <LoadingSpinner message={
            loading ? "Loading materials..." : 
            aiGenerating ? "Generating questions with AI..." : 
            "Saving material..."
          } />
        </div>
      )}
    </div>
  );
}