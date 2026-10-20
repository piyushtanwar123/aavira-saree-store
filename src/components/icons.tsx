import type { CSSProperties } from "react";

type IconName = "search" | "bag" | "heart" | "arrow" | "arrow-left" | "chevron" | "close" | "menu" | "minus" | "plus" | "truck" | "shield" | "sparkles" | "return" | "whatsapp" | "instagram" | "mail" | "check" | "trash" | "leaf" | "sliders";
const paths: Record<IconName, React.ReactNode> = {
  search: <><circle cx="10.5" cy="10.5" r="6.8" /><path d="m16 16 4.5 4.5" /></>,
  bag: <><path d="M5 7.5h14l1 14H4l1-14Z" /><path d="M8.5 8V6a3.5 3.5 0 0 1 7 0v2" /></>,
  heart: <path d="M20.8 5.4a5.5 5.5 0 0 0-7.8 0L12 6.5l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 22l8.8-8.8a5.5 5.5 0 0 0 0-7.8Z" transform="translate(1 -1) scale(.92)" />,
  arrow: <><path d="M3 12h17M14 6l6 6-6 6" /></>,
  "arrow-left": <><path d="M21 12H4m6-6-6 6 6 6" /></>,
  chevron: <path d="m7 10 5 5 5-5" />,
  close: <path d="m6 6 12 12M6 18 18 6" />,
  menu: <path d="M3 6h18M3 12h18M3 18h18" />,
  minus: <path d="M5 12h14" />,
  plus: <path d="M5 12h14M12 5v14" />,
  truck: <><path d="M2 5h12v12H2zM14 9h4l4 4v4h-8" /><circle cx="6" cy="18" r="2.5" /><circle cx="18" cy="18" r="2.5" /><path d="M14 13h8" /></>,
  shield: <><path d="m12 2 8 3v6c0 5-8 11-8 11S4 16 4 11V5l8-3Z" /><path d="m8 11 3 3 5-5" /></>,
  sparkles: <><path d="m12 2 2.8 7.2L22 12l-7.2 2.8L12 22l-2.8-7.2L2 12l7.2-2.8L12 2Z" /><path d="m20 2 .6 1.4L22 4l-1.4.6L20 6l-.6-1.4L18 4l1.4-.6L20 2Z" /></>,
  return: <><path d="M3 10a9 9 0 1 1 1 8M3 4v6h6" /><path d="M12 7v5l3 2" /></>,
  whatsapp: <><path d="M20.5 11.7a8.5 8.5 0 0 1-12.6 7.4L3 20.5l1.4-4.7a8.5 8.5 0 1 1 16.1-4.1Z" /><path d="M8.2 7.5c.5-.2 1.2 1.4 1.4 1.8.2.4-.6 1-.6 1.4.6 1.4 1.6 2.4 3 3 .4 0 1.1-.9 1.5-.7.4.2 2.1 1 2.1 1.5-.3 1.6-1.6 2-3 1.6-3.2-.9-5.6-3.4-6.2-6.1-.3-1.2.3-2.3 1.8-2.5Z" /></>,
  instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="1" /><path d="m3 6 9 7 9-7" /></>,
  check: <path d="m5 12 4.5 4.5L19 7" />,
  trash: <><path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7" /></>,
  leaf: <><path d="M20 3C9 2 3 7 5 14s14 8 15-11Z" /><path d="M4 21 16 8" /></>,
  sliders: <><path d="M4 7h16M4 17h16" /><circle cx="9" cy="7" r="2.5" fill="currentColor" /><circle cx="15" cy="17" r="2.5" fill="currentColor" /></>,
};
export function Icon({ name, size = 22, className = "", style }: { name: IconName; size?: number; className?: string; style?: CSSProperties }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className} style={style}>{paths[name]}</svg>;
}
export function BrandMark({ small = false }: { small?: boolean }) {
  return <span className={`brand-mark ${small ? "brand-mark-small" : ""}`}><span>AAVIRA</span><span className="brand-sub"><i />ESSENTIAL<i /></span></span>;
}
export function Ornament() {
  return <span className="ornament" aria-hidden="true"><i /><svg width="28" height="25" viewBox="0 0 28 25" fill="none" stroke="currentColor" strokeWidth=".8"><path d="M14 23V9M14 16C2 16 3 5 3 5s10 1 11 11ZM14 16C26 16 25 5 25 5s-10 1-11 11ZM14 12C6 7 14 1 14 1s8 6 0 11Z" /></svg><i /></span>;
}
