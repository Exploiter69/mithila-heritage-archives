import { ExternalLink, Pause, Play, Volume2, VolumeX, X } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { Slider } from "@/components/ui/slider";

export const STREAM_ATTRIBUTION =
  "All audio streams via official artist/label channels on YouTube. Rights remain with the original creators.";

export interface PlayerTrack {
  id: string;
  title: string;
  titleDeva: string;
  artist: string;
  youtubeId: string;
  channel: string;
}

interface PlayerState {
  track: PlayerTrack | null;
  playing: boolean;
  play: (track: PlayerTrack) => void;
  toggle: () => void;
  isCurrent: (id: string) => boolean;
}

const PlayerContext = createContext<PlayerState | null>(null);

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used inside <PlayerProvider>");
  return ctx;
}

function fmt(seconds: number) {
  const s = Math.max(0, Math.floor(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

/** Minimal shape of the YouTube IFrame API objects we use. */
interface YTPlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  setVolume: (v: number) => void;
  mute: () => void;
  unMute: () => void;
  loadVideoById: (id: string) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  destroy: () => void;
}

declare global {
  interface Window {
    YT?: {
      Player: new (el: HTMLElement | string, opts: Record<string, unknown>) => YTPlayer;
ateReady?: boolean;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<void> | null = null;

function loadYouTubeApi(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT?.Player) return Promise.resolve();
  if (apiPromise) return apiPromise;
  apiPromise = new Promise<void>((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve();
    };
    const s = document.createElement("script");
    s.src = "https://www.youtube.com/iframe_api";
    s.async = true;
    document.head.appendChild(s);
  });
  return apiPromise;
}

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [track, setTrack] = useState<PlayerTrack | null>(null);
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(70);
  const [muted, setMuted] = useState(false);

  const hostRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YTPlayer | null>(null);

  const play = useCallback((next: PlayerTrack) => {
    setTrack((cur) => {
      if (cur?.id === next.id) {
        setPlaying((p) => !p);
        return cur;
      }
      setPosition(0);
      setDuration(0);
      setPlaying(true);
      return next;
    });
  }, []);

  const toggle = useCallback(() => setPlaying((p) => !p), []);
  const isCurrent = useCallback((id: string) => track?.id === id, [track?.id]);

  // Create / update the embedded YouTube player.
  useEffect(() => {
    if (!track || !hostRef.current) return;
    let cancelled = false;

    loadYouTubeApi().then(() => {
      if (cancelled || !hostRef.current || !window.YT?.Player) return;
      if (playerRef.current) {
        playerRef.current.loadVideoById(track.youtubeId);
        return;
      }
      playerRef.current = new window.YT.Player(hostRef.current, {
        videoId: track.youtubeId,
        playerVars: { playsinline: 1, rel: 0, modestbranding: 1 },
        events: {
          onReady: (e: { target: YTPlayer }) => {
            e.target.setVolume(muted ? 0 : volume);
            e.target.playVideo();
          },
          onStateChange: (e: { data: number }) => {
            if (e.data === 1) setPlaying(true);
            if (e.data === 2 || e.data === 0) setPlaying(false);
          },
        },
      });
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track?.youtubeId]);

  // Play / pause the embed when local state changes.
  useEffect(() => {
    const p = playerRef.current;
    if (!p) return;
    try {
      if (playing) p.playVideo();
      else p.pauseVideo();
    } catch {
      /* embed not ready yet */
    }
  }, [playing]);

  // Volume.
  useEffect(() => {
    try {
      playerRef.current?.setVolume(muted ? 0 : volume);
    } catch {
      /* embed not ready yet */
    }
  }, [volume, muted]);

  // Poll playback position from the embed.
  useEffect(() => {
    if (!track) return;
    const t = window.setInterval(() => {
      const p = playerRef.current;
      if (!p) return;
      try {
        setPosition(p.getCurrentTime() || 0);
        setDuration(p.getDuration() || 0);
      } catch {
        /* embed not ready yet */
      }
    }, 500);
    return () => window.clearInterval(t);
  }, [track]);

  const close = useCallback(() => {
    try {
      playerRef.current?.destroy();
    } catch {
      /* already gone */
    }
    playerRef.current = null;
    setPlaying(false);
    setTrack(null);
    setPosition(0);
    setDuration(0);
  }, []);

  const value = useMemo<PlayerState>(
    () => ({ track, playing, play, toggle, isCurrent }),
    [track, playing, play, toggle, isCurrent],
  );

  const progress = duration ? Math.min(100, (position / duration) * 100) : 0;

  return (
    <PlayerContext.Provider value={value}>
      {children}
      {track && <div aria-hidden className="h-56 md:h-32" />}
      {track && (
        <div
          role="region"
          aria-label="Now playing"
          className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/97 backdrop-blur-sm"
        >
          <div className="h-0.5 w-full bg-secondary">
            <div
              className="h-full bg-terracotta transition-[width] duration-500 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mx-auto max-w-6xl px-4 py-3 md:px-8">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-5">
              <div className="w-full shrink-0 overflow-hidden rounded-sm border border-border bg-ink/5 md:w-48">
                <div className="aspect-video w-full">
                  <div ref={hostRef} className="size-full" />
                </div>
              </div>

              <div className="flex items-center gap-3 md:flex-1 md:gap-5">
                <button
                  type="button"
                  onClick={toggle}
                  aria-label={playing ? "Pause" : "Play"}
                  className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-terracotta text-primary-foreground transition-opacity hover:opacity-90"
                >
                  {playing ? (
                    <Pause className="size-4 fill-current" />
                  ) : (
                    <Play className="size-4 translate-x-px fill-current" />
                  )}
                </button>

                <div className="min-w-0 flex-1">
                  <p className="deva truncate text-base leading-snug text-foreground">
                    {track.titleDeva}
                  </p>
                  <p className="truncate font-sans text-xs text-muted-foreground">
                    {track.artist} · {track.title}
                  </p>
                  <a
                    href={`https://www.youtube.com/watch?v=${track.youtubeId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-0.5 inline-flex items-center gap-1 font-sans text-[11px] text-muted-foreground underline decoration-gold underline-offset-2 transition-colors hover:text-terracotta"
                  >
                    Streaming from {track.channel} on YouTube
                    <ExternalLink className="size-3" />
                  </a>
                </div>

                <p className="hidden shrink-0 font-sans text-xs tabular-nums text-muted-foreground sm:block">
                  {fmt(position)} / {fmt(duration)}
                </p>

                <div className="hidden w-36 shrink-0 items-center gap-2 md:flex">
                  <button
                    type="button"
                    onClick={() => setMuted((m) => !m)}
                    aria-label={muted ? "Unmute" : "Mute"}
                    className="text-muted-foreground transition-colors hover:text-terracotta"
                  >
                    {muted || volume === 0 ? (
                      <VolumeX className="size-4" />
                    ) : (
                      <Volume2 className="size-4" />
                    )}
                  </button>
                  <Slider
                    value={[muted ? 0 : volume]}
                    max={100}
                    step={1}
                    aria-label="Volume"
                    onValueChange={([v]) => {
                      setVolume(v ?? 0);
                      setMuted((v ?? 0) === 0);
                    }}
                    className="flex-1"
                  />
                </div>

                <button
                  type="button"
                  onClick={close}
                  aria-label="Close player"
                  className="shrink-0 text-muted-foreground transition-colors hover:text-terracotta"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            <p className="mt-2 font-sans text-[11px] leading-relaxed text-muted-foreground">
              {STREAM_ATTRIBUTION}
            </p>
          </div>
        </div>
      )}
    </PlayerContext.Provider>
  );
}
