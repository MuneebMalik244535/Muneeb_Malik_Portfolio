import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import {
  Github, Linkedin, Mail, ExternalLink, X, ChevronLeft, ChevronRight,
  Download, ArrowRight, Terminal, Cpu, Globe, Zap, MessageSquare,
  Code2, Server, BrainCircuit, Menu, Copy, Check, Play, Pause, Volume2, VolumeX, Tv
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Project {
  id: number;
  title: string;
  description: string;
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
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const projects: Project[] = [
  {
    id: 1,
    title: "AI Dental Clinic Assistant",
    description: "Autonomous patient care agent that handles appointment scheduling, FAQ answering, and dental software synchronization over phone and web chat.",
    tech: ["Python", "FastAPI", "Twilio API", "OpenAI GPT-4o", "PostgreSQL"],
    color: "#7C3AED",
    image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=900&h=600&fit=crop&auto=format",
    github: "https://github.com/MuneebMalik244535",
    demo: "https://demo.example.com",
    overview: "An automated voice and chat assistant designed for dental clinics. It integrates with Twilio for inbound/outbound calls and SMS, handles patient queries with a HIPAA-compliant context store, and automates appointment bookings in the clinic calendar.",
    challenges: "Handling messy natural language schedules (e.g. 'next Tuesday afternoon or maybe Thursday morning') and ensuring real-time slot checking without double booking, solved via constrained LLM output parsing and pessimistic slot locking.",
    architecture: "Twilio webhook stream → Voice/Chat Orchestrator → RAG dental information agent → Calendar booking agent → SMS notification client. PostgreSQL holds local database cache.",
    videoUrl: "/videos/dental_clinic.mp4"
  },
  {
    id: 2,
    title: "MCP File Manager",
    description: "A Model Context Protocol server exposing a full filesystem interface to LLM clients — read, write, search, diff, and execute operations through natural language.",
    tech: ["TypeScript", "MCP Protocol", "Node.js", "Zod", "SSE"],
    color: "#0EA5E9",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=900&h=600&fit=crop&auto=format",
    github: "https://github.com/MuneebMalik244535",
    demo: "https://demo.example.com",
    overview: "An MCP-compliant server that gives Claude, Cursor, and other LLM tools full programmatic access to the local or remote filesystem via a clean, schema-validated tool surface with permission scoping.",
    challenges: "Preventing path traversal and permission escalation while keeping the tool surface ergonomic required a capability-based access model with per-session sandboxing.",
    architecture: "Node.js MCP server over stdio/SSE transports. Zod schemas enforce all tool inputs. Capability tokens are issued per session and validated on every operation."
  },
  {
    id: 3,
    title: "Multi-Agent Research System",
    description: "Collaborative agent swarm for deep research — planner, searcher, analyst, and writer agents coordinate to produce 20-page research briefs in under 4 minutes.",
    tech: ["Python", "LangGraph", "Tavily API", "OpenAI", "FastAPI"],
    color: "#059669",
    image: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=900&h=600&fit=crop&auto=format",
    github: "https://github.com/MuneebMalik244535",
    demo: "https://demo.example.com",
    overview: "A LangGraph-powered multi-agent research pipeline with four specialized agents: Planner decomposes research questions, Searcher retrieves 40+ sources in parallel, Analyst extracts insights, and Writer synthesizes the final report.",
    challenges: "Coordinating parallel web searches without rate-limiting and merging contradictory sources required a consensus layer where the Analyst reconciles conflicting claims with source weighting.",
    architecture: "LangGraph stateful graph with conditional edges handles agent routing. Tavily provides deep web search. All agent state persists to PostgreSQL for resumable long-running sessions.",
    videoUrl: "/videos/multi-agent.mp4"
  },
  {
    id: 4,
    title: "Resume Screening Agent",
    description: "AI hiring assistant that parses resumes, scores candidates against job requirements, identifies red flags, and generates structured evaluation reports — at scale.",
    tech: ["Python", "OpenAI", "LangChain", "PostgreSQL", "Celery"],
    color: "#F59E0B",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=900&h=600&fit=crop&auto=format",
    github: "https://github.com/MuneebMalik244535",
    demo: "https://demo.example.com",
    overview: "Fully automated resume screening pipeline that ingests PDFs, extracts structured candidate profiles using GPT-4o with function calling, scores against configurable rubrics, and produces ranked shortlists with explanations.",
    challenges: "Eliminating demographic bias while maintaining ranking accuracy required careful prompt engineering with blind scoring (name/gender/location removed before evaluation) and fairness auditing.",
    architecture: "Celery workers handle batch PDF parsing. GPT-4o with structured outputs extracts candidate fields. A PostgreSQL scoring store tracks evaluations with full explainability logs.",
    videoUrl: "/videos/resume-analyzer.mp4"
  },
  {
    id: 5,
    title: "AI Sales Assistant",
    description: "End-to-end sales intelligence agent — lead enrichment, hyper-personalized outreach generation, objection handling, and CRM sync with zero manual input.",
    tech: ["Python", "OpenAI", "Playwright", "HubSpot API", "Zapier"],
    color: "#EF4444",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&h=600&fit=crop&auto=format",
    github: "https://github.com/MuneebMalik244535",
    demo: "https://demo.example.com",
    overview: "An autonomous sales pipeline that scrapes and enriches leads from LinkedIn and company websites, generates context-aware cold outreach, handles follow-up sequences, and pushes all activity to HubSpot CRM via webhooks.",
    challenges: "Avoiding spam filters while maintaining personalization at scale required domain-specific prompt fine-tuning, rate-limited sending schedules, and DKIM/SPF-aware reply detection.",
    architecture: "Playwright browser agents handle web research. OpenAI generates personalized multi-touch sequences. Zapier webhooks trigger CRM record creation and deal stage updates bidirectionally.",
    videoUrl: "/videos/lead-generator.mp4"
  },
  {
    id: 6,
    title: "RAG Knowledge Assistant",
    description: "Adaptive retrieval-augmented generation system with hybrid search, query rewriting, self-reflection loops, and citation-grounded answers — hallucination rate under 2%.",
    tech: ["Python", "LangGraph", "Pinecone", "FastAPI", "LangSmith"],
    color: "#8B5CF6",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=900&h=600&fit=crop&auto=format",
    github: "https://github.com/MuneebMalik244535",
    demo: "https://demo.example.com",
    overview: "A sophisticated RAG pipeline using LangGraph's stateful graph to route queries through adaptive retrieval strategies, self-reflection nodes, and grounded generation with inline citation tracking and answer confidence scoring.",
    challenges: "Reducing hallucination below 2% required a dual-path verification system: a judge model checks factual consistency against retrieved chunks before the final response is returned.",
    architecture: "LangGraph conditional edges drive query routing. Pinecone handles hybrid vector + keyword search. LangSmith provides full trace observability and automated evaluation harnesses.",
    videoUrl: "/videos/NLP.mp4"
  },
  {
    id: 7,
    title: "AI Travel Planner",
    description: "An intelligent travel assistant that designs personalized day-by-day itineraries, suggestions, and routes based on budget and interests.",
    tech: ["Next.js", "FastAPI", "OpenAI", "Tavily API", "Tailwind CSS"],
    color: "#06B6D4",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=900&h=600&fit=crop&auto=format",
    github: "https://github.com/MuneebMalik244535",
    demo: "https://demo.example.com",
    overview: "A full-stack travel planner powered by GPT-4o and Tavily API. Users input their destination, trip duration, budget, and interests, and the system generates a dynamic daily itinerary with mapped routes, weather alerts, and restaurant recommendations.",
    challenges: "Reconciling conflicting travel times and mapping a logical route between multiple points of interest. Solved by integrating a geographic clustering algorithm and prompting the model to sequence locations by distance.",
    architecture: "Next.js Frontend → FastAPI Orchestrator → LLM Itinerary Planner → Tavily Search API for real-time recommendations → OpenWeatherMap API for weather data.",
    videoUrl: "/videos/ai-travel.mp4"
  },
  {
    id: 8,
    title: "Enterprise AI Chatbot",
    description: "A scalable, production-ready conversational assistant that answers customer support questions using company documentation with custom styling.",
    tech: ["React", "Node.js", "LangChain", "Pinecone", "Socket.io"],
    color: "#10B981",
    image: "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=900&h=600&fit=crop&auto=format",
    github: "https://github.com/MuneebMalik244535",
    demo: "https://demo.example.com",
    overview: "An enterprise-grade customer chatbot that uses WebSockets for real-time chat. It queries private corporate documents stored in Pinecone to deliver citation-backed answers while maintaining security guidelines.",
    challenges: "Managing user session memory across multiple server instances. Solved by using Redis to store conversational history and feeding the summarized context into each LLM query.",
    architecture: "React Chat Widget → Node.js Gateway (Socket.io) → LangChain Memory Router → OpenAI API (GPT-4o) + Pinecone vector index.",
    videoUrl: "/videos/chatbot.mp4"
  },
  {
    id: 9,
    title: "AI Resume Data Extractor",
    description: "A batch processing tool that extracts structured JSON data from unstructured PDF resumes with high accuracy.",
    tech: ["Python", "PyMuPDF", "OpenAI Structured Outputs", "FastAPI", "MongoDB"],
    color: "#F97316",
    image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=900&h=600&fit=crop&auto=format",
    github: "https://github.com/MuneebMalik244535",
    demo: "https://demo.example.com",
    overview: "A high-performance pipeline designed to parse hundreds of resume PDFs in parallel. It uses advanced PDF text-extraction techniques to retrieve raw layout text, and passes it to GPT-4o-mini using JSON schema-validation to structure work history, skills, and education.",
    challenges: "Handling multi-column resume layouts which typically read in scrambled order in raw PDF text. Solved by implementing PyMuPDF block coordinate sorting to read columns chronologically.",
    architecture: "FastAPI endpoint → PyMuPDF parser → coordinate sorter → OpenAI client (Structured Outputs) → MongoDB repository.",
    videoUrl: "/videos/resume_data_extractor.mp4"
  },
];

const experiences: Experience[] = [
  {
    year: "2024 – Present",
    role: "AI Agent Developer",
    company: "Freelance / Remote",
    description: "Building production AI agents, MCP servers, and multi-agent systems for global clients. Delivering end-to-end solutions from architecture to deployment.",
    type: "AI Development"
  },
  {
    year: "2023 – 2024",
    role: "Backend API Engineer",
    company: "AI Startup (Remote)",
    description: "Designed and shipped RESTful and GraphQL APIs powering AI-driven SaaS products. Optimized inference pipelines reducing latency by 40%.",
    type: "Engineering"
  },
  {
    year: "2022 – 2023",
    role: "SEO & Growth Strategist",
    company: "Digital Agency",
    description: "Led technical SEO campaigns generating 300% organic traffic growth. Built automation scripts for content auditing and rank tracking.",
    type: "Growth"
  },
  {
    year: "2021 – 2022",
    role: "Programming Instructor",
    company: "EdTech Platform",
    description: "Taught Python, data structures, and AI fundamentals to 500+ students. Designed curriculum bridging academic theory with industry practice.",
    type: "Teaching"
  },
];

const services = [
  {
    icon: BrainCircuit,
    title: "AI Agent Development",
    description: "Custom autonomous agents using OpenAI SDK, LangGraph, and Claude — from single-agent tools to complex multi-agent orchestration systems.",
    color: "#7C3AED"
  },
  {
    icon: Zap,
    title: "Automation Systems",
    description: "End-to-end workflow automation connecting AI models, databases, and third-party APIs to eliminate repetitive work at scale.",
    color: "#059669"
  },
  {
    icon: Server,
    title: "Backend APIs",
    description: "High-performance FastAPI and Node.js services with clean architecture, proper authentication, and production-grade observability.",
    color: "#D97706"
  },
  {
    icon: MessageSquare,
    title: "AI Consulting",
    description: "Strategic guidance on AI adoption, model selection, agent architecture, and building responsible AI systems that ship to production.",
    color: "#DC2626"
  }
];

const testimonials = [
  {
    text: "Muneeb built our entire AI agent pipeline from scratch in two weeks. The quality and speed were genuinely impressive. It runs flawlessly in production.",
    name: "Sarah Chen",
    role: "CTO, DataFlow AI",
    avatar: "SC"
  },
  {
    text: "The MCP server he delivered integrated seamlessly with our existing Claude setup. He understood exactly what we needed before we even finished explaining.",
    name: "Alex Rivera",
    role: "Founder, Automata Labs",
    avatar: "AR"
  },
  {
    text: "Professional, fast, and technically exceptional. The RAG system he architected reduced our hallucination rate from 15% to under 2%. Remarkable work.",
    name: "James Okafor",
    role: "Head of Product, NeuralStack",
    avatar: "JO"
  }
];

const techStack = [
  "Python", "OpenAI SDK", "LangGraph", "MCP Protocol", "FastAPI", "TypeScript",
  "Next.js", "Docker", "PostgreSQL", "Redis", "Pinecone", "LangSmith",
  "Playwright", "Git", "AWS", "Anthropic Claude", "Node.js", "Tailwind CSS"
];

const orbitTechnologies = [
  { name: "Python", angle: 0, radius: 160, level: "Expert" },
  { name: "OpenAI SDK", angle: 40, radius: 160, level: "Expert" },
  { name: "MCP", angle: 80, radius: 160, level: "Advanced" },
  { name: "FastAPI", angle: 120, radius: 160, level: "Expert" },
  { name: "LangGraph", angle: 160, radius: 160, level: "Advanced" },
  { name: "Docker", angle: 200, radius: 160, level: "Intermediate" },
  { name: "Next.js", angle: 240, radius: 160, level: "Advanced" },
  { name: "TypeScript", angle: 280, radius: 160, level: "Advanced" },
  { name: "PostgreSQL", angle: 320, radius: 160, level: "Intermediate" },
  { name: "Git", angle: 355, radius: 160, level: "Expert" },
];

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useMousePositionRef() {
  const ref = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const h = (e: MouseEvent) => { ref.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", h, { passive: true });
    return () => window.removeEventListener("mousemove", h);
  }, []);
  return ref;
}

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

  const r = hoverType === "default" ? 6 : hoverType === "button" ? 20 : 40;

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
          animate={{ x: pos.x - 40, y: pos.y - 40, opacity: 1 }}
          initial={{ opacity: 0 }}
          style={{ width: 80, height: 80 }}
        >
          <span className="text-[10px] font-medium text-black tracking-wide leading-tight text-center">View<br />Project</span>
        </motion.div>
      )}
    </>
  );
}

// ─── Loading Screen ───────────────────────────────────────────────────────────

function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);

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
          setTimeout(onDone, 700);
        }, 200);
      }
    };
    requestAnimationFrame(raf);
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[9998] flex flex-col items-center justify-center bg-black"
      animate={exiting ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
    >
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-8"
      >
        <div className="w-24 h-24 rounded-2xl border border-white/10 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-transparent" />
          <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-5xl font-bold text-white tracking-tighter">M</span>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
        className="text-2xl font-semibold text-white tracking-tight mb-1"
      >
        Muneeb Malik
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        style={{ fontFamily: "'Geist Mono', monospace" }}
        className="text-xs text-white/40 tracking-widest uppercase mb-12"
      >
        Initializing Portfolio...
      </motion.p>

      {/* Progress bar */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0.8 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 0.4 }}
        className="w-48 h-px bg-white/10 relative overflow-hidden"
      >
        <motion.div
          className="absolute inset-y-0 left-0 bg-violet-500"
          style={{ width: `${progress * 100}%` }}
          transition={{ ease: "linear" }}
        />
      </motion.div>
    </motion.div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const links = ["Home", "Projects", "Skills", "Experience", "Contact"];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id.toLowerCase());
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
          scrolled ? "bg-black/60 backdrop-blur-xl border border-white/8" : "bg-transparent"
        }`}
      >
        <button onClick={() => scrollTo("home")} className="flex items-center gap-2">
          <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-xl font-bold text-white tracking-tighter">MM</span>
        </button>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <button
              key={link}
              onClick={() => scrollTo(link)}
              className="relative text-sm text-white/60 hover:text-white transition-colors duration-200 group"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {link}
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-violet-500 group-hover:w-full transition-all duration-300" />
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <a
            href="#"
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-violet-500/50 text-violet-400 hover:bg-violet-500/10 transition-all duration-200 text-sm"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <Download size={14} />
            Resume
          </a>
        </div>

        <button className="md:hidden text-white/60" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden mt-2 max-w-6xl mx-auto bg-black/90 backdrop-blur-xl border border-white/8 rounded-2xl p-4"
          >
            {links.map(link => (
              <button
                key={link}
                onClick={() => scrollTo(link)}
                className="block w-full text-left px-4 py-3 text-white/70 hover:text-white text-sm"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                {link}
              </button>
            ))}
            <a href="#" className="flex items-center gap-2 px-4 py-3 text-violet-400 text-sm">
              <Download size={14} /> Resume
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function FloatingAIOrb() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Outer rings */}
      <div className="absolute w-80 h-80 rounded-full border border-violet-500/10 animate-[spin_20s_linear_infinite]" />
      <div className="absolute w-64 h-64 rounded-full border border-violet-500/15 animate-[spin_15s_linear_infinite_reverse]" />
      <div className="absolute w-48 h-48 rounded-full border border-violet-500/20 animate-[spin_10s_linear_infinite]" />

      {/* Orbiting dots */}
      {[0, 60, 120, 180, 240, 300].map((deg, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            animation: `spin ${8 + i}s linear infinite`,
            width: 240 + i * 10,
            height: 240 + i * 10,
            borderRadius: "50%",
          }}
        >
          <div
            className="absolute w-2 h-2 rounded-full bg-violet-400/60"
            style={{ top: 0, left: "50%", transform: "translateX(-50%)", boxShadow: "0 0 8px #7C3AED" }}
          />
        </div>
      ))}

      {/* Central glowing core */}
      <motion.div
        animate={{ scale: [1, 1.05, 1], opacity: [0.9, 1, 0.9] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-36 h-36 rounded-full bg-gradient-to-br from-violet-600 to-violet-900 flex items-center justify-center"
        style={{ boxShadow: "0 0 80px rgba(124,58,237,0.4), 0 0 40px rgba(124,58,237,0.2)" }}
      >
        <BrainCircuit size={48} className="text-white/90" />
      </motion.div>

      {/* Floating tech labels */}
      {[
        { label: "GPT-4o", top: "10%", left: "70%" },
        { label: "Claude", top: "25%", left: "5%" },
        { label: "MCP", top: "70%", left: "75%" },
        { label: "LangGraph", top: "75%", left: "5%" },
      ].map(({ label, top, left }) => (
        <motion.div
          key={label}
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, ease: "easeInOut", delay: Math.random() * 2 }}
          className="absolute px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 backdrop-blur-md text-xs text-white/70"
          style={{ top, left, fontFamily: "'Geist Mono', monospace" }}
        >
          {label}
        </motion.div>
      ))}
    </div>
  );
}

function Hero({ onEmailClick }: { onEmailClick: () => void }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (!sectionRef.current || !orbRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const x = (e.clientX - cx) / 40;
      const y = (e.clientY - cy) / 40;
      orbRef.current.style.transform = `translate(${x}px, ${y}px)`;
    };
    window.addEventListener("mousemove", h, { passive: true });
    return () => window.removeEventListener("mousemove", h);
  }, []);

  return (
    <section id="home" ref={sectionRef} className="min-h-screen flex items-center relative overflow-hidden px-6 pt-24">
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-800/6 rounded-full blur-3xl" />
      </div>

      {/* Subtle grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "60px 60px" }}
      />

      <div className="max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-16 items-center">
        {/* Left */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.7 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/8 mb-6"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-xs text-violet-300/80 tracking-wide">Available for Projects</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            className="text-5xl md:text-6xl font-bold text-white leading-[1.05] tracking-tight mb-6"
          >
            Building Intelligent{" "}
            <span className="text-violet-400">AI Systems</span>{" "}
            That Solve Real Problems
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
            style={{ fontFamily: "'Inter', sans-serif" }}
            className="text-base text-white/50 leading-relaxed mb-10 max-w-lg"
          >
            I build production-ready AI Agents, MCP Servers, Multi-Agent Systems, AI Automations, and scalable backend solutions using Python and modern AI frameworks.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.7 }}
            className="flex flex-wrap gap-3 mb-10"
          >
            <button
              onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(124,58,237,0.4)]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              View Projects <ArrowRight size={15} />
            </button>
            <a
              href="#"
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-white/70 hover:text-white hover:border-white/20 text-sm transition-all duration-200 hover:-translate-y-0.5"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <Download size={15} /> Download CV
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="flex items-center gap-4"
          >
            {[
              { icon: Github, href: "https://github.com/MuneebMalik244535", label: "GitHub" },
              { icon: Linkedin, href: "https://www.linkedin.com/in/muneeb-malik-m-1727942b7/", label: "LinkedIn" },
              { icon: Mail, href: "#", label: "Email", onClick: (e: React.MouseEvent) => { e.preventDefault(); onEmailClick(); } },
            ].map(({ icon: Icon, href, label, onClick }) => (
              <a
                key={label}
                href={href}
                onClick={onClick}
                target={onClick ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/40 hover:text-white/80 transition-colors duration-200 text-sm cursor-pointer"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                <Icon size={18} />
                <span>{label}</span>
              </a>
            ))}
          </motion.div>
        </div>

        {/* Right – parallax orb */}
        <div
          ref={orbRef}
          className="relative h-[480px] hidden md:block"
          style={{ transition: "transform 0.15s ease-out", willChange: "transform" }}
        >
          <FloatingAIOrb />
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <div className="w-px h-12 bg-gradient-to-b from-transparent to-violet-500/50" />
      </motion.div>
    </section>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.section
      id={id}
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontFamily: "'Geist Mono', monospace" }} className="text-xs text-violet-400/80 tracking-[0.2em] uppercase mb-4">
      {children}
    </p>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
      {children}
    </h2>
  );
}

// ─── Project Modal ────────────────────────────────────────────────────────────

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
        className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="bg-[#0f0f10] border border-white/8 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        >
          <div className="relative h-64 md:h-80 overflow-hidden rounded-t-3xl bg-black">
            {project.videoUrl ? (
              <video
                src={project.videoUrl}
                controls
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-contain"
                style={{ outline: "none" }}
              />
            ) : (
              <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
            )}
            <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#0f0f10] to-transparent pointer-events-none" />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 backdrop-blur flex items-center justify-center text-white/70 hover:text-white border border-white/10 transition-colors z-10"
            >
              <X size={14} />
            </button>
          </div>

          <div className="p-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {project.tech.map((t) => (
                <span key={t} style={{ fontFamily: "'Geist Mono', monospace" }} className="px-2.5 py-1 text-xs rounded-md bg-white/5 text-white/50 border border-white/8">
                  {t}
                </span>
              ))}
            </div>

            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-3xl font-bold text-white mb-4">{project.title}</h2>

            <div className="space-y-6">
              {[
                { title: "Overview", content: project.overview },
                { title: "Challenges Solved", content: project.challenges },
                { title: "Architecture", content: project.architecture },
              ].map(({ title, content }) => (
                <div key={title}>
                  <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-sm font-semibold text-white/50 uppercase tracking-widest mb-2">{title}</h3>
                  <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-white/70 text-sm leading-relaxed">{content}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-8">
              <a href={project.github} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-white/70 hover:text-white text-sm transition-all duration-200"
                style={{ fontFamily: "'Inter', sans-serif" }}>
                <Github size={15} /> GitHub
              </a>
              <a href={project.demo} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm transition-all duration-200"
                style={{ fontFamily: "'Inter', sans-serif" }}>
                <ExternalLink size={15} /> Live Demo
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Projects ─────────────────────────────────────────────────────────────────

function Projects() {
  const [active, setActive] = useState<Project | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -420 : 420, behavior: "smooth" });
  };

  return (
    <Section id="projects" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-16">
          <div>
            <SectionLabel>Selected Work</SectionLabel>
            <SectionHeading>Featured Projects</SectionHeading>
          </div>
          <div className="hidden md:flex gap-2">
            {[ChevronLeft, ChevronRight].map((Icon, i) => (
              <button
                key={i}
                onClick={() => scroll(i === 0 ? "left" : "right")}
                className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/20 transition-all duration-200"
              >
                <Icon size={18} />
              </button>
            ))}
          </div>
        </div>

        {/* Carousel */}
        <div ref={scrollRef} className="flex gap-6 overflow-x-auto pb-4 scroll-smooth" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              data-cursor="project"
              onClick={() => setActive(project)}
              className="relative flex-none w-[380px] md:w-[420px] rounded-2xl overflow-hidden cursor-pointer group border border-white/8 bg-[#0d0d0f] hover:border-white/15 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
              style={{ ["--glow" as string]: project.color }}
            >
              <div className="relative h-52 overflow-hidden">
                <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0f] via-transparent to-transparent" />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                  style={{ background: `radial-gradient(circle at 50% 50%, ${project.color}, transparent 60%)` }}
                />
              </div>

              <div className="p-6">
                <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-xl font-bold text-white mb-2 group-hover:text-violet-300 transition-colors duration-300">
                  {project.title}
                </h3>
                <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-sm text-white/50 leading-relaxed mb-4">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.tech.slice(0, 4).map((t) => (
                    <span key={t} style={{ fontFamily: "'Geist Mono', monospace" }} className="px-2 py-0.5 text-[11px] rounded bg-white/5 text-white/40 border border-white/6">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <a href={project.github} target="_blank" rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-white/50 hover:text-white text-xs transition-colors"
                    style={{ fontFamily: "'Inter', sans-serif" }}>
                    <Github size={13} /> GitHub
                  </a>
                  <a href={project.demo} target="_blank" rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors text-white/70 hover:text-white"
                    style={{ fontFamily: "'Inter', sans-serif" }}>
                    <ExternalLink size={13} /> Demo
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {active && <ProjectModal project={active} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </Section>
  );
}

// ─── Video Theater ────────────────────────────────────────────────────────────

function VideoTheater() {
  const videoProjects = projects.filter((p) => p.videoUrl);
  const [selected, setSelected] = useState<Project>(videoProjects[0] || projects[0]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Restart video and autoplay when selection changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setIsPlaying(false);
      });
    }
  }, [selected]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering play/pause on container click
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <Section id="theater" className="py-32 px-6 border-t border-white/5 bg-[#070708] relative overflow-hidden">
      {/* Background radial glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[160px] opacity-15 pointer-events-none transition-all duration-1000"
        style={{
          background: `radial-gradient(circle, ${selected.color} 0%, transparent 70%)`
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <SectionLabel>Live Execution</SectionLabel>
          <SectionHeading>AI Agent Demo Theater</SectionHeading>
          <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-white/40 mt-4 text-sm max-w-xl mx-auto">
            Watch real-time recordings of our advanced AI agents solving real-world business problems.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-10 items-stretch">
          {/* Left Column: Video Screen (8 cols) */}
          <div className="lg:col-span-8 flex flex-col justify-between">
            {/* Screen Container */}
            <div 
              className="relative w-full rounded-2xl overflow-hidden border border-white/10 bg-black group transition-shadow duration-500 cursor-pointer"
              style={{
                boxShadow: `0 0 50px -10px ${selected.color}30`
              }}
              onClick={togglePlay}
            >
              {/* HTML5 Video */}
              <video
                ref={videoRef}
                src={selected.videoUrl}
                loop
                muted={isMuted}
                playsInline
                className="w-full aspect-video object-contain"
              />

              {/* Theater Ambient Light Bar */}
              <div 
                className="absolute top-0 inset-x-0 h-1 opacity-80 blur-[2px] transition-colors duration-1000"
                style={{ backgroundColor: selected.color }}
              />

              {/* Custom Playback Controls Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 pointer-events-none">
                <div className="flex justify-between items-center w-full">
                  <span style={{ fontFamily: "'Geist Mono', monospace" }} className="px-3 py-1 rounded bg-black/60 border border-white/10 text-xs text-white/90">
                    Live Demo
                  </span>
                </div>

                <div className="flex items-center justify-between w-full pointer-events-auto">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                      className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white transition-all cursor-pointer"
                    >
                      {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
                    </button>
                    <button
                      onClick={toggleMute}
                      className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white transition-all cursor-pointer"
                    >
                      {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </button>
                  </div>

                  <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[10px] text-white/40 tracking-wider">
                    {selected.title.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Large Center Play Icon when Paused */}
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none">
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-16 h-16 rounded-full bg-violet-600 border border-violet-500 flex items-center justify-center text-white shadow-2xl"
                  >
                    <Play size={24} className="ml-1" />
                  </motion.div>
                </div>
              )}
            </div>

            {/* Selected Project Info Box */}
            <div className="mt-6 p-6 rounded-2xl border border-white/8 bg-white/[0.01] backdrop-blur-md">
              <div className="flex flex-wrap gap-2 mb-3">
                {selected.tech.map((t) => (
                  <span key={t} style={{ fontFamily: "'Geist Mono', monospace" }} className="px-2 py-0.5 text-[10px] rounded bg-white/5 text-white/40 border border-white/6">
                    {t}
                  </span>
                ))}
              </div>
              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-2xl font-bold text-white mb-2">
                {selected.title}
              </h3>
              <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-sm text-white/60 leading-relaxed mb-4">
                {selected.overview}
              </p>
              <div className="flex gap-3">
                <a href={selected.github} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-white/10 text-white/60 hover:text-white hover:border-white/20 text-xs transition-colors cursor-pointer"
                  style={{ fontFamily: "'Inter', sans-serif" }}>
                  <Github size={14} /> GitHub Repo
                </a>
                <a href={selected.demo} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium transition-colors cursor-pointer"
                  style={{ fontFamily: "'Inter', sans-serif" }}>
                  <ExternalLink size={14} /> Live System
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Playlist Selector (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-2 px-1">
              <Tv size={16} className="text-violet-400" />
              <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-xs text-white/50 tracking-wider uppercase">
                Demonstration Playlist
              </span>
            </div>

            {videoProjects.map((project) => {
              const isCurrent = selected.id === project.id;
              return (
                <button
                  key={project.id}
                  onClick={() => setSelected(project)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 flex flex-col gap-3 group relative overflow-hidden cursor-pointer ${
                    isCurrent 
                      ? "bg-white/[0.03] border-white/15" 
                      : "bg-transparent border-white/5 hover:border-white/10 hover:bg-white/[0.01]"
                  }`}
                >
                  {/* Left indicator glow */}
                  {isCurrent && (
                    <div 
                      className="absolute left-0 inset-y-0 w-1 rounded-l-2xl" 
                      style={{ backgroundColor: project.color }}
                    />
                  )}

                  <div className="flex justify-between items-start">
                    <h4 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className={`font-bold text-base transition-colors ${
                      isCurrent ? "text-white" : "text-white/60 group-hover:text-white"
                    }`}>
                      {project.title}
                    </h4>
                    {isCurrent && (
                      <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: project.color }} />
                    )}
                  </div>

                  <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-xs text-white/40 leading-relaxed line-clamp-2">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {project.tech.slice(0, 3).map((t) => (
                      <span key={t} style={{ fontFamily: "'Geist Mono', monospace" }} className="px-1.5 py-0.5 text-[9px] rounded bg-white/5 text-white/30 border border-white/5">
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
    </Section>
  );
}

// ─── Skills Orbit ─────────────────────────────────────────────────────────────

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
        // throttle setState to ~30fps to avoid flooding React
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
    <Section id="skills" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <SectionLabel>Expertise</SectionLabel>
          <SectionHeading>Technology Orbit</SectionHeading>
          <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-white/40 mt-4 text-sm">Hover any node to explore</p>
        </div>

        <div className="flex justify-center">
          <div className="relative w-[380px] h-[380px] md:w-[440px] md:h-[440px]">
            {/* Orbit rings */}
            <div className="absolute inset-0 rounded-full border border-white/5" />
            <div className="absolute inset-8 rounded-full border border-white/4" />

            {/* Center core */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-600 to-violet-900 flex flex-col items-center justify-center"
                style={{ boxShadow: "0 0 40px rgba(124,58,237,0.3)" }}>
                <Cpu size={24} className="text-white/90 mb-0.5" />
                <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-[9px] text-white/60 tracking-widest">AI CORE</span>
              </div>
            </div>

            {/* Orbiting nodes */}
            {orbitTechnologies.map((tech) => {
              const rad = ((tech.angle + angle) * Math.PI) / 180;
              const r = 170;
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
                  {/* Connection line */}
                  <svg
                    className="absolute pointer-events-none"
                    style={{ width: Math.abs(x) * 2 + 20, height: Math.abs(y) * 2 + 20, top: `${-Math.abs(y) - 10}px`, left: `${-Math.abs(x) - 10}px` }}
                  />

                  <motion.button
                    animate={{ scale: isHovered ? 1.3 : 1 }}
                    onMouseEnter={() => setHovered(tech.name)}
                    onMouseLeave={() => setHovered(null)}
                    className="relative w-11 h-11 rounded-full border flex items-center justify-center text-[10px] font-medium transition-colors duration-200"
                    style={{
                      fontFamily: "'Geist Mono', monospace",
                      borderColor: isHovered ? "rgba(124,58,237,0.6)" : "rgba(255,255,255,0.12)",
                      background: isHovered ? "rgba(124,58,237,0.2)" : "rgba(15,15,16,0.9)",
                      color: isHovered ? "#c4b5fd" : "rgba(255,255,255,0.5)",
                      boxShadow: isHovered ? "0 0 20px rgba(124,58,237,0.3)" : "none",
                    }}
                  >
                    {tech.name.slice(0, 2)}

                    {/* Tooltip */}
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1.5 rounded-lg bg-[#1a1a2e] border border-violet-500/30 text-white text-xs z-10"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        <span className="text-violet-300">{tech.name}</span>
                        <span className="text-white/40 mx-1">·</span>
                        <span className="text-white/50">{tech.level}</span>
                      </motion.div>
                    )}
                  </motion.button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Skill categories below */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20">
          {[
            { icon: BrainCircuit, label: "AI & LLMs", items: ["OpenAI SDK", "Claude API", "LangGraph", "LangChain"] },
            { icon: Code2, label: "Languages", items: ["Python", "TypeScript", "SQL", "Bash"] },
            { icon: Server, label: "Backend", items: ["FastAPI", "Node.js", "Docker", "PostgreSQL"] },
            { icon: Globe, label: "Frontend", items: ["Next.js", "React", "Tailwind", "Framer Motion"] },
          ].map(({ icon: Icon, label, items }) => (
            <div key={label} className="p-5 rounded-2xl border border-white/8 bg-[#0d0d0f] hover:border-violet-500/20 transition-colors duration-300">
              <div className="flex items-center gap-2 mb-4">
                <Icon size={16} className="text-violet-400" />
                <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-sm font-semibold text-white/80">{label}</span>
              </div>
              <div className="space-y-1.5">
                {items.map((item) => (
                  <p key={item} style={{ fontFamily: "'Geist Mono', monospace" }} className="text-xs text-white/40">{item}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

// ─── Experience ───────────────────────────────────────────────────────────────

function Experience() {
  return (
    <Section id="experience" className="py-32 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-16">
          <SectionLabel>Journey</SectionLabel>
          <SectionHeading>Experience</SectionHeading>
        </div>

        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-violet-500/50 via-violet-500/20 to-transparent" />

          <div className="space-y-12">
            {experiences.map((exp, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="pl-12 relative"
              >
                <div className="absolute left-2.5 top-1.5 w-3 h-3 rounded-full border-2 border-violet-500 bg-[#050505]" style={{ boxShadow: "0 0 12px rgba(124,58,237,0.5)" }} />

                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-xs text-violet-400/70">{exp.year}</span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-white/40 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>{exp.type}</span>
                </div>

                <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-xl font-bold text-white mb-0.5">{exp.role}</h3>
                <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-sm text-violet-400/70 mb-3">{exp.company}</p>
                <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-sm text-white/50 leading-relaxed">{exp.description}</p>
              </motion.div>
            ))}

            {/* Open to remote */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="pl-12 relative"
            >
              <div className="absolute left-2 top-1.5 w-4 h-4 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              </div>
              <div className="p-5 rounded-2xl border border-green-500/20 bg-green-500/5">
                <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-lg font-semibold text-green-400 mb-1">Open to Remote Opportunities</p>
                <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-sm text-white/40">Available for full-time roles, contracts, or project-based work with AI-focused teams worldwide.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Section>
  );
}

// ─── Services ─────────────────────────────────────────────────────────────────

function Services() {
  return (
    <Section className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <SectionLabel>What I Offer</SectionLabel>
          <SectionHeading>Services</SectionHeading>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              whileHover={{ y: -4 }}
              className="p-8 rounded-2xl border border-white/8 bg-[#0d0d0f] hover:border-white/15 transition-all duration-300 group"
              style={{ "--service-color": service.color } as React.CSSProperties}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110"
                style={{ background: `${service.color}18`, border: `1px solid ${service.color}30` }}
              >
                <service.icon size={22} style={{ color: service.color }} />
              </div>
              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-xl font-bold text-white mb-3">{service.title}</h3>
              <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-sm text-white/50 leading-relaxed">{service.description}</p>
              <div
                className="mt-6 h-px w-0 group-hover:w-full transition-all duration-500"
                style={{ background: `linear-gradient(90deg, ${service.color}50, transparent)` }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}

// ─── Tech Marquee ─────────────────────────────────────────────────────────────

function TechMarquee() {
  const doubled = [...techStack, ...techStack];

  return (
    <div className="py-16 overflow-hidden border-y border-white/5">
      <div className="flex gap-8 animate-[marquee_25s_linear_infinite] hover:[animation-play-state:paused] whitespace-nowrap w-max">
        {doubled.map((tech, i) => (
          <div key={i} className="flex items-center gap-3 text-white/30 hover:text-white/60 transition-colors duration-200 cursor-default">
            <Terminal size={14} className="text-violet-500/40" />
            <span style={{ fontFamily: "'Geist Mono', monospace" }} className="text-sm">{tech}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

function Testimonials() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % testimonials.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <Section className="py-32 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16">
          <SectionLabel>Social Proof</SectionLabel>
          <SectionHeading>What Clients Say</SectionHeading>
        </div>

        <div className="relative h-64 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="p-8 rounded-2xl border border-white/8 bg-[#0d0d0f] backdrop-blur"
            >
              <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-white/70 text-base leading-relaxed mb-8 italic">
                &ldquo;{testimonials[idx].text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-violet-600/30 border border-violet-500/30 flex items-center justify-center text-xs font-bold text-violet-300"
                  style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                  {testimonials[idx].avatar}
                </div>
                <div>
                  <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-sm font-semibold text-white">{testimonials[idx].name}</p>
                  <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-xs text-white/40">{testimonials[idx].role}</p>
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

// ─── Contact ──────────────────────────────────────────────────────────────────

function Contact({ onEmailClick }: { onEmailClick: () => void }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <Section id="contact" className="py-32 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          <div>
            <SectionLabel>Get In Touch</SectionLabel>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
              Let&apos;s Build Something{" "}
              <span className="text-violet-400">Amazing</span>{" "}
              Together
            </h2>
            <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-white/50 text-sm leading-relaxed mb-10">
              Whether you have a project in mind, want to discuss AI architecture, or just want to connect — I&apos;m always open to meaningful conversations.
            </p>

            <div className="space-y-4">
              {[
                { icon: Mail, label: "muneeb244535@gmail.com", href: "#", onClick: (e: React.MouseEvent) => { e.preventDefault(); onEmailClick(); } },
                { icon: Github, label: "github.com/MuneebMalik244535", href: "https://github.com/MuneebMalik244535" },
                { icon: Linkedin, label: "linkedin.com/in/muneeb-malik-m-1727942b7", href: "https://www.linkedin.com/in/muneeb-malik-m-1727942b7/" },
              ].map(({ icon: Icon, label, href, onClick }) => (
                <a
                  key={label}
                  href={href}
                  onClick={onClick}
                  target={onClick ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-white/50 hover:text-violet-400 transition-colors duration-200 group cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-lg border border-white/8 group-hover:border-violet-500/30 flex items-center justify-center transition-colors duration-200">
                    <Icon size={16} />
                  </div>
                  <span style={{ fontFamily: "'Inter', sans-serif" }} className="text-sm">{label}</span>
                </a>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { key: "name", label: "Name", type: "text", placeholder: "Your name" },
              { key: "email", label: "Email", type: "email", placeholder: "you@company.com" },
            ].map(({ key, label, type, placeholder }) => (
              <div key={key}>
                <label style={{ fontFamily: "'Inter', sans-serif" }} className="block text-xs text-white/40 mb-1.5 tracking-wide">{label}</label>
                <input
                  type={type}
                  placeholder={placeholder}
                  value={form[key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/8 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-violet-500/50 transition-colors duration-200"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
              </div>
            ))}

            <div>
              <label style={{ fontFamily: "'Inter', sans-serif" }} className="block text-xs text-white/40 mb-1.5 tracking-wide">Message</label>
              <textarea
                rows={5}
                placeholder="Tell me about your project..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/8 text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-violet-500/50 transition-colors duration-200 resize-none"
                style={{ fontFamily: "'Inter', sans-serif" }}
              />
            </div>

            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="w-full py-3 rounded-xl bg-green-500/10 border border-green-500/30 text-center text-green-400 text-sm"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Message sent! I&apos;ll get back to you soon.
                </motion.div>
              ) : (
                <motion.button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-all duration-200 hover:shadow-[0_0_30px_rgba(124,58,237,0.3)] flex items-center justify-center gap-2"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Send Message <ArrowRight size={15} />
                </motion.button>
              )}
            </AnimatePresence>
          </form>
        </div>
      </div>
    </Section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  const links = ["Home", "Projects", "Skills", "Experience", "Contact"];

  return (
    <footer className="border-t border-white/5 py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-xl font-bold text-white tracking-tighter">MM</span>
          <span className="w-px h-4 bg-white/15" />
          <span style={{ fontFamily: "'Inter', sans-serif" }} className="text-xs text-white/30">AI Agent Developer</span>
        </div>

        <div className="flex gap-6">
          {links.map((link) => (
            <button
              key={link}
              onClick={() => document.getElementById(link.toLowerCase())?.scrollIntoView({ behavior: "smooth" })}
              style={{ fontFamily: "'Inter', sans-serif" }}
              className="text-xs text-white/30 hover:text-white/60 transition-colors duration-200"
            >
              {link}
            </button>
          ))}
        </div>

        <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-xs text-white/20">
          © {new Date().getFullYear()} Muneeb Malik. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

// ─── Particles ────────────────────────────────────────────────────────────────

function Particles() {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 1.5 + 0.5,
    duration: Math.random() * 20 + 15,
    delay: Math.random() * -20,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-violet-400/20"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{ y: [-20, 20, -20], opacity: [0.1, 0.4, 0.1] }}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative bg-zinc-950/90 border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-[0_0_50px_rgba(124,58,237,0.15)] overflow-hidden"
          >
            {/* Ambient background glow */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between mb-6 relative z-10">
              <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }} className="text-xl font-bold text-white tracking-tight">
                Quick Connect
              </h3>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full border border-white/10 hover:border-white/20 flex items-center justify-center text-white/50 hover:text-white transition-colors duration-200"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content cards */}
            <div className="space-y-4 relative z-10">
              {/* Email Options Card */}
              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 transition-all duration-300 hover:border-violet-500/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400">
                    <Mail size={16} />
                  </div>
                  <div>
                    <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-xs text-white/40 font-medium">Email Address</p>
                    <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-sm font-semibold text-white">muneeb244535@gmail.com</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={handleCopyEmail}
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 text-white/80 hover:text-white text-xs font-medium transition-colors duration-200"
                  >
                    {copied ? (
                      <>
                        <Check size={14} className="text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        <span>Copy Email</span>
                      </>
                    )}
                  </button>
                  <a
                    href="mailto:muneeb244535@gmail.com"
                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium transition-colors duration-200"
                  >
                    <ExternalLink size={14} />
                    <span>Send Mail</span>
                  </a>
                </div>
              </div>

              {/* WhatsApp Card */}
              <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 transition-all duration-300 hover:border-emerald-500/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <MessageSquare size={16} />
                  </div>
                  <div>
                    <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-xs text-white/40 font-medium">WhatsApp</p>
                    <p style={{ fontFamily: "'Inter', sans-serif" }} className="text-sm font-semibold text-white">+92 341 2503538</p>
                  </div>
                </div>

                <a
                  href="https://wa.me/923412503538"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors duration-200"
                >
                  <ExternalLink size={14} />
                  <span>Start Chat</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);

  return (
    <div className="bg-[#050505] min-h-screen" style={{ fontFamily: "'Inter', sans-serif", cursor: "none" }}>
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
          <Navbar />
          <main className="relative z-10">
            <Hero onEmailClick={() => setContactModalOpen(true)} />
            <Projects />
            <VideoTheater />
            <SkillsOrbit />
            <Experience />
            <Services />
            <TechMarquee />
            <Testimonials />
            <Contact onEmailClick={() => setContactModalOpen(true)} />
          </main>
          <Footer />
          <ContactModal isOpen={contactModalOpen} onClose={() => setContactModalOpen(false)} />
        </>
      )}
    </div>
  );
}
