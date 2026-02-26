"use client";

import { useState, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import { motion, AnimatePresence } from "framer-motion";
import {
    UploadCloud,
    FileSpreadsheet,
    X,
    AlertTriangle,
    CheckCircle2,
    Database,
    Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ingestCsvData } from "@/lib/actions/csv-ingest";

// ─── Types ─────────────────────────────────────────────────────────────────────

type UploadType = "inventory" | "production" | "reports";

interface CsvUploaderProps {
    isOpen: boolean;
    onClose: () => void;
    onIngest?: (type: UploadType, data: Record<string, string>[]) => void;
    /** When provided, locks the uploader to this type and hides the type selector */
    uploadType?: UploadType;
}

interface ParsedData {
    headers: string[];
    rows: Record<string, string>[];
    totalRows: number;
}

// ─── Schema Definitions ────────────────────────────────────────────────────────

const UPLOAD_TYPES: { key: UploadType; label: string; icon: string }[] = [
    { key: "inventory", label: "Inventory Sync", icon: "📦" },
    { key: "production", label: "Production Plan (BOM)", icon: "⚙️" },
    { key: "reports", label: "Daily Reports", icon: "📊" },
];

const REQUIRED_HEADERS: Record<UploadType, string[]> = {
    inventory: ["material_name", "quantity", "unit", "location"],
    production: ["material_name", "planned_qty", "unit_cost", "batch_id"],
    reports: ["date", "material_name", "actual_qty", "actual_cost"],
};

// ─── Component ─────────────────────────────────────────────────────────────────

export function CsvUploader({ isOpen, onClose, onIngest, uploadType: lockedType }: CsvUploaderProps) {
    const [selectedType, setSelectedType] = useState<UploadType>(lockedType ?? "inventory");
    const uploadType = lockedType ?? selectedType;
    const [parsedData, setParsedData] = useState<ParsedData | null>(null);
    const [isParsing, setIsParsing] = useState(false);
    const [isIngesting, setIsIngesting] = useState(false);
    const [parseProgress, setParseProgress] = useState(0);
    const [fileName, setFileName] = useState<string>("");
    const [validationError, setValidationError] = useState<string | null>(null);
    const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null);
    const allRowsRef = useRef<Record<string, string>[]>([]);

    // ─── Reset ─────────────────────────────────────────────────────────────────

    const reset = useCallback(() => {
        setParsedData(null);
        setIsParsing(false);
        setParseProgress(0);
        setFileName("");
        setValidationError(null);
        if (progressInterval.current) clearInterval(progressInterval.current);
    }, []);

    const handleClose = useCallback(() => {
        reset();
        onClose();
    }, [reset, onClose]);

    // ─── CSV Parsing ───────────────────────────────────────────────────────────

    const processFile = useCallback(
        (file: File) => {
            reset();
            setFileName(file.name);
            setIsParsing(true);
            setParseProgress(0);

            // Animate progress bar
            let progress = 0;
            progressInterval.current = setInterval(() => {
                progress += Math.random() * 15;
                if (progress > 90) progress = 90;
                setParseProgress(progress);
            }, 100);

            Papa.parse<Record<string, string>>(file, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    if (progressInterval.current) clearInterval(progressInterval.current);
                    setParseProgress(100);

                    setTimeout(() => {
                        setIsParsing(false);

                        if (!results.data || results.data.length === 0) {
                            setValidationError("File is empty or could not be parsed.");
                            return;
                        }

                        const headers = results.meta.fields || [];
                        const required = REQUIRED_HEADERS[uploadType];
                        const missing = required.filter(
                            (h) => !headers.map((s) => s.toLowerCase().trim()).includes(h)
                        );

                        if (missing.length > 0) {
                            setValidationError(
                                `Invalid Schema: Missing required headers — ${missing.map((m) => `"${m}"`).join(", ")}`
                            );
                            setParsedData({
                                headers,
                                rows: results.data.slice(0, 5) as Record<string, string>[],
                                totalRows: results.data.length,
                            });
                            return;
                        }

                        setValidationError(null);
                        allRowsRef.current = results.data as Record<string, string>[];
                        setParsedData({
                            headers,
                            rows: results.data.slice(0, 5) as Record<string, string>[],
                            totalRows: results.data.length,
                        });
                    }, 400);
                },
                error: () => {
                    if (progressInterval.current) clearInterval(progressInterval.current);
                    setIsParsing(false);
                    setValidationError("Failed to parse CSV file. Please check the format.");
                },
            });
        },
        [uploadType, reset]
    );

    // ─── Dropzone ──────────────────────────────────────────────────────────────

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (acceptedFiles.length > 0) {
                processFile(acceptedFiles[0]);
            }
        },
        [processFile]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "text/csv": [".csv"] },
        maxFiles: 1,
        multiple: false,
    });

    // ─── Ingest Handler ────────────────────────────────────────────────────────

    const handleIngest = async () => {
        if (!parsedData || validationError) return;

        setIsIngesting(true);
        try {
            // Call the external callback if provided
            onIngest?.(uploadType, allRowsRef.current);

            // Call the server action to persist data
            const result = await ingestCsvData(uploadType, allRowsRef.current);

            if (result.success) {
                toast.success(
                    `Ingested ${result.data.inserted} rows into ${uploadType}` +
                    (result.data.skipped > 0 ? ` (${result.data.skipped} skipped)` : "")
                );
                handleClose();
            } else {
                toast.error(`Ingestion failed: ${result.error}`);
            }
        } catch (err) {
            toast.error("An unexpected error occurred during ingestion.");
        } finally {
            setIsIngesting(false);
        }
    };

    const isValid = parsedData && !validationError && !isParsing && !isIngesting;

    // ─── Render ────────────────────────────────────────────────────────────────

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {/* ── Backdrop ── */}
                    <motion.div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={handleClose}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />

                    {/* ── Modal ── */}
                    <motion.div
                        className={cn(
                            "relative z-10 w-full max-w-2xl",
                            "rounded-2xl border border-white/[0.05]",
                            "bg-[#18181B]/90 backdrop-blur-md",
                            "shadow-[0_32px_64px_-16px_rgba(0,0,0,0.7)]",
                            "overflow-hidden"
                        )}
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                    >
                        {/* Glass top shimmer */}
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                        {/* ── Header ── */}
                        <div className="flex items-center justify-between px-6 pt-6 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#00E096]/10 border border-[#00E096]/20">
                                    <Database className="w-5 h-5 text-[#00E096]" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold tracking-tight text-white font-[family-name:var(--font-space)]">
                                        {lockedType
                                            ? UPLOAD_TYPES.find((t) => t.key === lockedType)?.label ?? "Data Ingestion"
                                            : "Data Ingestion"}
                                    </h2>
                                    <p className="text-xs text-zinc-500 mt-0.5 font-[family-name:var(--font-mono)]">
                                        NEXUS.UPLOAD.MODULE
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleClose}
                                className="rounded-lg p-2 text-zinc-500 transition-all hover:bg-white/5 hover:text-white"
                                aria-label="Close"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* ── Body ── */}
                        <div className="px-6 pb-6 space-y-5">

                            {/* ─── Upload Type Selector (hidden when type is locked) ──── */}
                            {!lockedType && (
                                <div className="flex gap-1 p-1 rounded-xl bg-black/30 border border-white/[0.05]">
                                    {UPLOAD_TYPES.map((type) => (
                                        <button
                                            key={type.key}
                                            onClick={() => {
                                                setSelectedType(type.key);
                                                reset();
                                            }}
                                            className={cn(
                                                "flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-200",
                                                uploadType === type.key
                                                    ? "bg-[#00E096]/10 text-[#00E096] border border-[#00E096]/20 shadow-[0_0_12px_rgba(0,224,150,0.15)]"
                                                    : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03] border border-transparent"
                                            )}
                                        >
                                            <span className="text-sm">{type.icon}</span>
                                            <span className="hidden sm:inline">{type.label}</span>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* ─── Required Headers Hint ─────────────────────────────────── */}
                            <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                                <FileSpreadsheet className="w-4 h-4 text-zinc-500 mt-0.5 shrink-0" />
                                <p className="text-[11px] text-zinc-500 font-[family-name:var(--font-mono)] leading-relaxed">
                                    Required headers:{" "}
                                    {REQUIRED_HEADERS[uploadType].map((h, i) => (
                                        <span key={h}>
                                            <span className="text-zinc-400">{h}</span>
                                            {i < REQUIRED_HEADERS[uploadType].length - 1 && (
                                                <span className="text-zinc-600"> · </span>
                                            )}
                                        </span>
                                    ))}
                                </p>
                            </div>

                            {/* ─── Dropzone ─────────────────────────────────────────────── */}
                            {!isParsing && !parsedData && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <div
                                        {...getRootProps()}
                                        className={cn(
                                            "relative flex flex-col items-center justify-center gap-4 py-12 px-6",
                                            "rounded-xl border-2 border-dashed cursor-pointer",
                                            "transition-all duration-300 group",
                                            isDragActive
                                                ? "border-[#00E096] bg-[#00E096]/[0.04] shadow-[inset_0_0_30px_rgba(0,224,150,0.06)]"
                                                : "border-white/20 hover:border-white/30 bg-transparent hover:bg-white/[0.01]"
                                        )}
                                    >
                                        <input {...getInputProps()} />

                                        <motion.div
                                            animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
                                            transition={{ type: "spring", stiffness: 300 }}
                                            className={cn(
                                                "flex items-center justify-center w-16 h-16 rounded-2xl",
                                                "transition-all duration-300",
                                                isDragActive
                                                    ? "bg-[#00E096]/10 border border-[#00E096]/30"
                                                    : "bg-white/[0.03] border border-white/[0.06]"
                                            )}
                                        >
                                            <UploadCloud
                                                className={cn(
                                                    "w-7 h-7 transition-colors duration-300",
                                                    isDragActive ? "text-[#00E096]" : "text-zinc-500"
                                                )}
                                            />
                                        </motion.div>

                                        <div className="text-center space-y-1.5">
                                            <p
                                                className={cn(
                                                    "text-sm font-medium transition-colors duration-300",
                                                    isDragActive ? "text-[#00E096]" : "text-zinc-300"
                                                )}
                                            >
                                                {isDragActive
                                                    ? "Release to upload"
                                                    : "Drag & drop CSV files here, or click to browse"}
                                            </p>
                                            <p className="text-[11px] text-zinc-600 font-[family-name:var(--font-mono)]">
                                                .CSV files only · Max 1 file
                                            </p>
                                        </div>

                                        {/* Glow ring on drag */}
                                        {isDragActive && (
                                            <motion.div
                                                className="absolute inset-0 rounded-xl pointer-events-none"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                style={{
                                                    boxShadow:
                                                        "inset 0 0 60px rgba(0,224,150,0.04), 0 0 30px rgba(0,224,150,0.08)",
                                                }}
                                            />
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {/* ─── Processing State ─────────────────────────────────────── */}
                            {isParsing && (
                                <motion.div
                                    className="flex flex-col items-center gap-5 py-10"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    {/* Progress bar */}
                                    <div className="w-full max-w-xs">
                                        <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
                                            <motion.div
                                                className="h-full rounded-full bg-gradient-to-r from-[#00E096] to-[#00E096]/70"
                                                initial={{ width: "0%" }}
                                                animate={{ width: `${parseProgress}%` }}
                                                transition={{ duration: 0.3, ease: "easeOut" }}
                                                style={{
                                                    boxShadow: "0 0 12px rgba(0,224,150,0.5)",
                                                }}
                                            />
                                        </div>
                                        <div className="flex justify-between mt-2">
                                            <span className="text-[10px] text-zinc-600 font-[family-name:var(--font-mono)]">
                                                {fileName}
                                            </span>
                                            <span className="text-[10px] text-[#00E096] font-[family-name:var(--font-mono)]">
                                                {Math.round(parseProgress)}%
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 text-[#00E096] animate-spin" />
                                        <p className="text-xs text-zinc-400 font-[family-name:var(--font-mono)] tracking-wider">
                                            Parsing Nexus Data Matrix...
                                        </p>
                                    </div>
                                </motion.div>
                            )}

                            {/* ─── Validation Error ─────────────────────────────────────── */}
                            <AnimatePresence>
                                {validationError && (
                                    <motion.div
                                        className={cn(
                                            "flex items-start gap-3 px-4 py-3 rounded-xl",
                                            "bg-[#FF2E63]/[0.06] border border-[#FF2E63]/20",
                                            "shadow-[0_0_20px_rgba(255,46,99,0.08)]"
                                        )}
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                    >
                                        <AlertTriangle className="w-4 h-4 text-[#FF2E63] mt-0.5 shrink-0" />
                                        <p className="text-xs text-[#FF2E63] font-[family-name:var(--font-mono)] leading-relaxed">
                                            {validationError}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* ─── Preview Table ─────────────────────────────────────────── */}
                            {parsedData && !isParsing && (
                                <motion.div
                                    className="space-y-3"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    {/* File info */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            {!validationError ? (
                                                <CheckCircle2 className="w-4 h-4 text-[#00E096]" />
                                            ) : (
                                                <AlertTriangle className="w-4 h-4 text-[#FF2E63]" />
                                            )}
                                            <span className="text-xs text-zinc-400 font-[family-name:var(--font-mono)]">
                                                {fileName}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-[10px] text-zinc-600 font-[family-name:var(--font-mono)]">
                                                {parsedData.totalRows} rows · {parsedData.headers.length} cols
                                            </span>
                                            <button
                                                onClick={reset}
                                                className="text-[10px] text-zinc-500 hover:text-white transition-colors font-[family-name:var(--font-mono)] underline underline-offset-2"
                                            >
                                                CLEAR
                                            </button>
                                        </div>
                                    </div>

                                    {/* Table */}
                                    <div className="rounded-xl border border-white/[0.05] overflow-hidden bg-black/20">
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="border-b border-white/[0.06]">
                                                        {parsedData.headers.map((header) => {
                                                            const isRequired =
                                                                REQUIRED_HEADERS[uploadType].includes(
                                                                    header.toLowerCase().trim()
                                                                );
                                                            const isMissing =
                                                                validationError &&
                                                                REQUIRED_HEADERS[uploadType].includes(header.toLowerCase().trim()) === false &&
                                                                REQUIRED_HEADERS[uploadType].some(
                                                                    (rh) => !parsedData.headers.map((h) => h.toLowerCase().trim()).includes(rh)
                                                                );

                                                            return (
                                                                <th
                                                                    key={header}
                                                                    className={cn(
                                                                        "px-3 py-2.5 text-left text-[10px] font-semibold uppercase tracking-[0.1em] whitespace-nowrap",
                                                                        "font-[family-name:var(--font-mono)]",
                                                                        isRequired ? "text-[#00E096]/70" : "text-zinc-600"
                                                                    )}
                                                                >
                                                                    {header}
                                                                </th>
                                                            );
                                                        })}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {parsedData.rows.map((row, rowIndex) => (
                                                        <tr
                                                            key={rowIndex}
                                                            className={cn(
                                                                "border-b border-white/[0.03] last:border-b-0",
                                                                "transition-colors hover:bg-white/[0.02]"
                                                            )}
                                                        >
                                                            {parsedData.headers.map((header) => (
                                                                <td
                                                                    key={`${rowIndex}-${header}`}
                                                                    className="px-3 py-2 text-xs text-zinc-400 whitespace-nowrap font-[family-name:var(--font-mono)]"
                                                                >
                                                                    {row[header] || (
                                                                        <span className="text-zinc-700">—</span>
                                                                    )}
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Table footer showing preview count */}
                                        {parsedData.totalRows > 5 && (
                                            <div className="px-3 py-2 border-t border-white/[0.04] bg-white/[0.01]">
                                                <p className="text-[10px] text-zinc-600 font-[family-name:var(--font-mono)]">
                                                    Showing 5 of {parsedData.totalRows} rows
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* ── Footer ── */}
                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/[0.05] bg-black/20">
                            <button
                                onClick={handleClose}
                                className={cn(
                                    "px-5 py-2.5 rounded-lg text-sm font-medium",
                                    "text-zinc-400 hover:text-white",
                                    "border border-white/[0.06] hover:border-white/10",
                                    "bg-transparent hover:bg-white/[0.03]",
                                    "transition-all duration-200"
                                )}
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleIngest}
                                disabled={!isValid}
                                className={cn(
                                    "px-6 py-2.5 rounded-lg text-sm font-semibold",
                                    "transition-all duration-200",
                                    isValid
                                        ? "bg-[#00E096] text-black hover:bg-[#00E096]/90 shadow-[0_0_15px_rgba(0,224,150,0.4)] hover:shadow-[0_0_25px_rgba(0,224,150,0.5)] active:scale-[0.98]"
                                        : "bg-zinc-800 text-zinc-600 cursor-not-allowed border border-white/[0.04]"
                                )}
                            >
                                <span className="flex items-center gap-2">
                                    {isIngesting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Ingesting...
                                        </>
                                    ) : (
                                        <>
                                            <Database className="w-4 h-4" />
                                            Ingest Data
                                        </>
                                    )}
                                </span>
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
