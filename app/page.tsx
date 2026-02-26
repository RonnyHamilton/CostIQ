'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { Box, TrendingUp, Zap, ArrowRight, ChevronRight, BarChart3, Shield, Globe, Cpu, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useRef, useState, useEffect } from 'react'


/* ───── Constants ───── */
const MINT = '#00E096'
const CRIMSON = '#FF2E63'

/* ───── Animation Variants ───── */
const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: 'easeOut' as const },
  }),
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

/* ───── Reusable Section Wrapper ───── */
function Section({ children, className = '', id }: { children: React.ReactNode; className?: string; id?: string }) {
  return (
    <motion.section
      id={id}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={staggerContainer}
      className={`relative px-6 sm:px-8 lg:px-16 xl:px-24 ${className}`}
    >
      {children}
    </motion.section>
  )
}

/* ═══════════════════════════════════════════════════════════
   1. NAVBAR
   ═══════════════════════════════════════════════════════════ */
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl transition-all duration-500 rounded-2xl ${scrolled
        ? 'bg-[#0F1115]/80 backdrop-blur-xl shadow-2xl shadow-black/30 border border-white/[0.06]'
        : 'bg-transparent'
        }`}
    >
      <div className="flex items-center justify-between px-6 py-3.5">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-black font-black text-sm"
            style={{ background: `linear-gradient(135deg, ${MINT}, #2DD4BF)` }}
          >
            IQ
          </div>
          <span className="text-white font-bold text-lg tracking-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Cost<span style={{ color: MINT }}>IQ</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {['Features', 'About'].map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-sm text-white/50 hover:text-white transition-colors duration-300"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {link}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-white/60 hover:text-white transition-colors px-4 py-2"
          >
            Sign In
          </Link>
          <Link
            href="/login"
            className="group relative px-5 py-2.5 rounded-xl text-sm font-semibold text-black overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,224,150,0.4)]"
            style={{ background: `linear-gradient(135deg, ${MINT}, #2DD4BF)` }}
          >
            Launch Dashboard
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white/60" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="md:hidden px-6 pb-5 flex flex-col gap-3 border-t border-white/5"
        >
          {['Features', 'About'].map((link) => (
            <a key={link} href={`#${link.toLowerCase()}`} className="text-sm text-white/50 py-2">
              {link}
            </a>
          ))}
          <Link
            href="/login"
            className="mt-2 text-center px-5 py-2.5 rounded-xl text-sm font-semibold text-black"
            style={{ background: `linear-gradient(135deg, ${MINT}, #2DD4BF)` }}
          >
            Launch Dashboard
          </Link>
        </motion.div>
      )}
    </motion.nav>
  )
}

/* ═══════════════════════════════════════════════════════════
   2. HERO
   ═══════════════════════════════════════════════════════════ */
function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, -120])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.92])

  return (
    <div ref={ref} className="relative pt-36 sm:pt-44 pb-20 overflow-hidden">
      {/* Ambient Glow Blobs */}
      <div className="pointer-events-none absolute top-20 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full opacity-25 blur-[150px]"
        style={{ background: `radial-gradient(circle, ${MINT}40 0%, transparent 70%)` }}
      />
      <div className="pointer-events-none absolute top-40 left-[20%] w-[400px] h-[400px] rounded-full opacity-15 blur-[120px]"
        style={{ background: `radial-gradient(circle, #3B82F640 0%, transparent 70%)` }}
      />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Badge */}
        <motion.div
          variants={fadeUp}
          custom={0}
          initial="hidden"
          animate="visible"
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8"
          style={{
            background: 'rgba(0,224,150,0.08)',
            border: '1px solid rgba(0,224,150,0.15)',
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: MINT }} />
          <span className="text-xs font-medium" style={{ color: MINT }}>Now in Public Beta</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          custom={1}
          initial="hidden"
          animate="visible"
          className="text-5xl sm:text-6xl lg:text-[80px] font-bold leading-[1.05] tracking-tight mb-6"
          style={{ fontFamily: 'Space Grotesk, sans-serif' }}
        >
          <span className="text-white">Manufacturing</span>
          <br />
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(135deg, ${MINT} 0%, #2DD4BF 40%, ${CRIMSON} 100%)`,
              textShadow: 'none',
              WebkitBackgroundClip: 'text',
            }}
          >
            Intelligence.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeUp}
          custom={2}
          initial="hidden"
          animate="visible"
          className="text-lg sm:text-xl text-white/45 max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          Stop losing money in production. CostIQ tracks variance, predicts stockouts,
          and optimizes your factory floor in real-time.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fadeUp}
          custom={3}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/login"
            className="group relative px-8 py-4 rounded-2xl text-base font-bold text-black overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(0,224,150,0.35)] hover:-translate-y-0.5 active:scale-[0.98]"
            style={{ background: `linear-gradient(135deg, ${MINT}, #2DD4BF)` }}
          >
            <span className="relative z-10 flex items-center gap-2">
              Launch Dashboard
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </Link>
        </motion.div>

        {/* 3D Dashboard Preview */}
        <motion.div
          style={{ y: yParallax, scale }}
          className="mt-20 relative"
        >
          {/* Glow blob behind the preview */}
          <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full opacity-30 blur-[80px]"
            style={{ background: `radial-gradient(circle, ${MINT}30 0%, #3B82F620 50%, transparent 100%)` }}
          />

          <div
            className="relative mx-auto max-w-4xl rounded-3xl overflow-hidden border border-white/[0.08]"
            style={{
              perspective: '2000px',
              transform: 'perspective(2000px) rotateX(12deg) scale(0.95)',
              transformStyle: 'preserve-3d',
              boxShadow: `0 60px 120px -30px rgba(0,0,0,0.7), 0 0 80px -20px ${MINT}15`,
            }}
          >
            {/* Simulated Dashboard Screenshot */}
            <div className="bg-[#0a0a0a] p-6 sm:p-8">
              {/* Top bar */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-black font-black text-[10px]"
                    style={{ background: `linear-gradient(135deg, ${MINT}, #2DD4BF)` }}>IQ</div>
                  <span className="text-white/60 text-sm font-medium">CostIQ Dashboard</span>
                </div>
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                </div>
              </div>

              {/* KPI Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                {[
                  { label: 'Net Variance', value: '-₹1.42L', color: MINT, change: '-12.4%' },
                  { label: 'Active Orders', value: '5', color: '#3B82F6', change: '+2' },
                  { label: 'Low Stock', value: '3', color: CRIMSON, change: 'Alert' },
                  { label: 'Savings MTD', value: '₹89K', color: MINT, change: '+8.2%' },
                ].map((kpi, i) => (
                  <div key={i} className="rounded-xl p-3 sm:p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <p className="text-[10px] sm:text-xs text-white/30 mb-1">{kpi.label}</p>
                    <p className="text-lg sm:text-xl font-bold text-white" style={{ fontFamily: 'Space Grotesk' }}>{kpi.value}</p>
                    <p className="text-[10px] mt-1 font-medium" style={{ color: kpi.color }}>{kpi.change}</p>
                  </div>
                ))}
              </div>

              {/* Fake Chart Area */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 rounded-xl p-4 h-40 relative overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <p className="text-xs text-white/30 mb-3">Cost Variance Trend</p>
                  {/* CSS Chart Lines */}
                  <svg viewBox="0 0 300 80" className="w-full h-20 opacity-80">
                    <defs>
                      <linearGradient id="heroMint" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor={MINT} stopOpacity="0.3" />
                        <stop offset="100%" stopColor={MINT} stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d="M0,60 Q30,50 60,45 T120,35 T180,40 T240,25 T300,20" fill="none" stroke={MINT} strokeWidth="2" />
                    <path d="M0,60 Q30,50 60,45 T120,35 T180,40 T240,25 T300,20 L300,80 L0,80 Z" fill="url(#heroMint)" />
                    <path d="M0,55 Q30,60 60,50 T120,55 T180,50 T240,45 T300,40" fill="none" stroke={CRIMSON} strokeWidth="1.5" strokeDasharray="4,4" opacity="0.6" />
                  </svg>
                </div>
                <div className="rounded-xl p-4 h-40" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <p className="text-xs text-white/30 mb-3">By Material</p>
                  {/* Mini bar chart */}
                  <div className="flex items-end gap-2 h-20 px-2">
                    {[65, 82, 45, 90, 55, 70].map((h, i) => (
                      <div key={i} className="flex-1 rounded-t-sm" style={{
                        height: `${h}%`,
                        background: i % 2 === 0 ? `linear-gradient(to top, ${MINT}60, ${MINT})` : 'rgba(255,255,255,0.08)',
                      }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Shine overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-transparent pointer-events-none" />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   3. SOCIAL PROOF MARQUEE
   ═══════════════════════════════════════════════════════════ */
function SocialProof() {
  const logos = ['TextileCo', 'FabriTech', 'LoomCorp', 'SpinDex', 'WeavePro', 'ThreadMill', 'YarnSync', 'DyeCast']

  return (
    <Section className="py-16 border-y border-white/[0.04]">
      <motion.p variants={fadeUp} custom={0} className="text-center text-xs text-white/20 uppercase tracking-[0.2em] mb-8">
        Trusted by leading manufacturers
      </motion.p>
      <div className="relative overflow-hidden">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#0F1115] to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0F1115] to-transparent z-10" />

        <div className="flex gap-16 animate-marquee">
          {[...logos, ...logos].map((name, i) => (
            <div key={i} className="flex items-center gap-2 text-white/20 whitespace-nowrap shrink-0">
              <div className="w-6 h-6 rounded bg-white/5 flex items-center justify-center">
                <span className="text-[8px] font-bold">{name.slice(0, 2).toUpperCase()}</span>
              </div>
              <span className="text-sm font-medium tracking-wide">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}

/* ═══════════════════════════════════════════════════════════
   4. FEATURE GRID (BENTO BOX)
   ═══════════════════════════════════════════════════════════ */
const features = [
  {
    icon: Box,
    title: 'Predictive Stockouts',
    description: 'CostIQ warns you 3 days before you run out of thread. Smart reorder triggers keep your line running.',
    gradient: 'from-blue-500/20 to-cyan-500/20',
  },
  {
    icon: TrendingUp,
    title: 'Real-Time Variance',
    description: 'Track Planned vs Actual cost live. Catch losses instantly with neon-highlighted anomaly cards.',
    gradient: 'from-emerald-500/20 to-green-500/20',
  },
  {
    icon: Zap,
    title: 'Instant MRP',
    description: 'Generate reorder lists with one click based on daily burn rate, lead time, and safety stock levels.',
    gradient: 'from-amber-500/20 to-yellow-500/20',
  },
  {
    icon: BarChart3,
    title: 'Deep Analytics',
    description: 'Material-level cost breakdowns, donut charts for composition, and multi-order trend comparisons.',
    gradient: 'from-purple-500/20 to-indigo-500/20',
  },
  {
    icon: Shield,
    title: 'Multi-Tenant Security',
    description: 'Row-level security ensures your data is yours alone. Every query scoped to your authenticated session.',
    gradient: 'from-rose-500/20 to-pink-500/20',
  },
  {
    icon: Globe,
    title: 'Cloud-Native',
    description: 'Runs on Supabase with edge functions. Access your dashboard from anywhere, on any device.',
    gradient: 'from-teal-500/20 to-emerald-500/20',
  },
]

function FeatureGrid() {
  return (
    <Section id="features" className="py-24 max-w-7xl mx-auto">
      <motion.div variants={fadeUp} custom={0} className="text-center mb-16">
        <p className="text-xs uppercase tracking-[0.2em] mb-4" style={{ color: MINT }}>Features</p>
        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          Enhance team performance
        </h2>
        <p className="text-white/40 max-w-xl mx-auto text-lg">
          Empower your team with intuitive tools and streamlined workflows that eliminate bottlenecks.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            variants={fadeUp}
            custom={i + 1}
            className="group relative rounded-2xl p-6 sm:p-7 transition-all duration-500 hover:-translate-y-1 cursor-default"
            style={{
              background: '#131313',
              border: '1px solid rgba(255,255,255,0.05)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = `${MINT}40`
              e.currentTarget.style.boxShadow = `0 0 40px -10px ${MINT}20`
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            {/* Icon */}
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5`}>
              <feature.icon size={22} className="text-white/80" />
            </div>

            <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              {feature.title}
            </h3>
            <p className="text-sm text-white/40 leading-relaxed mb-5">
              {feature.description}
            </p>

            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-white/30 group-hover:text-white/60 transition-colors">
              Learn More
              <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}

/* ═══════════════════════════════════════════════════════════
   5. NEXUS CORE (VISUAL BREAK)
   ═══════════════════════════════════════════════════════════ */
function NexusCore() {
  return (
    <Section id="about" className="py-28 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Text */}
        <div>
          <motion.p variants={fadeUp} custom={0} className="text-xs uppercase tracking-[0.2em] mb-4" style={{ color: MINT }}>
            The Engine
          </motion.p>
          <motion.h2 variants={fadeUp} custom={1} className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Powered by the<br />
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${MINT}, #2DD4BF)` }}>
              Nexus Engine.
            </span>
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="text-white/40 text-lg leading-relaxed mb-8">
            Millions of data points analyzed per second. Our proprietary engine cross-references BOM costs,
            actual consumption, inventory levels, and supplier lead times to deliver actionable intelligence — not just dashboards.
          </motion.p>
          <motion.div variants={fadeUp} custom={3} className="flex flex-col gap-4">
            {[
              'Real-time variance detection across all production orders',
              'Automated reorder point calculation with safety stock buffers',
              'Predictive analytics for cost overrun prevention',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center mt-0.5 shrink-0" style={{ background: `${MINT}15` }}>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: MINT }} />
                </div>
                <p className="text-sm text-white/50">{item}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* 3D Visual */}
        <motion.div variants={fadeUp} custom={2} className="relative flex items-center justify-center">
          {/* Glow */}
          <div className="absolute w-80 h-80 rounded-full opacity-30 blur-[100px]"
            style={{ background: `radial-gradient(circle, ${MINT}30 0%, transparent 70%)` }}
          />

          {/* The Nexus Core Chip */}
          <div className="relative">
            {/* Outer ring */}
            <div className="w-64 h-64 sm:w-72 sm:h-72 rounded-3xl border border-white/[0.06] flex items-center justify-center"
              style={{
                background: 'radial-gradient(circle at 30% 30%, rgba(0,224,150,0.06) 0%, rgba(19,19,19,0.8) 100%)',
                boxShadow: `inset 0 1px 0 0 rgba(255,255,255,0.04), 0 0 80px -20px ${MINT}15`,
              }}
            >
              {/* Inner chip */}
              <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-2xl border border-white/[0.08] animate-float-slow flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)',
                  boxShadow: `0 20px 60px -20px rgba(0,0,0,0.5), 0 0 40px -10px ${MINT}10`,
                }}
              >
                <Cpu size={48} className="text-white/20" strokeWidth={1} />
              </div>
            </div>

            {/* Orbital dots */}
            {[0, 90, 180, 270].map((deg) => (
              <div
                key={deg}
                className="absolute w-2.5 h-2.5 rounded-full"
                style={{
                  background: MINT,
                  boxShadow: `0 0 12px ${MINT}60`,
                  top: '50%',
                  left: '50%',
                  transform: `rotate(${deg}deg) translateX(160px) translateY(-50%)`,
                  opacity: 0.5,
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </Section>
  )
}

/* ═══════════════════════════════════════════════════════════
   6. CTA SECTION
   ═══════════════════════════════════════════════════════════ */
function CTASection() {
  return (
    <Section className="py-24 max-w-4xl mx-auto">
      <motion.div
        variants={fadeUp}
        custom={0}
        className="relative rounded-3xl p-10 sm:p-16 text-center overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #131313 0%, #0a0a0a 100%)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Background glow */}
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] rounded-full opacity-20 blur-[80px]"
          style={{ background: `radial-gradient(circle, ${MINT}40 0%, transparent 70%)` }}
        />

        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 relative z-10" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          Ready to cut production costs?
        </h2>
        <p className="text-white/40 text-lg mb-8 max-w-xl mx-auto relative z-10">
          Join hundreds of manufacturers saving money with real-time cost intelligence.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
          <Link
            href="/login"
            className="group relative px-8 py-4 rounded-2xl text-base font-bold text-black overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(0,224,150,0.35)] hover:-translate-y-0.5"
            style={{ background: `linear-gradient(135deg, ${MINT}, #2DD4BF)` }}
          >
            <span className="relative z-10 flex items-center gap-2">
              Launch Dashboard
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </Link>
          <Link
            href="#features"
            className="px-8 py-4 rounded-2xl text-base font-semibold text-white/60 hover:text-white border border-white/10 hover:border-white/20 transition-all"
          >
            Explore Features
          </Link>
        </div>
      </motion.div>
    </Section>
  )
}

/* ═══════════════════════════════════════════════════════════
   7. FOOTER
   ═══════════════════════════════════════════════════════════ */
function Footer() {
  return (
    <footer className="border-t border-white/[0.04] px-6 sm:px-8 lg:px-16 xl:px-24 py-12 mt-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-black font-black text-xs"
                style={{ background: `linear-gradient(135deg, ${MINT}, #2DD4BF)` }}>IQ</div>
              <span className="text-white font-bold text-lg" style={{ fontFamily: 'Space Grotesk' }}>
                Cost<span style={{ color: MINT }}>IQ</span>
              </span>
            </div>
            <p className="text-sm text-white/30 leading-relaxed">
              Manufacturing cost intelligence for the modern factory.
            </p>
          </div>

          {/* Links */}
          {[
            { title: 'Product', links: ['Overview', 'Features', 'Changelog'] },
            { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
            { title: 'Legal', links: ['Privacy', 'Terms', 'Security'] },
          ].map((col) => (
            <div key={col.title}>
              <p className="text-xs text-white/50 uppercase tracking-[0.15em] font-semibold mb-4">{col.title}</p>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-white/25 hover:text-white/60 transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-white/[0.04] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/20">© 2026 CostIQ (Nexus Intelligence). All rights reserved.</p>
          <p className="text-xs text-white/20">Built for Hackathon by Webify e-Horyzon</p>
        </div>
      </div>
    </footer>
  )
}

/* ═══════════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════════ */
export default function LandingPage() {
  return (
    <main className="min-h-screen relative" style={{ background: '#0F1115' }}>
      <Navbar />
      <Hero />
      <SocialProof />
      <FeatureGrid />
      <NexusCore />
      <CTASection />

      <Footer />

      {/* Marquee animation style */}
      <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 30s linear infinite;
                }
            `}</style>
    </main>
  )
}
