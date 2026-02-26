'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
    ArrowRight,
    Lock,
    Mail,
    Loader2,
    Eye,
    EyeOff,
    TrendingUp,
    BarChart3,
    Activity,
    ShieldCheck,
    Cpu
} from 'lucide-react'
import { login, signup } from './actions'
import { toast } from 'sonner'

// ── Showcase Chart Components ──────────────────────

function MiniAreaChart() {
    return (
        <svg viewBox="0 0 200 60" className="w-full h-full" preserveAspectRatio="none">
            <defs>
                <linearGradient id="loginGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00E096" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#00E096" stopOpacity="0" />
                </linearGradient>
                <filter id="loginGlow">
                    <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#00E096" floodOpacity="0.6" />
                </filter>
            </defs>
            <path
                d="M0,45 Q20,40 40,35 T80,20 T120,30 T160,15 T200,25"
                fill="none"
                stroke="#00E096"
                strokeWidth="2"
                style={{ filter: 'url(#loginGlow)' }}
            />
            <path
                d="M0,45 Q20,40 40,35 T80,20 T120,30 T160,15 T200,25 L200,60 L0,60 Z"
                fill="url(#loginGrad)"
            />
        </svg>
    )
}

function MiniBarChart() {
    const bars = [35, 55, 45, 70, 50, 65, 40, 75, 55, 60]
    return (
        <svg viewBox="0 0 200 60" className="w-full h-full" preserveAspectRatio="none">
            <defs>
                <linearGradient id="barGradLogin" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00E096" stopOpacity="1" />
                    <stop offset="100%" stopColor="#00E096" stopOpacity="0.3" />
                </linearGradient>
            </defs>
            {bars.map((h, i) => (
                <rect
                    key={i}
                    x={i * 20 + 2}
                    y={60 - h * 0.8}
                    width="14"
                    height={h * 0.8}
                    rx="2"
                    fill="url(#barGradLogin)"
                    opacity={0.5 + (i / bars.length) * 0.5}
                />
            ))}
        </svg>
    )
}

// ── Showcase Card ──────────────────────────────────────────────────────────

function ShowcaseCard({
    title,
    value,
    change,
    children,
    delay,
}: {
    title: string
    value: string
    change: string
    children: React.ReactNode
    delay: number
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay, ease: 'easeOut' }}
            className="rounded-xl p-5 w-72 backdrop-blur-md"
            style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 4px 30px rgba(0,0,0,0.1)',
            }}
        >
            <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] uppercase tracking-widest text-white/40 font-medium font-mono">{title}</span>
                <span className="text-[11px] font-bold text-[#00E096] font-mono">{change}</span>
            </div>
            <span
                className="text-xl font-bold text-white block mb-4"
                style={{ fontFamily: "'Space Grotesk', monospace" }}
            >
                {value}
            </span>
            <div className="h-14 w-full">{children}</div>
        </motion.div>
    )
}

// ── Main Page ─────────────────────────────────────────────────────────────

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [mode, setMode] = useState<'signin' | 'signup'>('signin')
    const [checkEmail, setCheckEmail] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    async function handleSubmit(formData: FormData) {
        setIsLoading(true)
        try {
            const action = mode === 'signin' ? login : signup
            const result = await action(formData)

            if (result && 'error' in result && result.error) {
                toast.error(result.error as string, {
                    style: {
                        background: '#18181B',
                        border: '1px solid rgba(255,46,99,0.2)',
                        color: '#FF2E63',
                        fontFamily: 'JetBrains Mono, monospace',
                    },
                })
            } else if (mode === 'signup' && result && 'success' in result && result.success) {
                setCheckEmail(true)
                toast.success((result as Record<string, unknown>).message as string, {
                    style: {
                        background: '#18181B',
                        border: '1px solid rgba(0,224,150,0.2)',
                        color: '#00E096',
                        fontFamily: 'JetBrains Mono, monospace',
                    },
                })
            }
        } catch (err: unknown) {
            // Next.js redirect() throws internally
            if (err && typeof err === 'object' && 'digest' in err) {
                throw err
            }
            toast.error('An unexpected error occurred', {
                style: {
                    background: '#18181B',
                    border: '1px solid rgba(255,46,99,0.2)',
                    color: '#FF2E63',
                    fontFamily: 'JetBrains Mono, monospace',
                },
            })
        } finally {
            setIsLoading(false)
        }
    }

    // ── Check Email State ──────────────────────────────────────────────────

    if (checkEmail) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-[#0F1115] relative overflow-hidden">
                {/* Background Grid */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)`,
                        backgroundSize: '24px 24px'
                    }}
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative z-10 w-full max-w-lg p-10 rounded-2xl text-center border border-white/5 bg-[#18181B]/80 backdrop-blur-xl shadow-2xl"
                >
                    <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse bg-[#00E096]/10 border border-[#00E096]/20">
                        <Mail className="w-10 h-10 text-[#00E096]" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'Space Grotesk' }}>Check your inbox</h2>
                    <p className="text-white/40 text-base mb-8 font-mono">
                        Verification link sent. Access required for entry.
                    </p>
                    <button
                        onClick={() => {
                            setCheckEmail(false)
                            setMode('signin')
                        }}
                        className="text-[#00E096] hover:text-white font-mono text-xs uppercase tracking-wider transition-colors"
                    >
                        [ Return to Terminal ]
                    </button>
                </motion.div>
            </div>
        )
    }

    // ── Main Login ─────────────────────────────────────────────────────────

    return (
        <div className="min-h-screen w-full flex bg-[#0F1115] relative overflow-hidden">
            {/* Texture Overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none z-50" />

            {/* Grid Pattern */}
            <div
                className="absolute inset-0 z-0 opacity-20"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
                    backgroundSize: '32px 32px'
                }}
            />

            {/* ═══ LEFT: Form Side ═══ */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 lg:px-24 py-12 relative z-10">
                {/* Back Link */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute top-8 left-8 sm:left-12 lg:left-24"
                >
                    <Link href="/" className="flex items-center gap-2 text-white/30 hover:text-[#00E096] transition-colors group">
                        <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs font-mono uppercase tracking-wider">Abort</span>
                    </Link>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-[440px] mx-auto"
                >
                    {/* Header */}
                    <div className="mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-9 h-9 bg-[#00E096] flex items-center justify-center text-black font-black text-xs rounded-sm">IQ</div>
                            <span className="text-white font-bold text-xl tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>CostIQ</span>
                        </div>
                        <h1 className="text-5xl font-bold text-white mb-3" style={{ fontFamily: 'Space Grotesk' }}>
                            Authenticate.
                        </h1>
                        <p className="text-white/40 text-base font-mono">
                            Enter your credentials to access the Nexus Engine.
                        </p>
                    </div>

                    {/* Form Card */}
                    <div className="p-1 rounded-2xl bg-gradient-to-br from-white/10 to-transparent">
                        <div className="bg-[#0F1115] rounded-xl p-8 sm:p-10 border border-white/5 relative overflow-hidden">
                            {/* Scanning line animation */}
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00E096]/50 to-transparent animate-scan-slow" />

                            <form action={handleSubmit} className="space-y-6">
                                {/* Email */}
                                <div className="space-y-2">
                                    <label className="text-[11px] uppercase text-white/40 font-mono tracking-wider ml-1">Identity</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 transition-colors group-focus-within:text-[#00E096]" />
                                        <input
                                            name="email"
                                            type="email"
                                            required
                                            placeholder="operator@costiq.io"
                                            className="w-full py-4 pl-12 pr-4 bg-[#131418] border border-white/10 rounded-lg text-base text-white font-mono placeholder:text-white/20 focus:outline-none focus:border-[#00E096]/50 focus:bg-[#00E096]/5 transition-all duration-300"
                                            autoComplete="email"
                                        />
                                    </div>
                                </div>

                                {/* Password */}
                                <div className="space-y-2">
                                    <label className="text-[11px] uppercase text-white/40 font-mono tracking-wider ml-1">Keycode</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 transition-colors group-focus-within:text-[#00E096]" />
                                        <input
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            placeholder="••••••••"
                                            className="w-full py-4 pl-12 pr-12 bg-[#131418] border border-white/10 rounded-lg text-base text-white font-mono placeholder:text-white/20 focus:outline-none focus:border-[#00E096]/50 focus:bg-[#00E096]/5 transition-all duration-300"
                                            autoComplete="current-password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-white/20 hover:text-white transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Actions */}
                                {mode === 'signin' && (
                                    <div className="flex justify-end">
                                        <button type="button" className="text-[11px] uppercase tracking-wider text-[#00E096] hover:text-white transition-colors font-mono">
                                            Reset credential?
                                        </button>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-4 rounded-lg bg-[#00E096] hover:bg-[#00c985] text-black font-bold text-base tracking-wide uppercase transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,224,150,0.35)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group/btn"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            {mode === 'signin' ? 'Initialize Session' : 'Register Unit'}
                                            <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Mode Switcher */}
                    <div className="mt-10 text-center">
                        <p className="text-sm text-white/30 font-mono">
                            {mode === 'signin' ? 'New terminal detected?' : 'Terminal already registered?'}{' '}
                            <button
                                onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                                className="text-white hover:text-[#00E096] ml-1 transition-colors border-b border-transparent hover:border-[#00E096]"
                            >
                                {mode === 'signin' ? 'Request Access' : 'Log In'}
                            </button>
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* ═══ RIGHT: Hologram Side ═══ */}
            <div className="hidden lg:flex w-1/2 relative items-center justify-center overflow-hidden bg-gradient-to-br from-[#00E096]/5 to-[#0F1115]">
                {/* Ambient Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00E096] opacity-[0.03] blur-[150px] rounded-full" />

                {/* Vertical Lines */}
                <div className="absolute inset-0 flex justify-around opacity-10 pointer-events-none">
                    <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-white to-transparent" />
                    <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-white to-transparent delay-75" />
                    <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-white to-transparent delay-150" />
                </div>

                {/* Floating Cards Container - Scaled Up */}
                <div className="relative z-10 w-full max-w-[650px] h-[650px] perspective-1000">
                    <motion.div
                        className="relative w-full h-full preserve-3d"
                        animate={{
                            rotateX: [0, 5, 0],
                            rotateY: [0, 5, 0]
                        }}
                        transition={{
                            duration: 10,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        {/* Back Card (Blurred Graph) */}
                        <motion.div
                            className="absolute top-0 right-10"
                            animate={{ y: [0, -25, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        >
                            <ShowcaseCard title="Variance Risk" value="High" change="+12%" delay={0.2}>
                                <div className="w-full h-full bg-gradient-to-r from-[#FF2E63]/20 to-transparent rounded opacity-50" />
                            </ShowcaseCard>
                        </motion.div>

                        {/* Middle Card (Stats) */}
                        <motion.div
                            className="absolute bottom-24 left-10 z-20"
                            animate={{ y: [0, 35, 0] }}
                            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <div className="rounded-xl p-6 w-80 backdrop-blur-xl bg-[#0F1115]/90 border border-white/10 shadow-2xl">
                                <div className="flex items-center gap-3 mb-5">
                                    <ShieldCheck className="w-6 h-6 text-[#00E096]" />
                                    <span className="text-xs font-mono text-white/60">SYSTEM STATUS</span>
                                </div>
                                <div className="space-y-4">
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full w-[85%] bg-[#00E096]" />
                                    </div>
                                    <div className="flex justify-between text-[11px] font-mono text-white/40">
                                        <span>OPTIMAL</span>
                                        <span>85%</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Front Card (Active Data) */}
                        <motion.div
                            className="absolute top-1/3 left-1/4 z-30 transform scale-110"
                            animate={{ y: [0, -20, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                        >
                            <div className="rounded-2xl p-8 w-96 backdrop-blur-2xl bg-[#18181B]/95 border border-[#00E096]/20 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
                                <div className="flex justify-between items-start mb-8">
                                    <div>
                                        <p className="text-[11px] uppercase tracking-widest text-white/40 font-mono mb-2">Net Savings</p>
                                        <h3 className="text-4xl font-bold text-white flex items-center gap-2" style={{ fontFamily: 'Space Grotesk' }}>
                                            ₹8.42L
                                            <span className="text-sm px-2 py-1 rounded bg-[#00E096]/10 text-[#00E096] font-mono">+14%</span>
                                        </h3>
                                    </div>
                                    <div className="w-12 h-12 rounded-full bg-[#00E096]/10 flex items-center justify-center border border-[#00E096]/20">
                                        <TrendingUp className="w-6 h-6 text-[#00E096]" />
                                    </div>
                                </div>
                                <MiniAreaChart />
                            </div>
                        </motion.div>

                        {/* Floating Icons */}
                        <Cpu className="absolute top-12 left-20 w-10 h-10 text-white/10 animate-pulse" />
                        <Activity className="absolute bottom-12 right-20 w-14 h-14 text-[#FF2E63]/20 animate-pulse delay-700" />
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
