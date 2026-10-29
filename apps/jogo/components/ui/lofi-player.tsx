"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { isLofiPlaying, setLofiCrackle, setLofiVolume, toggleLofiMusic } from "@/lib/lofi-music";

const BAR_COUNT = 18;

function VinylRecord({ spinning }: { spinning: boolean }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className="h-6 w-6 shrink-0"
      style={{
        animation: spinning ? "lofi-spin 2.4s linear infinite" : undefined,
      }}
    >
      <circle cx="20" cy="20" r="19" fill="#161311" />
      <circle cx="20" cy="20" r="15.5" fill="none" stroke="#33302b" strokeWidth="0.6" />
      <circle cx="20" cy="20" r="12.5" fill="none" stroke="#33302b" strokeWidth="0.6" />
      <circle cx="20" cy="20" r="9.5" fill="none" stroke="#33302b" strokeWidth="0.6" />
      <circle cx="20" cy="20" r="6.5" fill="#c9a96a" />
      <circle cx="20" cy="20" r="1.4" fill="#161311" />
    </svg>
  );
}

export function LofiPlayer() {
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(-14);
  const [crackle, setCrackle] = useState(-38);
  const [barHeights, setBarHeights] = useState<number[]>(() => Array(BAR_COUNT).fill(4));
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!playing) {
      setBarHeights(Array(BAR_COUNT).fill(4));
      return;
    }
    const interval = setInterval(() => {
      setBarHeights(Array.from({ length: BAR_COUNT }, () => 4 + Math.random() * 26));
    }, 120);
    return () => clearInterval(interval);
  }, [playing]);

  async function handleToggle() {
    const nowPlaying = await toggleLofiMusic();
    setPlaying(nowPlaying);
  }

  useEffect(() => {
    setPlaying(isLofiPlaying());
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <style>{`@keyframes lofi-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Rádio do checkpoint"
        aria-expanded={open}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface shadow-md shadow-black/10 transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <VinylRecord spinning={playing} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: -6 }}
            transition={{ type: "spring", stiffness: 420, damping: 30 }}
            className="absolute right-0 z-10 mt-2 w-64 overflow-hidden rounded-xl border shadow-lg"
            style={{ background: "#26221d", borderColor: "#8a7550", color: "#ece6d9" }}
          >
            <div className="p-4">
              <h3 className="text-center text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: "#c9a96a" }}>
                Rádio do checkpoint
              </h3>
              <p className="mb-3 text-center text-[10px] uppercase tracking-wider" style={{ color: "#9a8f7a" }}>
                lo-fi ambiente
              </p>

              <button
                type="button"
                onClick={handleToggle}
                className="flex w-full items-center justify-center gap-2 border py-2 text-xs font-medium uppercase tracking-widest transition-colors"
                style={{ borderColor: "#c9a96a", color: "#c9a96a" }}
              >
                {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                {playing ? "Parar" : "Tocar"}
              </button>

              <div className="mt-3 flex h-8 items-end justify-center gap-[3px]" aria-hidden>
                {barHeights.map((h, i) => (
                  <div key={i} style={{ width: 3, height: h, background: "#8a7550", opacity: 0.6 }} />
                ))}
              </div>

              <div className="mt-3 flex justify-between gap-4 text-[10px]" style={{ color: "#9a8f7a" }}>
                <label className="flex-1">
                  <span className="mb-1 block uppercase tracking-wider">Volume</span>
                  <input
                    type="range"
                    min={-40}
                    max={-5}
                    value={volume}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setVolume(v);
                      setLofiVolume(v);
                    }}
                    className="w-full accent-[#c9a96a]"
                  />
                </label>
                <label className="flex-1">
                  <span className="mb-1 block uppercase tracking-wider">Estática</span>
                  <input
                    type="range"
                    min={-60}
                    max={-20}
                    value={crackle}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setCrackle(v);
                      setLofiCrackle(v);
                    }}
                    className="w-full accent-[#c9a96a]"
                  />
                </label>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
