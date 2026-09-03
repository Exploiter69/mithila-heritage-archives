import { Pause, Play, Volume2, VolumeX, X } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

export interface PlayerTrack {
  id: string;
  title: string;
  titleDeva: string;
  artist: string;
  duration: number;
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

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [track, setTrack] = useState<PlayerTrack | null>(null);
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [volume, setVolume] = useState(70);
  const [muted, setMuted] = useState(false);

  const play = useCallback((next: PlayerTrack) => {
    setTrack((cur) => {
      if (cur?.id === next.id) return cur;
      setPosition(0);
      return next;
    });
    setPlaying((p) => (track?.id === next.id ? !p : true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track?.id]);

  const toggle = useCallback(() => setPlaying((p) => !p), []);
  const isCurrent = useCallback((id: string) => track?.id === id, [track?.id]);

  useEffect(() => {
    if (!playing || !track) return;
    const t = window.setInterval(() => {
      setPosition((p) => {
        if (p + 1 >= track.duration) {
          setPlaying(false);
          return track.duration;
        }
        return p + 1;
      });
    }, 1000);
    return () => window.clearInterval(t);
  }, [playing, track]);

  const value = useMemo<PlayerState>(
    () => ({ track, playing, play, toggle, isCurrent }),
    [track, playing, play, toggle, isCurrent],
  );

  const progress = track ? Math.min(100, (position / track.duration) * 100) : 0;

  return (
    <PlayerContext.Provider value={value}>
      {children}
      {track && <div aria-hidden className="h-24 md:h-20" />}
      {track && (
        <div
          role="region"
          aria-label="Now playing"
          className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/97 backdrop-blur-sm"
        >
          <div className="h-0.5 w-full bg-secondary">
            <div
              className="h-full bg-terracotta transition-[width] duration-1000 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 md:gap-5 md:px-8">
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
            </div>

            <p className="hidden shrink-0 font-sans text-xs tabular-nums text-muted-foreground sm:block">
              {fmt(position)} / {fmt(track.duration)}
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
                className={cn("flex-1")}
              />
            </div>

            <button
              type="button"
              onClick={() => {
                setPlaying(false);
                setTrack(null);
              }}
              aria-label="Close player"
              className="shrink-0 text-muted-foreground transition-colors hover:text-terracotta"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}
    </PlayerContext.Provider>
  );
}
