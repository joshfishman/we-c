import type { IconType } from "react-icons";
import {
  SiGoogle,
  SiGooglegemini,
  SiPerplexity,
  SiClaude,
  SiGooglenews,
  SiFox,
  SiApplenews,
  SiYoutube,
  SiSpotify,
  SiApplepodcasts,
  SiFacebook,
  SiInstagram,
  SiTiktok,
  SiPinterest,
} from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";
import { RiOpenaiFill } from "react-icons/ri";
import {
  LuNewspaper,
  LuPenLine,
  LuChartPie,
  LuBookOpen,
  LuImage,
  LuFileChartColumn,
  LuTrendingUp,
  LuCalendarCheck,
} from "react-icons/lu";
import a from "./aiVisibility.module.css";

type Mark = { Icon: IconType; name: string; color: string };

/**
 * Logo clusters for the "where you show up" cards: each card shows the
 * platforms it covers as an overlapping stack of brand marks. Editors pick a
 * set by key (Tina field `iconSet`); the marks themselves live here.
 */
// Lucide line icons carry built-in padding; they get scaled up to match.
const LINE_ICONS = new Set<IconType>([
  LuNewspaper,
  LuPenLine,
  LuChartPie,
  LuBookOpen,
  LuImage,
  LuFileChartColumn,
  LuTrendingUp,
  LuCalendarCheck,
]);

export const ICON_SETS: Record<string, Mark[]> = {
  ai: [
    { Icon: RiOpenaiFill, name: "ChatGPT", color: "#0d0d0d" },
    { Icon: SiGoogle, name: "Google AI", color: "#4285f4" },
    { Icon: SiGooglegemini, name: "Gemini", color: "#8e75b2" },
    { Icon: SiPerplexity, name: "Perplexity", color: "#1fb8cd" },
    { Icon: SiClaude, name: "Claude", color: "#d97757" },
  ],
  news: [
    { Icon: SiGooglenews, name: "Google News", color: "#4285f4" },
    { Icon: SiFox, name: "FOX", color: "#0d0d0d" },
    { Icon: SiApplenews, name: "Apple News", color: "#fa324a" },
    { Icon: LuNewspaper, name: "Local news sites", color: "#9a4318" },
  ],
  media: [
    { Icon: SiYoutube, name: "YouTube", color: "#ff0000" },
    { Icon: SiSpotify, name: "Spotify", color: "#1db954" },
    { Icon: SiApplepodcasts, name: "Apple Podcasts", color: "#9933cc" },
  ],
  social: [
    { Icon: SiFacebook, name: "Facebook", color: "#0866ff" },
    { Icon: SiInstagram, name: "Instagram", color: "#e4405f" },
    { Icon: FaLinkedin, name: "LinkedIn", color: "#0a66c2" },
    { Icon: SiTiktok, name: "TikTok", color: "#0d0d0d" },
    { Icon: SiPinterest, name: "Pinterest", color: "#bd081c" },
  ],
  blog: [
    { Icon: LuPenLine, name: "Blog posts", color: "#9a4318" },
    { Icon: LuChartPie, name: "Infographics", color: "#c2607e" },
    { Icon: LuBookOpen, name: "Flipbooks", color: "#8e5e9e" },
    { Icon: LuImage, name: "Images", color: "#d9614b" },
  ],
  report: [
    { Icon: LuFileChartColumn, name: "Monthly report", color: "#9a4318" },
    { Icon: LuTrendingUp, name: "Progress", color: "#2f8a5b" },
    { Icon: LuCalendarCheck, name: "Monthly check-in", color: "#4f5c92" },
  ],
};

export function ChannelIcons({ set }: { set?: string }) {
  const marks = set ? ICON_SETS[set] : undefined;
  if (!marks) return null;
  return (
    <div
      className={a.iconStack}
      role="img"
      aria-label={marks.map((m) => m.name).join(", ")}
    >
      {marks.map(({ Icon, name, color }) => (
        <span key={name} className={a.iconChip} title={name}>
          <Icon
            aria-hidden="true"
            style={{ color }}
            className={LINE_ICONS.has(Icon) ? a.iconLine : undefined}
          />
        </span>
      ))}
    </div>
  );
}
