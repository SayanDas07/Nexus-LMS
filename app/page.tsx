/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  BookOpen,
  Users,
  Video,
  Award,
  ArrowRight,
  CheckCircle,
  Zap,
  Target,
  X,
  Clock,
  MessageCircle,
  Phone,
  Mail,
} from "lucide-react";
import Head from "next/head";
import Link from "next/link";
// Type declarations for Vanta.js WAVES
declare global {
  interface Window {
    VANTA: {
      WAVES: (options: {
        el: string | HTMLElement;
        mouseControls?: boolean;
        touchControls?: boolean;
        gyroControls?: boolean;
        minHeight?: number;
        minWidth?: number;
        scale?: number;
        scaleMobile?: number;
        color?: number;
        shininess?: number;
        waveHeight?: number;
        waveSpeed?: number;
        zoom?: number;
      }) => {
        destroy: () => void;
      };
    };
    THREE: unknown;
  }
}

export default function VantaWavesBackground() {
  const vantaRef = useRef<HTMLDivElement>(null);
  const vantaEffect = useRef<ReturnType<typeof window.VANTA.WAVES> | null>(
    null
  );
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  // Smart Board Animation States
  const [boardText, setBoardText] = useState("");
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isWriting, setIsWriting] = useState(true);
  const [boardCursorVisible, setBoardCursorVisible] = useState(true);

const phrases = React.useMemo(
  () => [
    "Learn Effectively",
    "Master Concepts",
    "Build Knowledge",
    "Achieve Excellence",
  ],
  []
);

const staticSuffix = "Nexus LMS";

// Smart Board Content for All Subjects
const classroomLessons = React.useMemo(
  () => [
    {
      title: "Mathematics",
      content:
        "Quadratic Formula:\nx = (-b ± √(b²-4ac)) / 2a\n\nExample: x² + 5x + 6 = 0\na=1, b=5, c=6\nSolutions: x = -2 or x = -3",
    },
    {
      title: "Science Lab",
      content:
        "Scientific Method:\n1. Observation\n2. Hypothesis\n3. Experiment\n4. Analysis\n5. Conclusion\nRemember: Control variables!",
    },
    {
      title: "History Timeline",
      content:
        "World War II (1939-1945)\n• 1939: Germany invades Poland\n• 1941: Pearl Harbor attack\n• 1944: D-Day landings\n• 1945: War ends in Europe & Pacific",
    },
    {
      title: "Literature Analysis",
      content:
        "Literary Devices:\n• Metaphor: Direct comparison\n• Simile: Uses 'like' or 'as'\n• Symbolism: Hidden meanings\n• Irony: Contrast between expectation and reality",
    },
    {
      title: "Computer Science",
      content:
        "Algorithm Basics:\nfunction binarySearch(arr, target) {\n  let left = 0, right = arr.length - 1;\n  while (left <= right) {\n    // Implementation here\n  }\n}",
    },
    {
      title: "Geography",
      content:
        "Climate Zones:\n• Tropical: Hot, humid year-round\n• Temperate: Moderate temperatures\n• Polar: Cold, dry conditions\n• Arid: Low precipitation",
    },
  ],
  []
);

  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);

  useEffect(() => {
    const typingSpeed = isDeleting ? 50 : 100;
    const currentPhrase = phrases[currentPhraseIndex];

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing phase
        if (currentIndex < currentPhrase.length) {
          setDisplayText(currentPhrase.substring(0, currentIndex + 1));
          setCurrentIndex(currentIndex + 1);
        } else {
          // Hold for 3 seconds after typing completes
          setTimeout(() => setIsDeleting(true), 3000);
        }
      } else {
        // Deleting phase
        if (currentIndex > 0) {
          setDisplayText(currentPhrase.substring(0, currentIndex - 1));
          setCurrentIndex(currentIndex - 1);
        } else {
          setIsDeleting(false);
          setCurrentPhraseIndex((currentPhraseIndex + 1) % phrases.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [currentIndex, isDeleting, currentPhraseIndex, phrases]);

  // Cursor blink effect
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(blinkInterval);
  }, []);

  // Smart Board Animation Effect
  useEffect(() => {
    const currentLesson = classroomLessons[currentLessonIndex];
    const fullText = `${currentLesson.title}\n\n${currentLesson.content}`;

    if (isWriting) {
      if (currentCharIndex < fullText.length) {
        const timeout = setTimeout(() => {
          setBoardText(fullText.substring(0, currentCharIndex + 1));
          setCurrentCharIndex(currentCharIndex + 1);
        }, 80); // Writing speed
        return () => clearTimeout(timeout);
      } else {
        // Hold text for 4 seconds then move to next lesson
        const holdTimeout = setTimeout(() => {
          setIsWriting(false);
          setCurrentCharIndex(0);
          setBoardText("");
          setCurrentLessonIndex((prev) => (prev + 1) % classroomLessons.length);
          setTimeout(() => setIsWriting(true), 500);
        }, 4000);
        return () => clearTimeout(holdTimeout);
      }
    }
  }, [currentCharIndex, isWriting, currentLessonIndex, classroomLessons]);

  // Board cursor blink
  useEffect(() => {
    const interval = setInterval(() => {
      setBoardCursorVisible((prev) => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let threeScript: HTMLScriptElement | null = null;
    let vantaScript: HTMLScriptElement | null = null;

    const initVanta = () => {
      if (window.VANTA && vantaRef.current && !vantaEffect.current) {
        vantaEffect.current = window.VANTA.WAVES({
          el: vantaRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          color: 0x130a13,
          shininess: 50,
          waveHeight: 20,
          waveSpeed: 1.0,
          zoom: 0.75,
        });
      } else {
        console.error("Vanta initialization failed:", {
          VANTA: window.VANTA,
          ref: vantaRef.current,
        });
      }
    };

    if (!window.THREE) {
      threeScript = document.createElement("script");
      threeScript.src =
        "https://cdnjs.cloudflare.com/ajax/libs/three.js/r121/three.min.js";
      threeScript.async = true;
      threeScript.onload = () => {
        vantaScript = document.createElement("script");
        vantaScript.src =
          "https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.waves.min.js";
        vantaScript.async = true;
        vantaScript.onload = initVanta;
        document.body.appendChild(vantaScript);
      };
      document.body.appendChild(threeScript);
    } else if (!window.VANTA?.WAVES) {
      vantaScript = document.createElement("script");
      vantaScript.src =
        "https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.waves.min.js";
      vantaScript.async = true;
      vantaScript.onload = initVanta;
      document.body.appendChild(vantaScript);
    } else {
      initVanta();
    }

    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
      }
      if (threeScript && document.body.contains(threeScript)) {
        document.body.removeChild(threeScript);
      }
      if (vantaScript && document.body.contains(vantaScript)) {
        document.body.removeChild(vantaScript);
      }
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: <Video className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Class Interaction",
      description:
        "Join live sessions and ask doubts instantly via Google Meet",
      highlight: "🎥Interactive",
    },
    {
      icon: <BookOpen className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Quality Materials",
      description:
        "Access expert-made notes, grammar guides, and practice sets",
      highlight: "📘 Expert Content",
    },
    {
      icon: <Target className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Student Score Checker",
      description: "Track your performance with personal progress insights",
      highlight: "📈 Score Tracker",
    },
    {
      icon: <Award className="w-6 h-6 sm:w-8 sm:h-8" />,
      title: "Free Resources",
      description: "Enjoy high-quality materials and MCQs completely free",
      highlight: "🎁 100% Free",
    },
  ];

  const stats = [
    { value: "100+", label: "Active Students", color: "text-purple-400" },
    { value: "95%", label: "Success Rate", color: "text-pink-400" },
    { value: "5★", label: "Rating", color: "text-yellow-400" },
  ];

  return (
    <div className="relative min-h-screen text-white overflow-x-hidden">
      <Head>
        <title>Nexus LMS | Expert Tutoring for Academic Success</title>
        <meta
          name="description"
          content="Transform your learning journey with personalized tutoring from expert educators at Nexus LMS."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Vanta.js Cloud2 Background */}
      <div
        ref={vantaRef}
        className="fixed top-0 left-0 w-full h-screen z-0 !min-h-screen"
      />

      {/* Content wrapper */}
      <div className="relative z-10">
        {/* Header */}
        <nav
          className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
            isScrolled
              ? "bg-slate-900/90 backdrop-blur-md border-b border-purple-500/20 shadow-2xl"
              : "bg-transparent"
          }`}
        >
          <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center shadow-lg">
                <BookOpen className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Nexus LMS
              </span>
            </div>

            <div className="hidden md:flex space-x-6 lg:space-x-8">
              <a
                href="#features"
                className="hover:text-purple-400 transition-colors text-sm lg:text-base relative group"
              >
                Features
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a
                href="#testimonials"
                className="hover:text-purple-400 transition-colors text-sm lg:text-base relative group"
              >
                Success Stories
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a
                href="#contact"
                className="hover:text-purple-400 transition-colors text-sm lg:text-base relative group"
              >
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 group-hover:w-full transition-all duration-300"></span>
              </a>
            </div>

            {/* <Link href="/sign-up" className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-2 rounded-lg font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all">
              <span>Register Here!</span>
             
            </Link> */}

            <button
              className={`md:hidden p-2 rounded-lg transition-all duration-300 z-[60] relative ${
                mobileMenuOpen
                  ? "bg-purple-500 shadow-lg scale-110"
                  : "hover:bg-purple-500/20"
              }`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <div className="relative w-6 h-6">
                <span
                  className={`absolute top-0 left-0 w-6 h-0.5 bg-white transition-all duration-300 ${
                    mobileMenuOpen ? "rotate-45 top-3" : ""
                  }`}
                />
                <span
                  className={`absolute top-2 left-0 w-6 h-0.5 bg-white transition-all duration-300 ${
                    mobileMenuOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`absolute top-4 left-0 w-6 h-0.5 bg-white transition-all duration-300 ${
                    mobileMenuOpen ? "-rotate-45 top-3" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] md:hidden transition-opacity duration-300"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="fixed top-0 right-0 bottom-0 w-80 z-[60] md:hidden transform transition-transform duration-300">
              <div className="h-full bg-gradient-to-b from-slate-900/98 to-purple-900/98 backdrop-blur-md border-l border-purple-500/30 shadow-2xl overflow-y-auto">
                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Nexus LMS
                      </span>
                    </div>
                    <button
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <a
                      href="#features"
                      className="flex items-center space-x-3 text-lg font-medium hover:text-purple-400 hover:bg-purple-500/10 transition-all py-3 px-4 rounded-xl group"
                    >
                      <Target className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span>Features</span>
                    </a>
                    <a
                      href="#testimonials"
                      className="flex items-center space-x-3 text-lg font-medium hover:text-purple-400 hover:bg-purple-500/10 transition-all py-3 px-4 rounded-xl group"
                    >
                      <Users className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span>Success Stories</span>
                    </a>
                    <a
                      href="#contact"
                      className="flex items-center space-x-3 text-lg font-medium hover:text-purple-400 hover:bg-purple-500/10 transition-all py-3 px-4 rounded-xl group"
                    >
                      <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span>Contact</span>
                    </a>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-white">Get in Touch</h3>
                    <a
                      href="tel:+919674921594"
                      className="flex items-center space-x-3 text-green-400 hover:text-green-300 hover:bg-green-500/10 transition-all py-3 px-4 rounded-xl group"
                    >
                      <Phone className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <div>
                        <div className="font-medium">Call Now</div>
                        <div className="text-sm text-gray-400">
                          +91 9330352190
                        </div>
                      </div>
                    </a>
                    <a
                      href="mailto:nexuscrew.official.team@gmail.com"
                      className="flex items-center space-x-3 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 transition-all py-3 px-4 rounded-xl group"
                    >
                      <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <div>
                        <div className="font-medium">Email</div>
                        <div className="text-sm text-gray-400">
                          nexuscrew.official.team@gmail.com
                        </div>
                      </div>
                    </a>
                  </div>

                  <a
                    href="#contact"
                    className="block w-full bg-gradient-to-r from-purple-600 to-pink-600 py-3 rounded-lg font-semibold text-center hover:shadow-lg hover:shadow-purple-500/30 transition-all"
                  >
                    Contact
                  </a>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Hero Section */}
        <section className="relative z-10 pt-32 pb-20 sm:pt-40 sm:pb-28 lg:pt-48 lg:pb-36">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-7xl mx-auto">
              <div className="space-y-6 sm:space-y-8">
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-full px-4 py-2 border border-purple-500/30 shadow-lg">
                  <Zap className="w-4 h-4 text-yellow-400 animate-pulse" />
                  <span className="text-sm font-medium">
                    Transform Your Learning Journey
                  </span>
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                  <div className="mb-2 min-h-[1em] flex items-center">
                    {displayText}
                    <span
                      className={`inline-block w-1 h-8 bg-purple-400 ml-1 transition-opacity duration-300 ${
                        showCursor ? "opacity-100" : "opacity-0"
                      }`}
                    ></span>
                  </div>
                  <div className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                    {staticSuffix}
                  </div>
                </h1>

                <p className="text-lg lg:text-xl text-gray-300 leading-relaxed max-w-lg">
                  Personalized tutoring that empowers students to excel in
                  academics, build confidence, and achieve their goals.
                </p>

                <div className="flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      href="/sign-up"
                      className="group flex items-center justify-center space-x-3 px-8 py-4 rounded-xl font-semibold text-lg text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-105 active:scale-95 transition-all"
                    >
                      Register Now
                    </Link>
                    <Link
                      href="/sign-in"
                      className="group flex items-center justify-center space-x-3 px-8 py-4 rounded-xl font-semibold text-lg text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-105 active:scale-95 transition-all"
                    >
                      Sign In
                    </Link>
                  </div>

                  <a
                    href="/free"
                    className="group flex items-center justify-center space-x-3 px-8 py-4 rounded-xl border-2 border-purple-400/30 hover:bg-purple-500/10 active:scale-95 transition-all"
                  >
                    <span className="text-lg">Free Materials</span>
                  </a>
                </div>

                <div className="flex items-center justify-between sm:justify-start sm:space-x-12 pt-6">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center group">
                      <div
                        className={`text-2xl sm:text-3xl font-bold ${stat.color} group-hover:scale-110 transition-transform`}
                      >
                        {stat.value}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-400">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Smart Board Animation */}
              <div className="relative w-full flex justify-center lg:justify-end items-center">
                <div className="relative w-full max-w-md lg:max-w-lg">
                  {/* Smart Board Container */}
                  <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-4 sm:p-6 lg:p-8 border-4 border-slate-700 shadow-2xl hover:scale-105 transition-transform duration-300">
                    {/* Board Header */}
                    <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-slate-600">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                      <div className="text-xs text-purple-400 font-semibold bg-purple-500/20 px-2 py-1 rounded">
                        English Class
                      </div>
                    </div>

                    {/* Board Content */}
                    <div className="bg-white rounded-xl p-4 sm:p-6 lg:p-8 min-h-[200px] sm:min-h-[250px] lg:min-h-[300px] relative overflow-hidden">
                      {/* Grid Lines */}
                      <div className="absolute inset-0 opacity-10">
                        {[...Array(20)].map((_, i) => (
                          <div
                            key={i}
                            className="absolute w-full h-px bg-gray-300"
                            style={{ top: `${i * 5}%` }}
                          ></div>
                        ))}
                      </div>

                      {/* Writing Animation */}
                      <div className="relative z-10">
                        <pre className="text-slate-800 text-xs sm:text-sm lg:text-base font-mono leading-relaxed whitespace-pre-wrap break-words">
                          {boardText}
                          <span
                            className={`inline-block w-2 h-5 bg-blue-600 ml-1 transition-opacity duration-300 ${
                              boardCursorVisible ? "opacity-100" : "opacity-0"
                            }`}
                          ></span>
                        </pre>
                      </div>

                      {/* Animated Hand/Pen */}
                      <div className="absolute bottom-4 right-4 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center animate-bounce">
                        <div className="w-2 h-3 bg-white rounded-full"></div>
                      </div>
                    </div>

                    {/* Board Footer */}
                    <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                      <span className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span>Live Session</span>
                      </span>
                      <span>Interactive Whiteboard</span>
                    </div>

                    {/* Progress Indicators */}
                    <div className="mt-3 flex space-x-1">
                      {classroomLessons.map((_, index) => (
                        <div
                          key={index}
                          className={`h-1 flex-1 rounded transition-all duration-300 ${
                            index === currentLessonIndex
                              ? "bg-purple-500"
                              : "bg-slate-600"
                          }`}
                        ></div>
                      ))}
                    </div>
                  </div>

                  {/* Floating Elements */}
                  <div className="absolute -top-4 -left-4 w-8 h-8 bg-yellow-400 rounded-full animate-pulse opacity-80"></div>
                  <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-pink-400 rounded-full animate-bounce opacity-80"></div>
                  <div className="absolute top-1/4 -right-6 w-4 h-4 bg-purple-400 rounded-full animate-ping opacity-60"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="relative z-10 py-12 sm:py-16 lg:py-24"
        >
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-12 lg:mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 lg:mb-6">
                Our{" "}
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Teaching Approach
                </span>
              </h2>
              <p className="text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto">
                A proven methodology that delivers exceptional results for
                students at all levels
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`group relative p-6 lg:p-8 rounded-2xl border transition-all duration-500 hover:scale-105 active:scale-95 cursor-pointer ${
                    activeFeature === index
                      ? "bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-purple-400/50 shadow-2xl"
                      : "bg-slate-800/50 border-slate-700/50 hover:border-purple-400/30"
                  }`}
                  onMouseEnter={() => setActiveFeature(index)}
                  onMouseLeave={() => setActiveFeature(activeFeature)}
                >
                  <div className="absolute -top-3 left-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-xs px-3 py-1 rounded-full font-semibold">
                    {feature.highlight}
                  </div>

                  <div
                    className={`inline-flex p-3 rounded-xl mb-4 transition-all duration-300 ${
                      activeFeature === index
                        ? "bg-purple-500 shadow-lg scale-110"
                        : "bg-slate-700 group-hover:bg-purple-500"
                    }`}
                  >
                    {feature.icon}
                  </div>

                  <h3 className="text-xl lg:text-2xl font-semibold mb-3 group-hover:text-purple-300 transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-base text-gray-400 group-hover:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section
          id="testimonials"
          className="relative z-10 py-12 sm:py-16 lg:py-24 bg-slate-900/50"
        >
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-12 lg:mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 lg:mb-6">
                Student{" "}
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Success Stories
                </span>
              </h2>
              <p className="text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto">
                Hear from students who transformed their academic performance
                with our tutoring
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  name: "Rohit Chatterjee",
                  quote:
                    "The way grammar is taught here is far better than school. Sir focuses on every small detail we usually miss.",
                  avatar: "/testimonials.png",
                },
                {
                  name: "Sarah Fernandes",
                  quote:
                    "Notes, worksheets, practice papers—everything is well organised. It’s a complete learning system, not just tuition.",
                  avatar: "/testimonials.png",
                },
                {
                  name: "Aarav Mehta",
                  quote:
                    "The way Sir teaches grammar rules with examples and tricks is amazing. Learning feels so easy and fun now!",
                  avatar: "/testimonials.png",
                },
              ].map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 hover:border-purple-400/30 transition-all hover:scale-[1.02]"
                >
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center overflow-hidden">
                      {testimonial.avatar ? (
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.outerHTML = `
                              <div class="w-full h-full flex items-center justify-center bg-purple-600">
                                <span class="text-white font-bold">${testimonial.name.charAt(
                                  0
                                )}</span>
                              </div>
                            `;
                          }}
                        />
                      ) : (
                        <span className="text-white font-bold">
                          {testimonial.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{testimonial.name}</h4>
                      <div className="flex items-center space-x-1 text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className="w-4 h-4 fill-current"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-3 italic">
                    &quot;{testimonial.quote}&quot;
                  </p>
                  <div className="flex items-center space-x-2 text-sm text-purple-400"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative z-10 py-12 sm:py-16 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-3xl p-8 lg:p-12 border border-purple-500/30 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-4 left-4 w-8 h-8 bg-purple-400 rounded-full animate-bounce" />
                <div className="absolute top-8 right-8 w-6 h-6 bg-pink-400 rounded-full animate-pulse" />
                <div className="absolute bottom-4 left-1/3 w-4 h-4 bg-yellow-400 rounded-full animate-ping" />
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 lg:mb-6 relative z-10">
                Ready to Transform Your Learning?
              </h2>
              <p className="text-lg lg:text-xl text-gray-300 mb-8 max-w-2xl mx-auto relative z-10">
                Limited spots available for our premium tutoring program. Book
                your seat today!
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md sm:max-w-none mx-auto relative z-10">
                <a
                  href="https://wa.me/919330352190"
                  className="group bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 lg:px-10 lg:py-4 rounded-xl font-semibold text-lg hover:scale-105 active:scale-95 transition-all shadow-2xl relative overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                  <span className="relative flex items-center justify-center space-x-2">
                    <MessageCircle className="w-5 h-5" />
                    <span>Chat on WhatsApp</span>
                  </span>
                </a>
                <a
                  href="tel:+919674921594"
                  className="group px-8 py-4 lg:px-10 lg:py-4 rounded-xl border-2 border-purple-400/30 hover:bg-purple-500/10 active:scale-95 transition-all text-lg"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <Phone className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span>Call Now</span>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section
          id="contact"
          className="relative z-10 py-12 sm:py-16 lg:py-24 bg-slate-900/50 border-t border-slate-800"
        >
          <div className="container mx-auto px-4 sm:px-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 lg:mb-12">
              Get in Touch Today
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <a
                href="https://wa.me/919330352190"
                className="group p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/30 text-center hover:scale-105 active:scale-95 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/20"
              >
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <p className="font-semibold text-white mb-2 text-lg">
                  WhatsApp
                </p>
                <p className="text-green-400 hover:underline text-sm break-all group-hover:text-green-300 transition-colors">
                  +91 9330352190
                </p>
                <div className="mt-3 inline-flex items-center space-x-1 text-xs text-green-300">
                  <Clock className="w-3 h-3" />
                  <span>Fast response</span>
                </div>
              </a>

              <a
                href="mailto:nexuscrew.official.team@gmail.com"
                className="group p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/30 text-center hover:scale-105 active:scale-95 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20"
              >
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <p className="font-semibold text-white mb-2 text-lg">Email</p>
                <p className="text-blue-400 hover:underline text-sm break-all group-hover:text-blue-300 transition-colors">
                  nexuscrew.official.team@gmail.com
                </p>
                <div className="mt-3 inline-flex items-center space-x-1 text-xs text-blue-300">
                  <Clock className="w-3 h-3" />
                  <span>Typically replies in 24h</span>
                </div>
              </a>

              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="group block p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/30 text-center hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <p className="font-semibold text-white mb-2 text-lg">
                  Location
                </p>
                <p className="text-purple-400 text-sm">Baruipur, West Bengal</p>
                <div className="mt-3 inline-flex items-center space-x-1 text-xs text-purple-300">
                  <CheckCircle className="w-3 h-3" />
                  <span>Available for offline visits</span>
                </div>
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 border-t border-slate-800/50 bg-gradient-to-b from-slate-900/40 to-slate-950/60 backdrop-blur-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Main Footer Content */}
            <div className="py-12 lg:py-16">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">    
                {/* Call to Action */}
                <div className="lg:col-span-4 flex justify-center">
                  <a
                    href="/creators"
                    className="group relative inline-flex items-center justify-center px-8 py-3 text-base font-semibold text-white transition-all duration-300 bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl hover:from-purple-500 hover:to-purple-600 hover:shadow-lg hover:shadow-purple-500/25 hover:-translate-y-0.5 focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-slate-900"
                  >
                    <span className="relative z-10">Meet the Creators</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
                  </a>
                </div>

                {/* Social Links */}
                <div className="lg:col-span-4 flex justify-center lg:justify-end">
                  <div className="flex items-center space-x-6">
                    <span className="text-slate-400 text-sm font-medium hidden sm:block">Follow us</span>
                    <div className="flex items-center space-x-4">
                      <a
                        href="#"
                        aria-label="Instagram"
                        className="p-2 rounded-lg text-slate-400 transition-all duration-300 hover:text-pink-400 hover:bg-pink-400/10 hover:scale-110 focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-slate-900"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                      </a>
                      <a
                        href="#"
                        aria-label="Facebook"
                        className="p-2 rounded-lg text-slate-400 transition-all duration-300 hover:text-blue-400 hover:bg-blue-400/10 hover:scale-110 focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-slate-900"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                        </svg>
                      </a>
                      <a
                        href="#"
                        aria-label="YouTube"
                        className="p-2 rounded-lg text-slate-400 transition-all duration-300 hover:text-red-400 hover:bg-red-400/10 hover:scale-110 focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-slate-900"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-slate-800/50 py-6">
              <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                <div className="text-slate-400 text-sm">
                  © {new Date().getFullYear()} Nexus LMS. All rights reserved.
                </div>
                <div className="flex items-center space-x-6 text-sm">
                  <a href="#" className="text-slate-400 hover:text-slate-300 transition-colors">Privacy Policy</a>
                  <a href="#" className="text-slate-400 hover:text-slate-300 transition-colors">Terms of Service</a>
                  <a href="#" className="text-slate-400 hover:text-slate-300 transition-colors">Support</a>
                </div>
              </div>
            </div>
          </div>
        </footer>


        {/* Back to top button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-90 transition-all z-50"
        >
          <ArrowRight className="w-5 h-5 text-white -rotate-90" />
        </button>
      </div>

      <style jsx global>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-in-left {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes gradient {
          0%,
          100% {
            background-position: left center;
          }
          50% {
            background-position: right center;
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
        .animate-fade-in-left {
          animation: fade-in-left 0.8s ease-out 0.2s both;
        }
        .animate-gradient {
          animation: gradient 3s ease-in-out infinite;
          background-size: 200% 200%;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        html {
          scroll-behavior: smooth;
        }

        @media (max-width: 640px) {
          button:active,
          a:active {
            transform: scale(0.95);
          }
        }
      `}</style>
    </div>
  );
}
