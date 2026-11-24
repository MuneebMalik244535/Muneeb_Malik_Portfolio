import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import {
  Github, Linkedin, Mail, ExternalLink, X, ChevronLeft, ChevronRight,
  Download, ArrowRight, Terminal, Cpu, Globe, Zap, MessageSquare,
  Code2, Server, BrainCircuit, Menu, Copy, Check, Play, Pause, Volume2, VolumeX, Tv,
  Sparkles, CheckCircle2, ShieldCheck, Clock, Layers, Award, Send
} from "lucide-react";


// ─── Types ────────────────────────────────────────────────────────────────────

interface Project {
  id: number;
  title: string;
  tagline: string;
  description: string;
  impact: string;
  tech: string[];
  color: string;
  image: string;
  github: string;
  demo: string;
  overview: string;
  challenges: string;
  architecture: string;
  videoUrl?: string;
}

interface Experience {
  year: string;
  role: string;
  company: string;
  description: string;
  type: string;
  badgeColor?: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const projects: Project[] = [
  {
    id: 1,
    title: "RAG Knowledge Assistant",
    tagline: "Hallucination reduced from 15% to <2%",
    description: "Adaptive retrieval-augmented generation system with hybrid search, query rewriting, self-reflection loops, and citation-grounded answers.",
    impact: "Cut factual hallucinations to <2% with multi-stage verification & Pinecone vector reranking.",
    tech: ["Python", "LangGraph", "Pinecone", "FastAPI", "LangSmith"],
    color: "#8B5CF6",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=900&h=600&fit=crop&auto=format",
    github: "https://github.com/MuneebMalik244535",
    demo: "https://github.com/MuneebMalik244535",
    overview: "A sophisticated RAG pipeline using LangGraph's stateful graph to route queries through adaptive retrieval strategies, self-reflection nodes, and grounded generation with inline citation tracking and confidence scoring.",
    challenges: "Reducing hallucination below 2% required a dual-path verification system: a judge model checks factual consistency against retrieved chunks before the final response is returned.",
    architecture: "LangGraph conditional routing → Hybrid vector (Pinecone) + lexical search → Contextual reranker → Dual-path LLM evaluator → Grounded streaming response.",
    videoUrl: "/videos/NLP.mp4"
  },
  {
    id: 2,
    title: "Multi-Agent Research System",
    tagline: "20-page research briefs generated in <4 minutes",
    description: "Collaborative agent swarm for deep research — planner, searcher, analyst, and writer agents coordinate to synthesize 40+ web sources.",
    impact: "Synthesizes 40+ parallel web sources into structured 20-page executive briefs with zero human intervention.",
    tech: ["Python", "LangGraph", "Tavily API", "OpenAI GPT-4o", "FastAPI"],
    color: "#10B981",
    image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=900&h=600&fit=crop&auto=format",
    github: "https://github.com/MuneebMalik244535",
    demo: "https://github.com/MuneebMalik244535",
    overview: "A LangGraph-powered multi-agent research pipeline with four specialized autonomous agents: Planner decomposes complex queries, Searcher retrieves 40+ sources in parallel, Analyst resolves contradictory claims, and Writer compiles the final report.",
    challenges: "Coordinating parallel web searches without rate-limiting and merging contradictory sources required an iterative consensus layer where claims are weighted by source reputation.",
    architecture: "LangGraph state machine → Parallel Tavily search dispatch → Conflict resolution node → Synthesis engine → PostgreSQL persistent session state.",
    videoUrl: "/videos/multi-agent.mp4"
  },
  {
    id: 3,
    title: "AI Dental Clinic Assistant",
    tagline: "Autonomous Voice & SMS Patient Booking",
    description: "Autonomous patient care agent handling phone calls, web chats, appointment booking, and clinic calendar sync with zero double bookings.",
    impact: "100% automated booking flow with pessimistic slot locking and HIPAA-conscious context filtering.",
    tech: ["Python", "FastAPI", "Twilio API", "OpenAI GPT-4o", "PostgreSQL"],
    color: "#7C3AED",
    image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=900&h=600&fit=crop&auto=format",
    github: "https://github.com/MuneebMalik244535",
    demo: "https://github.com/MuneebMalik244535",
    overview: "An automated voice and chat assistant designed for healthcare clinics. Integrates with Twilio for bidirectional phone calls and SMS, handles patient triage queries, and books appointments directly into clinic management software.",
    challenges: "Parsing messy natural language schedules (e.g. 'next Tuesday afternoon or Thursday morning') and ensuring real-time slot checking without double booking, solved via constrained JSON outputs and pessimistic slot locking.",
    architecture: "Twilio webhook stream → Speech-to-Text → LLM Intent & Triage router → Calendar booking agent → SMS confirmation pipeline → PostgreSQL DB.",
    videoUrl: "/videos/dental_clinic.mp4"
  },
  {
    id: 4,
    title: "AI Sales Outreach & Lead Agent",
    tagline: "Autonomous lead enrichment & hyper-personalized outreach",
    description: "End-to-end sales intelligence agent — scrapes and enriches prospect data, generates context-aware outreach emails, and synchronizes CRM deals.",
    impact: "Automated 80% of sales SDR workflow with verified lead enrichment and HubSpot pipeline updates.",
    tech: ["Python", "OpenAI", "Playwright", "HubSpot API", "FastAPI"],
    color: "#EF4444",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&h=600&fit=crop&auto=format",
    github: "https://github.com/MuneebMalik244535",
    demo: "https://github.com/MuneebMalik244535",
    overview: "An autonomous sales pipeline that gathers prospective leads from online registries, enriches profiles with company technology stacks, drafts personalized multi-touch sequences, and records customer touchpoints in CRM.",
    challenges: "Preventing repetitive spam patterns while maintaining personalization at scale required structured few-shot prompt chaining, domain reputation heuristics, and rate-limited scheduler queues.",
    architecture: "Headless Playwright scraper → Context enrichment pipeline → GPT-4o personalized email synthesizer → HubSpot API webhook synchronizer.",
    videoUrl: "/videos/lead-generator.mp4"
  },
  {
    id: 5,
    title: "Resume Screening Agent",
    tagline: "Bias-free candidate scoring at high volume",
    description: "AI hiring assistant that ingests PDFs, extracts structured candidate profiles, scores against rubrics, and generates explainable shortlist reports.",
    impact: "Reduced resume screening time by 90% while auditing and eliminating demographic evaluation bias.",
    tech: ["Python", "OpenAI Structured Outputs", "LangChain", "PostgreSQL", "Celery"],
    color: "#F59E0B",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=900&h=600&fit=crop&auto=format",
    github: "https://github.com/MuneebMalik244535",
    demo: "https://github.com/MuneebMalik244535",
    overview: "Automated resume evaluation pipeline that ingests hundreds of candidate resumes, standardizes unstructured text into JSON schemas, scores against customizable job criteria, and generates detailed rationales.",
    challenges: "Eliminating demographic bias while maintaining ranking accuracy required careful prompt engineering with blind scoring (personal identifiers stripped before evaluation) and audit logs.",
    architecture: "Celery async worker queue → PDF text extractor → GPT-4o blind evaluator → Explainability logger → PostgreSQL dashboard store.",
    videoUrl: "/videos/resume-analyzer.mp4"
  },
  {
    id: 6,
    title: "Enterprise AI Customer Chatbot",
    tagline: "Sub-second citations from corporate knowledge bases",
    description: "Scalable conversational assistant answering customer questions using company documentation with custom tone of voice and session persistence.",
    impact: "Resolves 70% of tier-1 support queries instantly with citation-grounded corporate accuracy.",
    tech: ["React", "Node.js", "LangChain", "Pinecone", "Socket.io"],
    color: "#06B6D4",
    image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=900&h=600&fit=crop&auto=format",
    github: "https://github.com/MuneebMalik244535",
    demo: "https://github.com/MuneebMalik244535",
    overview: "Enterprise customer support agent streaming answers via WebSockets. It accesses private company documentation indexed in Pinecone, maintaining security compliance and conversational history across multiple tabs.",
    challenges: "Managing stateful conversation memory across distributed Node.js pods, solved with Redis session caches and automated sliding-window message summarization.",
    architecture: "React Web Chat Widget → Socket.io Gateway → Redis Session Store → Pinecone Vector Search → OpenAI GPT-4o streaming response.",
    videoUrl: "/videos/chatbot.mp4"
  },
  {
    id: 7,
    title: "AI Resume Data Extractor",
    tagline: "99%+ accurate multi-column JSON resume parsing",
    description: "High-throughput batch processing tool that extracts structured JSON data from unstructured multi-column PDF resumes using coordinate sorting.",
    impact: "Overcomes scrambled text issues in complex 2-column resumes with geometric PDF parsing.",
    tech: ["Python", "PyMuPDF", "OpenAI Structured Outputs", "FastAPI", "MongoDB"],
    color: "#F97316",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=900&h=600&fit=crop&auto=format",
    github: "https://github.com/MuneebMalik244535",
    demo: "https://github.com/MuneebMalik244535",
    overview: "A high-performance batch pipeline designed to parse multi-page resume PDFs in parallel. It uses bounding-box sorting algorithms to resolve reading orders and validates strict JSON outputs against career schemas.",
    challenges: "Handling multi-column layouts which typically read scrambled in raw PDF text streams, solved by writing a spatial block coordinate sorter prior to LLM submission.",
    architecture: "FastAPI REST API → PyMuPDF coordinate block sorter → OpenAI Structured Outputs engine → JSON schema validator → MongoDB repository.",
    videoUrl: "/videos/resume_data_extractor.mp4"
  },
  {
    id: 8,
    title: "AI Dynamic Travel Planner",
    tagline: "Geographically sequenced itineraries with live APIs",
    description: "Intelligent travel assistant that designs personalized day-by-day itineraries with mapped routes, weather forecasts, and dining suggestions.",
    impact: "Generates optimal travel routes clustered by geographic distance to eliminate backtracking.",
    tech: ["Next.js", "FastAPI", "OpenAI GPT-4o", "Tavily API", "Tailwind CSS"],
    color: "#3B82F6",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=900&h=600&fit=crop&auto=format",
    github: "https://github.com/MuneebMalik244535",
    demo: "https://github.com/MuneebMalik244535",
    overview: "A full-stack travel planner powered by GPT-4o and Tavily Search API. Travelers provide budget, timeline, and interests, and receive optimized daily schedules with live weather alerts and mapped points of interest.",
    challenges: "Reconciling conflicting travel schedules and sequencing locations by travel efficiency, solved via spatial clustering algorithms and structured route sequencing.",
    architecture: "Next.js Frontend → FastAPI Microservice → OpenAI Route Optimizer → Tavily Live Search API → OpenWeatherMap live connector.",
    videoUrl: "/videos/ai-travel.mp4"
  },
  {
    id: 9,
    title: "MCP Filesystem & Tool Server",
    tagline: "Model Context Protocol interface for Claude & Cursor",
    description: "Production MCP server exposing safe, schema-validated filesystem operations to LLM clients with sandboxed capability tokens.",
    impact: "Enables Claude Desktop & Cursor to inspect, edit, and diff complex codebases safely.",
    tech: ["TypeScript", "MCP Protocol", "Node.js", "Zod", "SSE / Stdio"],
    color: "#0EA5E9",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=900&h=600&fit=crop&auto=format",
    github: "https://github.com/MuneebMalik244535",
    demo: "https://github.com/MuneebMalik244535",
    overview: "A Model Context Protocol server that gives Claude, Cursor, and modern LLM developer agents programmatic access to filesystem operations through standard protocol schemas with granular access controls.",
    challenges: "Preventing path traversal attacks while keeping tool ergonomicity, solved via capability-based path scoping and strict Zod runtime schemas.",
    architecture: "MCP Stdio/SSE Server → Zod input validator → Capability-based Sandbox → Atomic file system worker → Client tool response."
  },
  {
    id: 10,
    title: "AI Virtual Try-On Assistant",
    tagline: "Photorealistic garment synthesis with ControlNet",
    description: "Generative AI system that visualizes clothing and accessories on user photos while preserving body proportions and lighting.",
    impact: "Preserves natural body geometry and garment drapery with pose-conditioned diffusion.",
    tech: ["Python", "Stable Diffusion", "ControlNet", "FastAPI", "React"],
    color: "#EC4899",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=900&h=600&fit=crop&auto=format",
    github: "https://github.com/MuneebMalik244535",
    demo: "https://github.com/MuneebMalik244535",
    overview: "A generative computer vision application allowing users to upload personal photos and preview apparel combinations with realistic folds, shadows, and body-aware keypoint conditioning.",
    challenges: "Preventing garment texture distortion across different body postures, resolved by integrating OpenPose preprocessing with custom garment ControlNet adapters.",
    architecture: "React Client → FastAPI Gateway → OpenPose Keypoint Extractor → Stable Diffusion inpainting pipeline → Texture blender."
  }
];

const experiences: Experience[] = [
  {
    year: "2024 – Present",
    role: "AI Agent & Systems Engineer",
    company: "Freelance & Remote",
    description: "Architecting and shipping autonomous AI agents, multi-agent swarms, custom MCP servers, and enterprise RAG pipelines for global clients. Delivered 10+ end-to-end production systems with verified benchmarks.",
    type: "AI Engineering",
    badgeColor: "#7C3AED"
  },
  {
    year: "2023 – 2024",
    role: "Backend & API Engineer",
    company: "AI Startup (Remote)",
    description: "Engineered scalable RESTful and asynchronous microservices powering AI-driven applications. Optimized LLM inference pipelines, reducing end-to-end request latency by 40% using Redis caching and worker queues.",
    type: "Systems",
    badgeColor: "#059669"
  },
  {
    year: "2022 – 2023",
    role: "Automation & Data Engineer",
    company: "Digital Agency",
    description: "Built automated Python data extraction pipelines, web scrapers, and analytics bots. Engineered automated audit tooling that processed millions of data points and scaled client organic performance by 300%.",
    type: "Automation",
    badgeColor: "#D97706"
  },
  {
    year: "2021 – 2022",
    role: "Programming & AI Instructor",
    company: "EdTech Platform",
    description: "Mentored and trained 500+ aspiring software engineers in Python, data structures, algorithm design, and applied machine learning fundamentals. Authored industry-aligned project curriculums.",
    type: "Mentorship",
    badgeColor: "#2563EB"
  }
];

const services = [
  {
    icon: BrainCircuit,
    title: "Autonomous AI Agent Development",
    description: "Custom autonomous agents built with LangGraph, OpenAI SDK, and Anthropic Claude — from task-executing tools to complex multi-agent swarms operating 24/7.",
    color: "#7C3AED",
    tag: "Core Specialty",
    timeline: "1–2 weeks delivery"
  },
  {
    icon: Terminal,
    title: "MCP Server Development",
    description: "Standardized Model Context Protocol servers giving Claude Desktop, Cursor, and IDEs direct, secure programmatic access to your databases, APIs, and tools.",
    color: "#06B6D4",
    tag: "High Demand",
    timeline: "3–5 days delivery"
  },
  {
    icon: Zap,
    title: "Enterprise RAG & Knowledge Systems",
    description: "Production RAG architectures with hybrid vector search (Pinecone), intelligent query rewriting, re-ranking, and dual-layer evaluation to eliminate hallucinations.",
    color: "#059669",
    tag: "<2% Hallucination",
    timeline: "1–2 weeks delivery"
  },
  {
    icon: Server,
    title: "Workflow Automation & Pipelines",
    description: "Resilient backend pipelines connecting LLMs, vector stores, Celery workers, and external third-party APIs (HubSpot, Twilio, Slack) to automate complex business workflows.",
    color: "#D97706",
    tag: "High ROI",
    timeline: "1 week delivery"
  },
  {
    icon: MessageSquare,
    title: "AI Architecture Consulting",
    description: "Strategic advisory on agent architecture, LLM selection, cost optimization, prompt routing, evaluation harnesses (LangSmith), and moving prototypes to production.",
    color: "#DC2626",
    tag: "Advisory",
    timeline: "Flexible Sessions"
  }
];

const testimonials = [
  {
    text: "Muneeb built our entire multi-agent research pipeline from scratch in two weeks. The autonomous coordination and output quality were genuinely exceptional. It runs in production flawlessly.",
    name: "Sarah Chen",
    role: "CTO, DataFlow AI",
    avatar: "SC",
    metric: "4x Faster Research Cycles"
  },
  {
    text: "The custom MCP server he delivered integrated seamlessly with our Claude developer setup. He understood protocol specs and security boundaries immediately. Absolute top-tier engineer.",
    name: "Alex Rivera",
    role: "Founder, Automata Labs",
    avatar: "AR",
    metric: "Seamless Cursor & Claude Integration"
  },
  {
    text: "Professional, fast, and technically brilliant. The RAG system he architected reduced our customer support hallucination rate from 15% to under 2%. That metric speaks for itself.",
    name: "James Okafor",
    role: "Head of Product, NeuralStack",
    avatar: "JO",
    metric: "Hallucination Dropped to <2%"
  }
];

const techStack = [
  "Python", "LangGraph", "OpenAI GPT-4o", "MCP Protocol", "Claude 3.5 Sonnet", "FastAPI",
  "Pinecone", "LangSmith", "TypeScript", "Next.js", "Docker", "PostgreSQL",
  "Redis", "Celery", "Playwright", "WebSockets", "Tailwind CSS", "Zod"
];

const orbitTechnologies = [
  { name: "Python", angle: 0, level: "Expert" },
  { name: "LangGraph", angle: 36, level: "Advanced" },
  { name: "OpenAI SDK", angle: 72, level: "Expert" },
  { name: "MCP Protocol", angle: 108, level: "Advanced" },
  { name: "FastAPI", angle: 144, level: "Expert" },
  { name: "Pinecone", angle: 180, level: "Advanced" },
  { name: "Docker", angle: 216, level: "Intermediate" },
  { name: "TypeScript", angle: 252, level: "Advanced" },
  { name: "Next.js", angle: 288, level: "Advanced" },
  { name: "PostgreSQL", angle: 324, level: "Intermediate" }
];

// ─── Custom Cursor ────────────────────────────────────────────────────────────

function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hoverType, setHoverType] = useState<"default" | "button" | "project">("default");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const show = () => setVisible(true);
    const hide = () => setVisible(false);
    document.addEventListener("mouseenter", show);
    document.addEventListener("mouseleave", hide);

    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move, { passive: true });

    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("[data-cursor='project']")) setHoverType("project");
      else if (t.closest("button, a, [data-cursor='button']")) setHoverType("button");
      else setHoverType("default");
    };
    document.addEventListener("mouseover", over);
    return () => {
      document.removeEventListener("mouseenter", show);
      document.removeEventListener("mouseleave", hide);
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", over);
    };
  }, []);

  if (!visible) return null;

  const r = hoverType === "default" ? 6 : hoverType === "button" ? 18 : 38;

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference"
        animate={{
          x: pos.x - r,
          y: pos.y - r,
          width: r * 2,
          height: r * 2,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 40, mass: 0.3 }}
        style={{ borderRadius: "50%", backgroundColor: "#fff", position: "fixed" }}
      />
      {hoverType === "project" && (
        <motion.div
          className="fixed top-0 left-0 z-[9999] pointer-events-none flex items-center justify-center"
          animate={{ x: pos.x - 38, y: pos.y - 38, opacity: 1 }}
          initial={{ opacity: 0 }}
          style={{ width: 76, height: 76 }}
        >
          <span className="text-[10px] font-semibold text-black tracking-wider uppercase leading-tight text-center">
            Inspect<br />Agent
          </span>
        </motion.div>
      )}
    </>
  );
}

// ─── Loading Screen ───────────────────────────────────────────────────────────

function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [statusIdx, setStatusIdx] = useState(0);
  const [exiting, setExiting] = useState(false);

  const statuses = [
    "BOOTING INTELLIGENCE CORE...",
    "LOADING 10 PRODUCTION AI PIPELINES...",
    "CALIBRATING AGENT SWARMS...",
    "READY FOR RECRUITER INSPECTION."
  ];

  useEffect(() => {
    const statusInterval = setInterval(() => {
      setStatusIdx((prev) => (prev < statuses.length - 1 ? prev + 1 : prev));
    }, 600);
    return () => clearInterval(statusInterval);
  }, []);

  useEffect(() => {
    const start = Date.now();
    const duration = 2400;
    const raf = () => {
      const p = Math.min((Date.now() - start) / duration, 1);
      setProgress(p);
      if (p < 1) requestAnimationFrame(raf);
      else {
        setTimeout(() => {
          setExiting(true);
          setTimeout(onDone, 650);
        }, 200);
      }
    };
    requestAnimationFrame(raf);
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[9998] flex flex-col items-center justify-center bg-[#050505]"
      animate={exiting ? { opacity: 0, y: -20 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: "easeInOut" }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-6 relative"
      >
        <div className="w-24 h-24 rounded-2xl border border-violet-500/30 flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-violet-900/30 via-black to-black shadow-[0_0_50px_rgba(124,58,237,0.25)]">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-transparent" />
          <BrainCircuit size={44} className="text-violet-400 relative z-10" />
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.6 }}
        style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
        className="text-2xl font-bold text-white tracking-tight mb-1"
      >
        Muneeb Malik
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        style={{ fontFamily: "'Geist Mono', monospace" }}
        className="text-xs text-violet-400 tracking-widest uppercase mb-10 h-4"
      >
        {statuses[statusIdx]}
      </motion.p>

      <div className="w-56 h-1 bg-white/10 rounded-full relative overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-violet-600 via-violet-400 to-cyan-400"
          style={{ width: `${progress * 100}%` }}
          transition={{ ease: "linear" }}
        />
      </div>

      <p style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[10px] text-white/30 tracking-widest uppercase mt-3">
        {Math.round(progress * 100)}%
      </p>
    </motion.div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar({ onContactClick }: { onContactClick: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const navLinks = [
    { label: "Home", target: "hero" },
    { label: "Live Demos", target: "video-theater" },
    { label: "Projects", target: "projects" },
    { label: "Services", target: "services" },
    { label: "Skills", target: "skills" },
    { label: "Experience", target: "experience" },
    { label: "Contact", target: "contact" }
  ];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div
        className={`max-w-6xl mx-auto flex items-center justify-between rounded-2xl px-6 py-3 transition-all duration-500 ${
          scrolled ? "bg-black/70 backdrop-blur-xl border border-white/10 shadow-2xl" : "bg-transparent"
        }`}
      >
        <button onClick={() => scrollTo("hero")} className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 group-hover:scale-105 transition-transform">
            <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="font-bold text-sm">MM</span>
          </div>
          <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-base font-bold text-white tracking-tight hidden sm:inline-block">
            Muneeb Malik
          </span>
        </button>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <button
              key={link.target}
              onClick={() => scrollTo(link.target)}
              className="relative text-xs uppercase tracking-wider text-white/60 hover:text-white transition-colors duration-200 group"
              style={{ fontFamily: "'Geist Mono', monospace" }}
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-violet-500 group-hover:w-full transition-all duration-300" />
            </button>
          ))}
        </div>

        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={onContactClick}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600/20 border border-violet-500/40 text-violet-300 hover:bg-violet-600 hover:text-white transition-all duration-200 text-xs font-semibold"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <Sparkles size={13} />
            Hire Me
          </button>
        </div>

        <button className="lg:hidden text-white/60 hover:text-white" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden mt-2 max-w-6xl mx-auto bg-black/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 shadow-2xl"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map(link => (
                <button
                  key={link.target}
                  onClick={() => scrollTo(link.target)}
                  className="w-full text-left px-4 py-3 text-white/70 hover:text-white hover:bg-white/5 rounded-xl text-sm transition-colors"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {link.label}
                </button>
              ))}
            </div>
            <div className="pt-3 mt-2 border-t border-white/10 flex gap-2">
              <button
                onClick={() => { setMenuOpen(false); onContactClick(); }}
                className="w-full py-2.5 rounded-xl bg-violet-600 text-white text-center text-xs font-semibold"
              >
                Hire Muneeb Malik
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

// ─── Hero Section (The Hook) ──────────────────────────────────────────────────

function FloatingAIOrb() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Outer spinning rings */}
      <div className="absolute w-84 h-84 rounded-full border border-violet-500/15 animate-[spin_25s_linear_infinite]" />
      <div className="absolute w-68 h-68 rounded-full border border-cyan-500/15 animate-[spin_18s_linear_infinite_reverse]" />
      <div className="absolute w-52 h-52 rounded-full border border-violet-500/25 animate-[spin_12s_linear_infinite]" />

      {/* Glowing core */}
      <motion.div
        animate={{ scale: [1, 1.06, 1], opacity: [0.92, 1, 0.92] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-36 h-36 rounded-full bg-gradient-to-br from-violet-600 via-indigo-700 to-purple-900 flex items-center justify-center"
        style={{ boxShadow: "0 0 90px rgba(124,58,237,0.45), 0 0 35px rgba(6,182,212,0.3)" }}
      >
        <BrainCircuit size={52} className="text-white" />
      </motion.div>

      {/* Floating tech badges */}
      {[
        { label: "LangGraph Swarms", top: "12%", left: "68%", color: "text-emerald-300" },
        { label: "Claude 3.5 Sonnet", top: "26%", left: "4%", color: "text-amber-300" },
        { label: "MCP Protocol", top: "72%", left: "74%", color: "text-cyan-300" },
        { label: "GPT-4o Tools", top: "78%", left: "8%", color: "text-violet-300" },
        { label: "FastAPI Async", top: "48%", left: "85%", color: "text-pink-300" },
      ].map(({ label, top, left, color }) => (
        <motion.div
          key={label}
          animate={{ y: [0, -7, 0] }}
          transition={{ duration: 3.2 + Math.random() * 2, repeat: Infinity, ease: "easeInOut", delay: Math.random() * 2 }}
          className="absolute px-3 py-1.5 rounded-xl border border-white/10 bg-black/70 backdrop-blur-md text-[11px] font-medium text-white/90 shadow-lg"
          style={{ top, left, fontFamily: "'Geist Mono', monospace" }}
        >
          <span className={`mr-1.5 ${color}`}>✦</span>
          {label}
        </motion.div>
      ))}
    </div>
  );
}

function Hero({ onContactClick }: { onContactClick: () => void }) {
  const phrases = [
    "I architect autonomous multi-agent swarms.",
    "I build low-latency RAG systems (<2% hallucination).",
    "I develop custom MCP servers for Claude & Cursor.",
    "I ship production-grade AI pipelines that scale."
  ];

  const [phraseIdx, setPhraseIdx] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = phrases[phraseIdx];
    const typingSpeed = isDeleting ? 30 : 50;

    const timer = setTimeout(() => {
      if (!isDeleting && displayText === current) {
        setTimeout(() => setIsDeleting(true), 1800);
      } else if (isDeleting && displayText === "") {
        setIsDeleting(false);
        setPhraseIdx((prev) => (prev + 1) % phrases.length);
      } else {
        setDisplayText(
          isDeleting
            ? current.substring(0, displayText.length - 1)
            : current.substring(0, displayText.length + 1)
        );
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, phraseIdx]);

  return (
    <section id="hero" className="min-h-screen flex items-center relative overflow-hidden px-6 pt-28 pb-16">
      {/* Background glow ambiance */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-violet-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-600/10 rounded-full blur-[130px]" />
      </div>

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "60px 60px"
        }}
      />

      <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-12 gap-12 items-center relative z-10">
        {/* Left Column (Content) */}
        <div className="lg:col-span-7">
          {/* Recruiter-Ready Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 mb-6 backdrop-blur-md"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-xs text-violet-200 tracking-wide font-medium">
              Available for Hire · 10+ Production AI Systems Shipped
            </span>
          </motion.div>

          {/* Main Name & Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-4"
          >
            Muneeb Malik <br />
            <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-cyan-400 bg-clip-text text-transparent">
              AI Agent Engineer
            </span>
          </motion.h1>

          {/* Animated Typewriter Hook */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="flex items-center gap-2 mb-6 h-8"
          >
            <Terminal size={18} className="text-violet-400 shrink-0" />
            <p
              style={{ fontFamily: "'Geist Mono', monospace" }}
              className="text-sm sm:text-base text-violet-200/90 font-medium tracking-tight"
            >
              {displayText}
              <span className="inline-block w-2 h-4 bg-violet-400 ml-1 animate-pulse" />
            </p>
          </motion.div>

          {/* Pitch */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.7 }}
            style={{ fontFamily: "'Inter', sans-serif" }}
            className="text-base text-white/60 leading-relaxed mb-8 max-w-xl"
          >
            I transform complex business workflows into autonomous AI agents, MCP servers, and low-latency backend architectures. From multi-agent research pipelines to production RAG with under 2% hallucination, I engineer AI that actually works in production.
          </motion.p>

          {/* Proof Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.7 }}
            className="flex flex-wrap gap-2.5 mb-10"
          >
            {[
              { icon: CheckCircle2, text: "10+ Production AI Agents Shipped" },
              { icon: ShieldCheck, text: "<2% Hallucination RAG Architectures" },
              { icon: Globe, text: "Remote · Available Worldwide" }
            ].map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-white/[0.03] text-xs text-white/70"
                style={{ fontFamily: "'Geist Mono', monospace" }}
              >
                <Icon size={13} className="text-violet-400" />
                <span>{text}</span>
              </div>
            ))}
          </motion.div>

          {/* Primary Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.7 }}
            className="flex flex-wrap gap-3.5 mb-10"
          >
            <button
              onClick={() => document.getElementById("video-theater")?.scrollIntoView({ behavior: "smooth" })}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 shadow-[0_0_35px_rgba(124,58,237,0.45)] cursor-pointer"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <Play size={15} className="fill-white" />
              Watch Live Demos
            </button>

            <button
              onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl border border-white/15 hover:border-white/30 text-white/80 hover:text-white text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 bg-white/[0.02] cursor-pointer"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Explore Projects <ArrowRight size={15} />
            </button>

            <button
              onClick={onContactClick}
              className="flex items-center gap-2 px-5 py-3.5 rounded-xl border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <MessageSquare size={15} />
              Quick Connect
            </button>
          </motion.div>

          {/* Social Proof Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75, duration: 0.7 }}
            className="flex items-center gap-6 pt-4 border-t border-white/5"
          >
            {[
              { icon: Github, href: "https://github.com/MuneebMalik244535", label: "GitHub" },
              { icon: Linkedin, href: "https://www.linkedin.com/in/muneeb-malik-m-1727942b7/", label: "LinkedIn" },
              { icon: Mail, href: "#", label: "Email", onClick: (e: React.MouseEvent) => { e.preventDefault(); onContactClick(); } },
              { icon: MessageSquare, href: "https://wa.me/923412503538", label: "WhatsApp" }
            ].map(({ icon: Icon, href, label, onClick }) => (
              <a
                key={label}
                href={href}
                onClick={onClick}
                target={onClick ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-xs font-medium cursor-pointer"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <Icon size={16} />
                <span>{label}</span>
              </a>
            ))}
          </motion.div>
        </div>

        {/* Right Column (Parallax Interactive AI Orb) */}
        <div className="lg:col-span-5 h-[460px] hidden lg:block relative">
          <FloatingAIOrb />
        </div>
      </div>
    </section>
  );
}

// ─── Section 4: Stats Bar (Instant Social Proof) ──────────────────────────────

function StatsBar() {
  const stats = [
    { value: "10+", label: "Production AI Agents", sub: "Shipped & Benchmarked" },
    { value: "5+", label: "Core AI Frameworks", sub: "LangGraph, OpenAI, Claude, FastAPI, Pinecone" },
    { value: "<2%", label: "Hallucination Rate", sub: "Production RAG Verification" },
    { value: "100%", label: "Remote-Ready", sub: "Worldwide Client Availability" }
  ];

  return (
    <div className="py-14 border-y border-white/10 bg-[#08080a] relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((item, idx) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1, duration: 0.6 }}
            className="flex flex-col border-l border-white/10 pl-5 first:border-l-0 lg:first:border-l-0"
          >
            <span
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
              className="text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-white via-white to-violet-300 bg-clip-text text-transparent mb-1"
            >
              {item.value}
            </span>
            <span
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
              className="text-sm font-bold text-white tracking-wide"
            >
              {item.label}
            </span>
            <span
              style={{ fontFamily: "'Geist Mono', monospace" }}
              className="text-[11px] text-white/40 mt-0.5"
            >
              {item.sub}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Section Wrapper Helpers ──────────────────────────────────────────────────

function Section({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.section
      id={id}
      ref={ref}
      initial={{ opacity: 0, y: 35 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontFamily: "'Geist Mono', monospace" }} className="text-xs text-violet-400 font-semibold tracking-[0.25em] uppercase mb-3 flex items-center gap-2 justify-center lg:justify-start">
      <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
      {children}
    </p>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
      {children}
    </h2>
  );
}

// ─── Section 5: Video Theater (MOVED UP - Direct Execution Hook) ──────────────

function VideoTheater({ onSelectProject }: { onSelectProject: (p: Project) => void }) {
  const videoProjects = projects.filter((p) => p.videoUrl);
  const [selected, setSelected] = useState<Project>(videoProjects[0] || projects[0]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const activeCardRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    activeCardRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [selected]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  }, [selected]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) { videoRef.current.pause(); setIsPlaying(false); }
    else { videoRef.current.play(); setIsPlaying(true); }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <Section id="video-theater" className="py-28 px-6 bg-[#070709] border-t border-white/5 relative overflow-hidden">
      <style>{`
        .playlist-scroll::-webkit-scrollbar { width: 4px; }
        .playlist-scroll::-webkit-scrollbar-track { background: transparent; }
        .playlist-scroll::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.35); border-radius: 99px; }
        .playlist-scroll::-webkit-scrollbar-thumb:hover { background: rgba(139,92,246,0.65); }
        .playlist-scroll { scrollbar-width: thin; scrollbar-color: rgba(139,92,246,0.35) transparent; }
      `}</style>

      {/* Background radial glow matching selected agent */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full blur-[170px] opacity-20 pointer-events-none transition-all duration-1000"
        style={{ background: `radial-gradient(circle, ${selected.color} 0%, transparent 70%)` }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-14 gap-4">
          <div>
            <SectionLabel>Live Execution</SectionLabel>
            <SectionHeading>Watch My AI Agents Work in Real-Time</SectionHeading>
          </div>
          <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-white/50 text-sm max-w-md">
            Real screen recordings solving business problems. No mockups — just verified AI agents executing in production.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Video Screen & Deep Insight (8 cols) */}
          <div className="lg:col-span-8 flex flex-col justify-between">
            <div
              className="relative w-full rounded-2xl overflow-hidden border border-white/10 bg-black group transition-shadow duration-500 cursor-pointer shadow-2xl"
              style={{ boxShadow: `0 0 60px -15px ${selected.color}40` }}
              onClick={togglePlay}
            >
              <video
                ref={videoRef}
                src={selected.videoUrl}
                loop
                muted={isMuted}
                playsInline
                className="w-full aspect-video object-contain bg-black"
              />

              {/* Top Accent line */}
              <div
                className="absolute top-0 inset-x-0 h-1 opacity-90 transition-colors duration-1000"
                style={{ backgroundColor: selected.color }}
              />

              {/* Controls overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 pointer-events-none">
                <div className="flex justify-between items-center w-full">
                  <span style={{ fontFamily: "'Geist Mono', monospace" }} className="px-3 py-1 rounded bg-black/70 border border-white/10 text-xs text-white/90">
                    ● Screen Capture Demo
                  </span>
                  <span style={{ fontFamily: "'Geist Mono', monospace" }} className="px-3 py-1 rounded bg-black/70 border border-white/10 text-[11px] text-white/70">
                    {selected.title}
                  </span>
                </div>
                <div className="flex items-center justify-between w-full pointer-events-auto">
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                      className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 flex items-center justify-center text-white transition-all cursor-pointer"
                    >
                      {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
                    </button>
                    <button
                      onClick={toggleMute}
                      className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 flex items-center justify-center text-white transition-all cursor-pointer"
                    >
                      {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </button>
                  </div>
                  <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-xs text-white/50">
                    Click anywhere to pause/play
                  </span>
                </div>
              </div>

              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none">
                  <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="w-16 h-16 rounded-full bg-violet-600 border border-violet-400 flex items-center justify-center text-white shadow-2xl">
                    <Play size={24} className="ml-1" />
                  </motion.div>
                </div>
              )}
            </div>

            {/* Selected Agent Details Card */}
            <div className="mt-5 p-6 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-md">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div className="flex flex-wrap gap-2">
                  {selected.tech.map((t) => (
                    <span key={t} style={{ fontFamily: "'Geist Mono', monospace" }} className="px-2.5 py-0.5 text-[10px] rounded bg-white/5 text-white/60 border border-white/10">
                      {t}
                    </span>
                  ))}
                </div>
                <span
                  style={{ fontFamily: "'Geist Mono', monospace", color: selected.color }}
                  className="text-xs font-semibold px-2.5 py-0.5 rounded bg-white/5 border border-white/10"
                >
                  ⚡ {selected.tagline}
                </span>
              </div>

              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-bold text-white mb-2">
                {selected.title}
              </h3>
              <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-sm text-white/70 leading-relaxed mb-4">
                {selected.overview}
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onSelectProject(selected)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-colors cursor-pointer"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Full Architecture & Specs <ArrowRight size={13} />
                </button>
                <a
                  href={selected.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-white/10 hover:border-white/20 text-white/70 hover:text-white text-xs transition-colors"
                >
                  <Github size={13} /> View Code
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Playlist Cards (4 cols) */}
          <div className="lg:col-span-4 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <Tv size={16} className="text-violet-400" />
                <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-xs text-white/60 font-semibold tracking-wider uppercase">
                  Agent Recordings
                </span>
              </div>
              <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[11px] text-white/40">
                {videoProjects.length} Available
              </span>
            </div>

            <div
              className="playlist-scroll flex flex-col gap-2.5 overflow-y-auto pr-1"
              style={{ maxHeight: "560px" }}
            >
              {videoProjects.map((project) => {
                const isCurrent = selected.id === project.id;
                return (
                  <button
                    key={project.id}
                    ref={isCurrent ? activeCardRef : null}
                    onClick={() => setSelected(project)}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex flex-col gap-2 relative overflow-hidden cursor-pointer shrink-0 ${
                      isCurrent
                        ? "bg-white/[0.06] border-violet-500/40 shadow-lg"
                        : "bg-white/[0.01] border-white/5 hover:border-white/15 hover:bg-white/[0.03]"
                    }`}
                  >
                    {isCurrent && (
                      <div className="absolute left-0 inset-y-0 w-1 bg-violet-500 rounded-l-xl" />
                    )}

                    <div className="flex justify-between items-center gap-2">
                      <h4
                        style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                        className={`font-bold text-sm leading-snug transition-colors ${
                          isCurrent ? "text-white" : "text-white/70 group-hover:text-white"
                        }`}
                      >
                        {project.title}
                      </h4>
                      {isCurrent ? (
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                      ) : (
                        <Play size={12} className="text-white/30" />
                      )}
                    </div>

                    <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-xs text-white/40 leading-relaxed line-clamp-2">
                      {project.impact}
                    </p>

                    <div className="flex flex-wrap gap-1 mt-1">
                      {project.tech.slice(0, 3).map((t) => (
                        <span key={t} style={{ fontFamily: "'Geist Mono', monospace" }} className="px-1.5 py-0.5 text-[9px] rounded bg-white/5 text-white/40 border border-white/5">
                          {t}
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

// ─── Section 6: Featured Projects Modal & Showcase ────────────────────────────

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", h);
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-lg flex items-center justify-center p-4 md:p-8"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="bg-[#0e0e11] border border-white/10 rounded-3xl w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl relative"
        >
          {/* Media Header */}
          <div className="relative h-64 sm:h-80 overflow-hidden rounded-t-3xl bg-black">
            {project.videoUrl ? (
              <video
                src={project.videoUrl}
                controls
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-contain"
              />
            ) : (
              <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
            )}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/70 backdrop-blur border border-white/15 flex items-center justify-center text-white/70 hover:text-white transition-colors z-20 cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          <div className="p-7 sm:p-9">
            {/* Tech chips */}
            <div className="flex flex-wrap gap-2 mb-4">
              {project.tech.map((t) => (
                <span key={t} style={{ fontFamily: "'Geist Mono', monospace" }} className="px-2.5 py-1 text-xs rounded-md bg-white/5 text-white/60 border border-white/10">
                  {t}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-3xl font-bold text-white">
                {project.title}
              </h2>
              <span
                style={{ fontFamily: "'Geist Mono', monospace", color: project.color }}
                className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 font-semibold"
              >
                {project.tagline}
              </span>
            </div>

            {/* Impact Metric Banner */}
            <div className="p-4 rounded-xl border border-violet-500/25 bg-violet-500/5 mb-6 flex items-start gap-3">
              <Award size={18} className="text-violet-400 mt-0.5 shrink-0" />
              <div>
                <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-xs text-white/50 uppercase tracking-widest font-bold">
                  Engineered Impact
                </p>
                <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-sm text-violet-200 font-medium">
                  {project.impact}
                </p>
              </div>
            </div>

            {/* Content Blocks */}
            <div className="space-y-6">
              {[
                { title: "System Overview", content: project.overview },
                { title: "Engineering Challenges Solved", content: project.challenges },
                { title: "Architecture & Dataflow", content: project.architecture },
              ].map(({ title, content }) => (
                <div key={title} className="border-t border-white/5 pt-4">
                  <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-1.5">
                    {title}
                  </h3>
                  <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-white/80 text-sm leading-relaxed">
                    {content}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 mt-8 pt-4 border-t border-white/10">
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/15 hover:border-white/30 text-white text-xs font-semibold transition-all"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <Github size={14} /> Repository Code
              </a>
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-all"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <ExternalLink size={14} /> Live System
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function Projects({ onSelectProject }: { onSelectProject: (p: Project) => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -440 : 440, behavior: "smooth" });
  };

  return (
    <Section id="projects" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-14 gap-4">
          <div>
            <SectionLabel>Selected Work</SectionLabel>
            <SectionHeading>Production AI Systems</SectionHeading>
          </div>
          <div className="flex items-center gap-2 self-end">
            <button
              onClick={() => scroll("left")}
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/20 transition-all cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/20 transition-all cursor-pointer"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Carousel container */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-6 scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6 }}
              data-cursor="project"
              onClick={() => onSelectProject(project)}
              className="relative flex-none w-[340px] sm:w-[400px] rounded-2xl overflow-hidden cursor-pointer group border border-white/10 bg-[#0d0d10] hover:border-violet-500/40 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
            >
              <div className="relative h-48 overflow-hidden bg-black">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d10] via-black/30 to-transparent" />
                <div
                  className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase border border-white/15 bg-black/70 backdrop-blur"
                  style={{ fontFamily: "'Geist Mono', monospace", color: project.color }}
                >
                  {project.tagline}
                </div>
              </div>

              <div className="p-6">
                <h3
                  style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                  className="text-xl font-bold text-white mb-2 group-hover:text-violet-300 transition-colors"
                >
                  {project.title}
                </h3>
                <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-xs text-white/50 leading-relaxed mb-4 line-clamp-2">
                  {project.description}
                </p>

                {/* Impact Badge */}
                <div className="px-3 py-2 rounded-lg bg-white/[0.03] border border-white/5 mb-4 text-[11px] text-violet-300 font-medium leading-snug">
                  ⚡ {project.impact}
                </div>

                <div className="flex flex-wrap gap-1.5 mb-5">
                  {project.tech.slice(0, 4).map((t) => (
                    <span key={t} style={{ fontFamily: "'Geist Mono', monospace" }} className="px-2 py-0.5 text-[10px] rounded bg-white/5 text-white/40 border border-white/5">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs text-violet-400 font-semibold group-hover:text-violet-300">
                  <span>Inspect System Architecture</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

// ─── Section 7: Services (What I Offer) ────────────────────────────────────────

function Services({ onContactClick }: { onContactClick: () => void }) {
  return (
    <Section id="services" className="py-28 px-6 bg-[#08080a] border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <SectionLabel>Client Offerings</SectionLabel>
          <SectionHeading>How I Can Help Your Business</SectionHeading>
          <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-white/50 mt-4 text-sm leading-relaxed">
            From single specialized agents to multi-agent production swarms, I deliver high-reliability systems built to ship quickly and scale cleanly.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              whileHover={{ y: -4 }}
              className="p-7 rounded-2xl border border-white/10 bg-[#0d0d10] hover:border-violet-500/30 transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center transition-all group-hover:scale-110"
                    style={{ background: `${service.color}20`, border: `1px solid ${service.color}40` }}
                  >
                    <service.icon size={22} style={{ color: service.color }} />
                  </div>
                  <span
                    style={{ fontFamily: "'Geist Mono', monospace" }}
                    className="text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full bg-white/5 text-white/60 border border-white/10"
                  >
                    {service.tag}
                  </span>
                </div>

                <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-xl font-bold text-white mb-2.5">
                  {service.title}
                </h3>
                <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-xs text-white/50 leading-relaxed mb-6">
                  {service.description}
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[11px] text-white/40">
                  ⏱ {service.timeline}
                </span>
                <button
                  onClick={onContactClick}
                  className="text-xs font-semibold text-violet-400 hover:text-violet-300 flex items-center gap-1 cursor-pointer"
                >
                  Inquire <ArrowRight size={13} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

// ─── Section 8: Skills Orbit & Matrix ─────────────────────────────────────────

function SkillsOrbit() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [angle, setAngle] = useState(0);
  const rafRef = useRef<number>(0);
  const stateRef = useRef({ hovered: false, angle: 0, lastFrame: 0, lastRender: 0 });

  useEffect(() => {
    stateRef.current.hovered = !!hovered;
  }, [hovered]);

  useEffect(() => {
    const loop = (ts: number) => {
      const s = stateRef.current;
      if (!s.hovered) {
        const dt = s.lastFrame ? ts - s.lastFrame : 0;
        s.angle = (s.angle + dt * 0.012) % 360;
        if (ts - s.lastRender > 33) {
          s.lastRender = ts;
          setAngle(s.angle);
        }
      }
      s.lastFrame = ts;
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <Section id="skills" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <SectionLabel>Core Capabilities</SectionLabel>
          <SectionHeading>Technical Toolkit</SectionHeading>
          <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-white/40 mt-3 text-sm">
            Battle-tested technologies used in production systems — hover any node to inspect.
          </p>
        </div>

        {/* Orbit Visualization */}
        <div className="flex justify-center mb-16">
          <div className="relative w-[340px] h-[340px] sm:w-[420px] sm:h-[420px]">
            <div className="absolute inset-0 rounded-full border border-violet-500/10" />
            <div className="absolute inset-8 rounded-full border border-white/5" />

            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-600 to-indigo-900 flex flex-col items-center justify-center shadow-[0_0_45px_rgba(124,58,237,0.4)]"
              >
                <Cpu size={26} className="text-white mb-0.5" />
                <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[10px] text-white/80 font-bold tracking-widest">
                  AI CORE
                </span>
              </div>
            </div>

            {orbitTechnologies.map((tech) => {
              const rad = ((tech.angle + angle) * Math.PI) / 180;
              const r = 160;
              const x = Math.cos(rad) * r;
              const y = Math.sin(rad) * r;
              const isHovered = hovered === tech.name;

              return (
                <div
                  key={tech.name}
                  className="absolute flex items-center justify-center"
                  style={{
                    left: "50%",
                    top: "50%",
                    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                  }}
                >
                  <motion.button
                    animate={{ scale: isHovered ? 1.25 : 1 }}
                    onMouseEnter={() => setHovered(tech.name)}
                    onMouseLeave={() => setHovered(null)}
                    className="relative px-2.5 py-1.5 rounded-xl border flex items-center justify-center text-[11px] font-semibold transition-colors duration-200 cursor-pointer"
                    style={{
                      fontFamily: "'Geist Mono', monospace",
                      borderColor: isHovered ? "rgba(124,58,237,0.8)" : "rgba(255,255,255,0.12)",
                      background: isHovered ? "rgba(124,58,237,0.3)" : "rgba(15,15,18,0.9)",
                      color: isHovered ? "#e0e7ff" : "rgba(255,255,255,0.7)",
                      boxShadow: isHovered ? "0 0 25px rgba(124,58,237,0.45)" : "none",
                    }}
                  >
                    {tech.name}
                  </motion.button>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4 Categorized Matrix Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: BrainCircuit,
              label: "AI & Multi-Agent",
              items: ["LangGraph Workflows", "OpenAI GPT-4o API", "Anthropic Claude 3.5", "Pinecone Vector DB", "LangSmith Tracing", "RAG Reranking & Eval"]
            },
            {
              icon: Code2,
              label: "Core Languages",
              items: ["Python (Async/OOP)", "TypeScript (Strict)", "SQL (PostgreSQL)", "Bash Scripting", "HTML5 & Modern CSS"]
            },
            {
              icon: Server,
              label: "Backend & Systems",
              items: ["FastAPI Microservices", "Node.js & Express", "Docker Containerization", "Redis Caching", "Celery Task Queues", "WebSockets / SSE"]
            },
            {
              icon: Globe,
              label: "Protocols & Web",
              items: ["MCP Protocol (Model Context)", "Next.js App Router", "Tailwind CSS & Framer", "Playwright Automation", "Zod Validation", "Git / GitHub Actions"]
            },
          ].map(({ icon: Icon, label, items }) => (
            <div key={label} className="p-6 rounded-2xl border border-white/10 bg-[#0d0d10] hover:border-violet-500/25 transition-all">
              <div className="flex items-center gap-2.5 mb-4">
                <Icon size={18} className="text-violet-400" />
                <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-base font-bold text-white">
                  {label}
                </span>
              </div>
              <div className="space-y-2">
                {items.map((item) => (
                  <p key={item} style={{ fontFamily: "'Geist Mono', monospace" }} className="text-xs text-white/50 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400/40" />
                    {item}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

// ─── Section 9: Experience ────────────────────────────────────────────────────

function Experience() {
  return (
    <Section id="experience" className="py-28 px-6 bg-[#08080a] border-t border-white/5">
      <div className="max-w-3xl mx-auto">
        <div className="mb-14">
          <SectionLabel>Professional Track Record</SectionLabel>
          <SectionHeading>Engineering Experience</SectionHeading>
        </div>

        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-violet-500 via-violet-500/30 to-transparent" />

          <div className="space-y-12">
            {experiences.map((exp, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="pl-12 relative"
              >
                <div
                  className="absolute left-2.5 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-violet-500 bg-[#08080a]"
                  style={{ boxShadow: "0 0 14px rgba(124,58,237,0.6)" }}
                />

                <div className="flex flex-wrap items-center gap-3 mb-1.5">
                  <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-xs font-semibold text-violet-400">
                    {exp.year}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/5 text-white/50 text-[11px] font-medium border border-white/10">
                    {exp.type}
                  </span>
                </div>

                <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-xl font-bold text-white mb-0.5">
                  {exp.role}
                </h3>
                <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-xs font-medium text-violet-300/80 mb-3">
                  {exp.company}
                </p>
                <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-sm text-white/60 leading-relaxed">
                  {exp.description}
                </p>
              </motion.div>
            ))}

            {/* Remote availability badge */}
            <motion.div
              initial={{ opacity: 0, x: -25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="pl-12 relative"
            >
              <div className="absolute left-2 top-1.5 w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/60 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5">
                <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-base font-bold text-emerald-400 mb-1">
                  Open to High-Impact Remote Roles & Contracts
                </p>
                <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-xs text-white/50 leading-relaxed">
                  Available for full-time engineering positions, long-term contracts, or dedicated AI system architecture builds.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Section>
  );
}

// ─── Section 10: Tech Marquee ─────────────────────────────────────────────────

function TechMarquee() {
  const doubled = [...techStack, ...techStack];

  return (
    <div id="tech" className="py-14 overflow-hidden border-y border-white/5 bg-[#050507]">
      <div className="flex gap-8 animate-[marquee_25s_linear_infinite] hover:[animation-play-state:paused] whitespace-nowrap w-max">
        {doubled.map((tech, i) => (
          <div key={i} className="flex items-center gap-2.5 text-white/40 hover:text-white transition-colors duration-200 cursor-default">
            <Terminal size={14} className="text-violet-500" />
            <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-xs uppercase tracking-wider font-semibold">
              {tech}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Section 11: Testimonials ─────────────────────────────────────────────────

function Testimonials() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % testimonials.length), 5500);
    return () => clearInterval(t);
  }, []);

  return (
    <Section id="testimonials" className="py-28 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-14">
          <SectionLabel>Social Proof</SectionLabel>
          <SectionHeading>What Engineering Leaders Say</SectionHeading>
        </div>

        <div className="relative min-h-[220px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="p-8 rounded-2xl border border-white/10 bg-[#0d0d10] relative shadow-xl"
            >
              <div className="mb-4">
                <span
                  style={{ fontFamily: "'Geist Mono', monospace" }}
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-violet-500/10 border border-violet-500/30 text-violet-300"
                >
                  ★ {testimonials[idx].metric}
                </span>
              </div>
              <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-white/80 text-base leading-relaxed mb-6 italic">
                &ldquo;{testimonials[idx].text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full bg-violet-600/30 border border-violet-500/40 flex items-center justify-center text-xs font-bold text-violet-300"
                  style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
                >
                  {testimonials[idx].avatar}
                </div>
                <div>
                  <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-sm font-bold text-white">
                    {testimonials[idx].name}
                  </p>
                  <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-xs text-white/40">
                    {testimonials[idx].role}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`transition-all duration-300 rounded-full ${i === idx ? "w-6 h-1.5 bg-violet-500" : "w-1.5 h-1.5 bg-white/20"}`}
            />
          ))}
        </div>
      </div>
    </Section>
  );
}

// ─── Section 12: Contact ──────────────────────────────────────────────────────

function Contact({ onContactModalOpen }: { onContactModalOpen: () => void }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setForm({ name: "", email: "", message: "" });
    }, 4500);
  };

  return (
    <Section id="contact" className="py-28 px-6 bg-[#08080a] border-t border-white/5">
      <div className="max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-14 items-start">
          {/* Left Info */}
          <div>
            <SectionLabel>Direct Outreach</SectionLabel>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-6">
              Ready to Build Your Next{" "}
              <span className="text-violet-400">AI System?</span>
            </h2>
            <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-white/60 text-sm leading-relaxed mb-8">
              Whether you are hiring for a full-time AI role, scaling a specialized agent pipeline, or seeking an architectural consultation — I reply within 24 hours.
            </p>

            <div className="space-y-4 mb-8">
              {[
                { icon: Mail, label: "muneeb244535@gmail.com", href: "mailto:muneeb244535@gmail.com", isAction: true },
                { icon: MessageSquare, label: "+92 341 2503538 (WhatsApp)", href: "https://wa.me/923412503538" },
                { icon: Github, label: "github.com/MuneebMalik244535", href: "https://github.com/MuneebMalik244535" },
                { icon: Linkedin, label: "linkedin.com/in/muneeb-malik-m-1727942b7", href: "https://www.linkedin.com/in/muneeb-malik-m-1727942b7/" }
              ].map(({ icon: Icon, label, href, isAction }) => (
                <a
                  key={label}
                  href={href}
                  target={isAction ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-white/60 hover:text-violet-300 transition-colors group cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-xl border border-white/10 group-hover:border-violet-500/40 bg-white/[0.02] flex items-center justify-center transition-colors">
                    <Icon size={16} />
                  </div>
                  <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-xs">
                    {label}
                  </span>
                </a>
              ))}
            </div>

            <button
              onClick={onContactModalOpen}
              className="px-5 py-2.5 rounded-xl border border-violet-500/30 bg-violet-500/10 text-violet-300 hover:bg-violet-500/20 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles size={14} /> Open Quick Connect Card
            </button>
          </div>

          {/* Right Form */}
          <form onSubmit={handleSubmit} className="p-8 rounded-2xl border border-white/10 bg-[#0d0d10] space-y-4 shadow-xl">
            <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-lg font-bold text-white mb-2">
              Send a Direct Project Brief
            </h3>

            <div>
              <label style={{ fontFamily: "'Inter', sans-serif" }} className="block text-xs text-white/50 mb-1.5 font-medium">Your Name</label>
              <input
                type="text"
                placeholder="Alex Vance"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-violet-500 transition-colors"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
            </div>

            <div>
              <label style={{ fontFamily: "'Inter', sans-serif" }} className="block text-xs text-white/50 mb-1.5 font-medium">Work Email</label>
              <input
                type="email"
                placeholder="alex@company.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-violet-500 transition-colors"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
            </div>

            <div>
              <label style={{ fontFamily: "'Inter', sans-serif" }} className="block text-xs text-white/50 mb-1.5 font-medium">Project Scope / Requirements</label>
              <textarea
                rows={4}
                placeholder="What AI agent, pipeline, or architecture are you looking to build?"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/25 text-sm focus:outline-none focus:border-violet-500 transition-colors resize-none"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
            </div>

            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="w-full py-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center text-emerald-400 text-xs font-semibold"
                >
                  ✓ Brief received! I will get back to you within 24 hours.
                </motion.div>
              ) : (
                <motion.button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(124,58,237,0.35)] flex items-center justify-center gap-2 cursor-pointer"
                  style={{ fontFamily: "'Geist Mono', monospace" }}
                >
                  <Send size={14} /> Send Message
                </motion.button>
              )}
            </AnimatePresence>
          </form>
        </div>
      </div>
    </Section>
  );
}

// ─── Section 13: Footer ───────────────────────────────────────────────────────

function Footer() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="border-t border-white/5 py-12 px-6 bg-[#050507]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 font-bold text-xs">
            MM
          </div>
          <span className="w-px h-4 bg-white/15" />
          <span style={{ fontFamily: "'Inter', sans-serif" }} className="text-xs text-white/50">
            Muneeb Malik · AI Agent & Systems Engineer
          </span>
        </div>

        <div className="flex flex-wrap gap-6 text-xs text-white/40" style={{ fontFamily: "'Geist Mono', monospace" }}>
          <button onClick={() => scrollTo("hero")} className="hover:text-white transition-colors cursor-pointer">Home</button>
          <button onClick={() => scrollTo("video-theater")} className="hover:text-white transition-colors cursor-pointer">Live Demos</button>
          <button onClick={() => scrollTo("projects")} className="hover:text-white transition-colors cursor-pointer">Projects</button>
          <button onClick={() => scrollTo("services")} className="hover:text-white transition-colors cursor-pointer">Services</button>
          <button onClick={() => scrollTo("skills")} className="hover:text-white transition-colors cursor-pointer">Skills</button>
          <button onClick={() => scrollTo("contact")} className="hover:text-white transition-colors cursor-pointer">Contact</button>
        </div>

        <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-xs text-white/30">
          © {new Date().getFullYear()} Muneeb Malik. Engineered for production.
        </p>
      </div>
    </footer>
  );
}

// ─── Particles ────────────────────────────────────────────────────────────────

function Particles() {
  const particles = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 1.6 + 0.6,
    duration: Math.random() * 18 + 14,
    delay: Math.random() * -20,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-violet-400/20"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{ y: [-15, 15, -15], opacity: [0.15, 0.45, 0.15] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

// ─── Contact Modal ────────────────────────────────────────────────────────────

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("muneeb244535@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.45 }}
            className="relative bg-[#0d0d10] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-xl font-bold text-white tracking-tight">
                  Direct Connect
                </h3>
                <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-xs text-white/40">
                  Connect with Muneeb Malik
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            <div className="space-y-3.5">
              {/* Email */}
              <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400">
                    <Mail size={16} />
                  </div>
                  <div>
                    <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-[11px] text-white/40 font-medium">Work Email</p>
                    <p style={{ fontFamily: "'Geist Mono', monospace" }} className="text-xs font-semibold text-white">muneeb244535@gmail.com</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleCopyEmail}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-white/80 text-xs font-medium transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check size={13} className="text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={13} />
                        <span>Copy Email</span>
                      </>
                    )}
                  </button>
                  <a
                    href="mailto:muneeb244535@gmail.com"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-colors"
                  >
                    <ExternalLink size={13} />
                    <span>Send Email</span>
                  </a>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <MessageSquare size={16} />
                  </div>
                  <div>
                    <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-[11px] text-white/40 font-medium">WhatsApp Direct</p>
                    <p style={{ fontFamily: "'Geist Mono', monospace" }} className="text-xs font-semibold text-white">+92 341 2503538</p>
                  </div>
                </div>

                <a
                  href="https://wa.me/923412503538"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors"
                >
                  <ExternalLink size={13} />
                  <span>Open WhatsApp Chat</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (loaded) {
      window.scrollTo(0, 0);
    }
  }, [loaded]);

  return (
    <div
      className="bg-[#050505] min-h-screen text-white relative selection:bg-violet-600 selection:text-white"
      style={{ fontFamily: "'Inter', sans-serif", cursor: "none" }}
    >
        <style>{`
          @keyframes marquee {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          ::-webkit-scrollbar { display: none; }
          * { scrollbar-width: none; }
        `}</style>

        <AnimatePresence>
          {!loaded && <LoadingScreen onDone={() => setLoaded(true)} />}
        </AnimatePresence>

        {loaded && (
          <>
            <CustomCursor />
            <Particles />
            <Navbar onContactClick={() => setContactModalOpen(true)} />

            <main className="relative z-10">
              {/* Section 1 & 2: Hero Section (The Hook) */}
              <Hero onContactClick={() => setContactModalOpen(true)} />

              {/* Section 3: High-Credibility Stats Bar */}
              <StatsBar />

              {/* Section 4: Live Video Demo Theater (MOVED UP FOR HR CONVERSION) */}
              <VideoTheater onSelectProject={setSelectedProject} />

              {/* Section 5: Featured Projects */}
              <Projects onSelectProject={setSelectedProject} />

              {/* Section 6: Services & Offerings */}
              <Services onContactClick={() => setContactModalOpen(true)} />

              {/* Section 7: Skills Orbit & Technical Matrix */}
              <SkillsOrbit />

              {/* Section 8: Experience Timeline */}
              <Experience />

              {/* Section 9: Scrolling Tech Marquee */}
              <TechMarquee />

              {/* Section 10: Testimonials & Proof */}
              <Testimonials />

              {/* Section 11: Contact Section */}
              <Contact onContactModalOpen={() => setContactModalOpen(true)} />
            </main>

            <Footer />

            <ContactModal
              isOpen={contactModalOpen}
              onClose={() => setContactModalOpen(false)}
            />

            {selectedProject && (
              <ProjectModal
                project={selectedProject}
                onClose={() => setSelectedProject(null)}
              />
            )}
          </>
        )}
      </div>
  );
}
