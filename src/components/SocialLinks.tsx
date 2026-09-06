import React from "react";

interface SocialLinksProps { variant?: "footer" | "inline"; }

export const SOCIALS = [
  { name: "Instagram", url: "https://www.instagram.com/enzo.th/" },
  { name: "TikTok", url: "https://www.tiktok.com/@eltrovadorerrante7" },
  { name: "Spotify", url: "https://open.spotify.com/show/5FZAP7k9Z1w2d5atm4vJfb" },
  { name: "VSCO", url: "https://vsco.co/enzo7h/gallery" },
  { name: "Pinterest", url: "https://es.pinterest.com/enzoth7/" },
  { name: "Goodreads", url: "https://www.goodreads.com/user/show/193998839-enzo" },
  { name: "Letterboxd", url: "https://letterboxd.com/enzo7h/" },
];

export const SocialLinks: React.FC<SocialLinksProps> = ({ variant = "inline" }) => (
  <div className={`flex flex-wrap ${variant === "footer" ? "gap-x-6 gap-y-3" : "gap-3"}`}>
    {SOCIALS.map((social) => (
      <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" className={`inline-flex min-h-11 items-center border-b text-[0.7rem] font-bold uppercase tracking-[0.14em] transition-colors ${variant === "footer" ? "border-white/35 text-white hover:border-white" : "rounded-full border-blue px-5 text-blue hover:bg-blue hover:text-white"}`}>
        {social.name}
      </a>
    ))}
  </div>
);
