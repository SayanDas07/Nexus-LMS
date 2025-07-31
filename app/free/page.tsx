/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp, BookOpen, FileText, ExternalLink, CheckCircle, XCircle, ArrowLeft, ArrowRight, Trophy, Target, Clock, Award } from "lucide-react";
import { Toaster } from "sonner";
import { useRouter } from "next/navigation";

// Reusing the ProfessionalAnimatedBackground and LoadingSpinner //This the Animation
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

interface Question {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
}

interface FreeMaterial {
    id: string;
    topic: string;
    question?: string | null;
    optionA?: string | null;
    optionB?: string | null;
    optionC?: string | null;
    optionD?: string | null;
    correctAns?: string | null;
    explanation?: string | null;
    notesLink?: string | null;
    createdAt: string;
    creator: {
        name: string;
        email: string;
    };
}

export default function MCQTestPage() {
    const [freeMaterials, setFreeMaterials] = useState<FreeMaterial[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentView, setCurrentView] = useState<"mcq" | "notes">("mcq");
    const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: number }>({});
    const [showResults, setShowResults] = useState(false);
    const [testSubmitted, setTestSubmitted] = useState(false);
    const [expandedTopics, setExpandedTopics] = useState<{ [key: string]: boolean }>({});

    const router = useRouter();

    useEffect(() => {
        fetchFreeMaterials();
    }, []);

    const fetchFreeMaterials = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch("/api/freematerial");
            const result = await response.json();
            if (result.success) {
                setFreeMaterials(result.data);
            } else {
                setError("Failed to fetch materials");
            }
        } catch (error) {
            console.error("Error fetching free materials:", error);
            setError("Network error occurred");
        } finally {
            setLoading(false);
        }
    };

    const groupedMCQs = freeMaterials
        .filter((material) => material.question && material.optionA && material.optionB && material.optionC && material.optionD)
        .reduce((acc, material, index) => {
            const topic = material.topic;
            if (!acc[topic]) acc[topic] = [];
            acc[topic].push({
                // Use a combination of topic and index to ensure unique IDs
                id: `${topic}_${index}_${material.id}`,
                question: material.question!,
                options: [material.optionA!, material.optionB!, material.optionC!, material.optionD!],
                correctAnswer: material.correctAns === "A" ? 0 : material.correctAns === "B" ? 1 : material.correctAns === "C" ? 2 : 3,
                explanation: material.explanation || "No explanation provided",
            });
            return acc;
        }, {} as { [key: string]: Question[] });

    const groupedNotes = freeMaterials
        .filter((material) => material.notesLink && !material.question)
        .reduce((acc, material) => {
            const topic = material.topic;
            if (!acc[topic]) acc[topic] = [];
            acc[topic].push({
                title: `${topic} Study Guide`,
                link: material.notesLink!,
                createdAt: material.createdAt,
            });
            return acc;
        }, {} as { [key: string]: { title: string; link: string; createdAt: string }[] });

    const getCurrentTopicQuestions = () => (selectedTopic ? groupedMCQs[selectedTopic] || [] : []);

    const handleAnswerSelect = (questionId: string, answerIndex: number) => {
        if (testSubmitted) return;

        console.log('Selecting answer:', questionId, answerIndex); // Debug log

        setSelectedAnswers((prev) => {
            const newAnswers = { ...prev };
            newAnswers[questionId] = answerIndex;
            console.log('Updated answers:', newAnswers); // Debug log
            return newAnswers;
        });
    };

    const handleSubmitTest = () => {
        setTestSubmitted(true);
        setShowResults(true);
    };

    const calculateScore = () => {
        const questions = getCurrentTopicQuestions();
        const correct = questions.filter((q) => selectedAnswers[q.id] === q.correctAnswer).length;
        return { correct, total: questions.length };
    };

    const resetTest = () => {
        setSelectedAnswers({});
        setTestSubmitted(false);
        setShowResults(false);
        setCurrentQuestionIndex(0);
    };

    const toggleTopic = (topic: string) => {
        setExpandedTopics((prev) => ({ ...prev, [topic]: !prev[topic] }));
    };

    const getScoreColor = (percentage: number) => {
        if (percentage >= 80) return "text-emerald-300";
        if (percentage >= 60) return "text-amber-300";
        return "text-red-300";
    };

    const getScoreIcon = (percentage: number) => {
        if (percentage >= 80) return <Trophy className="w-6 h-6 text-emerald-400" />;
        if (percentage >= 60) return <Award className="w-6 h-6 text-amber-400" />;
        return <Target className="w-6 h-6 text-red-400" />;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
                <ProfessionalAnimatedBackground />
                <div className="relative z-10">
                    <LoadingSpinner message="Loading materials..." />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
                <ProfessionalAnimatedBackground />
                <div className="relative z-10 flex justify-center items-center h-64">
                    <div className="bg-slate-800/60 backdrop-blur-lg border border-slate-600/50 rounded-xl p-6 text-center">
                        <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                        <div className="text-lg font-semibold text-red-300">Error: {error}</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pb-16 md:pb-0 relative overflow-hidden">
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
                            onClick={() => router.push('/')}
                            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-3 py-2 rounded-lg text-sm transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span className="hidden sm:inline">Back</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
                {/* View Toggle (Desktop) */}
                <div className="bg-slate-800/40 backdrop-blur-lg border-b border-slate-700/50 hidden md:block mb-6">
                    <div className="flex justify-center">
                        <div className="bg-slate-800/60 p-1 rounded-xl flex space-x-1">
                            <button
                                onClick={() => setCurrentView("mcq")}
                                className={`px-6 py-3 rounded-lg flex items-center space-x-2 font-medium transition-all duration-200 ${currentView === "mcq" ? "bg-slate-700/50 text-blue-300 shadow-lg" : "text-slate-400 hover:text-slate-200"
                                    }`}
                            >
                                <FileText size={20} />
                                <span>Practice Tests</span>
                                <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full text-sm">{Object.keys(groupedMCQs).length}</span>
                            </button>
                            <button
                                onClick={() => setCurrentView("notes")}
                                className={`px-6 py-3 rounded-lg flex items-center space-x-2 font-medium transition-all duration-200 ${currentView === "notes" ? "bg-slate-700/50 text-emerald-300 shadow-lg" : "text-slate-400 hover:text-slate-200"
                                    }`}
                            >
                                <BookOpen size={20} />
                                <span>Study Materials</span>
                                <span className="bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded-full text-sm">{Object.keys(groupedNotes).length}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 p-6">
                    {currentView === "mcq" && (
                        <div>
                            {Object.keys(groupedMCQs).length === 0 ? (
                                <div className="text-center py-12">
                                    <FileText className="mx-auto h-12 w-12 text-slate-400" />
                                    <h3 className="mt-2 text-sm font-semibold text-slate-200">No Practice Tests Available</h3>
                                    <p className="mt-1 text-sm text-slate-400">Check back later for new practice tests.</p>
                                </div>
                            ) : !selectedTopic ? (
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-100 mb-2">Choose Your Topic</h2>
                                    <p className="text-slate-400 mb-6">Select a topic to start practicing with interactive quizzes</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {Object.keys(groupedMCQs).map((topic) => (
                                            <button
                                                key={topic}
                                                onClick={() => setSelectedTopic(topic)}
                                                className="border border-slate-600/50 bg-slate-700/30 backdrop-blur-lg rounded-xl p-4 hover:shadow-xl hover:bg-slate-700/50 transition-all duration-300 hover:scale-[1.02]"
                                            >
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                                        <Target className="w-5 h-5 text-blue-300" />
                                                    </div>
                                                    <ArrowRight className="w-5 h-5 text-slate-400" />
                                                </div>
                                                <h3 className="text-lg font-bold text-slate-100">{topic}</h3>
                                                <p className="text-sm text-slate-400">{groupedMCQs[topic].length} questions available</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                                        <div>
                                            <button
                                                onClick={() => {
                                                    setSelectedTopic(null);
                                                    resetTest();
                                                }}
                                                className="flex items-center gap-2 text-blue-300 hover:text-blue-200 mb-3"
                                            >
                                                <ArrowLeft size={18} />
                                                <span>Back to Topics</span>
                                            </button>
                                            <h2 className="text-2xl font-bold text-slate-100">{selectedTopic}</h2>
                                            <p className="text-slate-400">{getCurrentTopicQuestions().length} questions</p>
                                        </div>
                                        {testSubmitted && (
                                            <button
                                                onClick={resetTest}
                                                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium"
                                            >
                                                Take Test Again
                                            </button>
                                        )}
                                    </div>
                                    <div className="space-y-4">
                                        {getCurrentTopicQuestions().map((question, index) => (
                                            <div key={question.id} className="border border-slate-600/50 bg-slate-700/30 backdrop-blur-lg rounded-xl p-4 hover:shadow-xl transition-all duration-300">
                                                <div className="flex items-start gap-3 mb-4">
                                                    <span className="bg-blue-500/20 text-blue-300 px-3 py-2 rounded-lg text-sm font-semibold">{index + 1}</span>
                                                    <h3 className="text-lg font-medium text-slate-100 flex-1">{question.question}</h3>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-12">
                                                    {question.options.map((option, optionIndex) => {
                                                        const isSelected = selectedAnswers[question.id] === optionIndex;
                                                        const isCorrect = optionIndex === question.correctAnswer;
                                                        const showCorrect = testSubmitted && isCorrect;
                                                        const showIncorrect = testSubmitted && isSelected && !isCorrect;
                                                        return (
                                                            <button
                                                                key={`${question.id}_${optionIndex}`}
                                                                onClick={() => handleAnswerSelect(question.id, optionIndex)}
                                                                disabled={testSubmitted}
                                                                className={`p-3 text-left rounded-lg border transition-all duration-200 ${showCorrect
                                                                    ? "bg-emerald-500/20 border-emerald-400/30 text-emerald-300"
                                                                    : showIncorrect
                                                                        ? "bg-red-500/20 border-red-400/30 text-red-300"
                                                                        : isSelected
                                                                            ? "bg-blue-500/20 border-blue-400/30 text-blue-300"
                                                                            : "bg-slate-700/50 border-slate-600/50 hover:bg-slate-600/50 text-slate-200"
                                                                    }`}
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    {showCorrect && <CheckCircle size={16} className="text-emerald-400" />}
                                                                    {showIncorrect && <XCircle size={16} className="text-red-400" />}
                                                                    <span>{option}</span>
                                                                </div>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                                {testSubmitted && (
                                                    <div className="mt-4 ml-12 p-3 bg-amber-500/20 border border-amber-400/30 rounded-lg">
                                                        <p className="text-sm text-amber-300">
                                                            <strong>Explanation:</strong> {question.explanation}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    {!testSubmitted ? (
                                        <div className="mt-6 text-center">
                                            <button
                                                onClick={handleSubmitTest}
                                                disabled={Object.keys(selectedAnswers).length !== getCurrentTopicQuestions().length}
                                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:bg-slate-600/50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                                            >
                                                Submit Test
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="mt-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-400/30 rounded-xl p-6 text-center">
                                            <div className="flex justify-center mb-4">{getScoreIcon(Math.round((calculateScore().correct / calculateScore().total) * 100))}</div>
                                            <h3 className="text-xl font-bold text-slate-100 mb-2">Test Complete!</h3>
                                            <p className={`text-2xl font-bold ${getScoreColor(Math.round((calculateScore().correct / calculateScore().total) * 100))}`}>
                                                {calculateScore().correct}/{calculateScore().total}
                                            </p>
                                            <p className="text-slate-400">{Math.round((calculateScore().correct / calculateScore().total) * 100)}% Score</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {currentView === "notes" && (
                        <div>
                            <h2 className="text-2xl font-bold text-slate-100 mb-2">Study Materials</h2>
                            <p className="text-slate-400 mb-6">Access comprehensive notes and resources</p>
                            {Object.keys(groupedNotes).length === 0 ? (
                                <div className="text-center py-12">
                                    <BookOpen className="mx-auto h-12 w-12 text-slate-400" />
                                    <h3 className="mt-2 text-sm font-semibold text-slate-200">No Study Materials Available</h3>
                                    <p className="mt-1 text-sm text-slate-400">Check back later for new study resources.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {Object.entries(groupedNotes).map(([topic, materials]) => (
                                        <div key={topic} className="border border-slate-600/50 bg-slate-700/30 backdrop-blur-lg rounded-xl overflow-hidden">
                                            <button
                                                onClick={() => toggleTopic(topic)}
                                                className="w-full p-4 text-left flex items-center justify-between hover:bg-slate-700/50 transition-all duration-200"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                                                        <BookOpen className="w-5 h-5 text-emerald-300" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-bold text-slate-100">{topic}</h3>
                                                        <p className="text-sm text-slate-400">{materials.length} resources available</p>
                                                    </div>
                                                </div>
                                                <div>{expandedTopics[topic] ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}</div>
                                            </button>
                                            {expandedTopics[topic] && (
                                                <div className="border-t border-slate-600/50 p-4 bg-slate-700/50">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                        {materials.map((material, index) => (
                                                            <div key={index} className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/50">
                                                                <div className="flex items-center justify-between">
                                                                    <div>
                                                                        <h4 className="text-sm font-medium text-slate-100">{material.title}</h4>
                                                                        <p className="text-xs text-slate-400 flex items-center">
                                                                            <Clock className="w-3 h-3 mr-1" />
                                                                            {new Date(material.createdAt).toLocaleDateString()}
                                                                        </p>
                                                                    </div>
                                                                    <a
                                                                        href={material.link}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="px-3 py-1 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg text-sm hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200"
                                                                    >
                                                                        View
                                                                        <ExternalLink size={12} className="inline ml-1" />
                                                                    </a>
                                                                </div>
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

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-xl border-t border-slate-700/50 z-40 shadow-2xl">
                <div className="flex">
                    <button
                        onClick={() => setCurrentView("mcq")}
                        className={`flex-1 flex flex-col items-center justify-center py-2 px-1 transition-all duration-200 ${currentView === "mcq" ? "text-blue-300 border-t-2 border-blue-400" : "text-slate-400 hover:text-slate-200"
                            }`}
                    >
                        <FileText className="w-5 h-5 mb-1" />
                        <span className="text-xs font-semibold">Practice</span>
                        <span className="text-xs text-slate-400">({Object.keys(groupedMCQs).length})</span>
                    </button>
                    <button
                        onClick={() => setCurrentView("notes")}
                        className={`flex-1 flex flex-col items-center justify-center py-2 px-1 transition-all duration-200 ${currentView === "notes" ? "text-emerald-300 border-t-2 border-emerald-400" : "text-slate-400 hover:text-slate-200"
                            }`}
                    >
                        <BookOpen className="w-5 h-5 mb-1" />
                        <span className="text-xs font-semibold">Notes</span>
                        <span className="text-xs text-slate-400">({Object.keys(groupedNotes).length})</span>
                    </button>
                </div>
            </nav>

            <Toaster
                position="top-center"
                toastOptions={{
                    style: {
                        background: "rgba(30, 41, 59, 0.9)",
                        color: "white",
                        border: "1px solid rgba(148, 163, 184, 0.3)",
                        backdropFilter: "blur(12px)",
                    },
                    className: "text-sm font-medium",
                }}
                richColors
                closeButton
            />
        </div>
    );
}