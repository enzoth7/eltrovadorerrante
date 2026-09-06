import Image from "next/image";
import Link from "next/link";

const socialNetworks = [
  { name: "Instagram", icon: "/icons/instagram.svg", href: "https://www.instagram.com/enzo.th/" },
  { name: "VSCO", icon: "/icons/vsco.svg", href: "https://vsco.co/enzo7h/gallery" },
  { name: "Pinterest", icon: "/icons/pinterest.svg", href: "https://es.pinterest.com/enzoth7/" },
  { name: "Spotify", icon: "/icons/spotify.svg", href: "https://open.spotify.com/show/5FZAP7k9Z1w2d5atm4vJfb" },
  { name: "TikTok", icon: "/icons/tiktok.svg", href: "https://www.tiktok.com/@eltrovadorerrante7" },
  { name: "Goodreads", icon: "/icons/goodreads-mark.svg", href: "https://www.goodreads.com/user/show/193998839-enzo" },
  { name: "Letterboxd", icon: "/icons/letterboxd-mark.svg", href: "https://letterboxd.com/enzo7h/", preserveColor: true },
] as const;

function SocialIcon({ social }: { social: (typeof socialNetworks)[number] }) {
  const icon = (
    <Image
      src={social.icon}
      alt=""
      width={48}
      height={48}
      className={`h-11 w-11 object-contain transition-opacity group-hover:opacity-70 ${"preserveColor" in social && social.preserveColor ? "" : "brightness-0 invert"}`}
    />
  );

  return (
    <a
      href={social.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group grid min-h-12 min-w-12 place-items-center"
      aria-label={social.name}
    >
      {icon}
    </a>
  );
}

export default function Footer() {
  return (
    <footer className="bg-blue text-white">
      <div className="mx-auto max-w-[1536px] px-6 pb-6 pt-16 sm:px-10 lg:px-16 lg:pt-20">
        <div className="grid gap-14 text-center md:grid-cols-[0.75fr_1.5fr_0.75fr] md:items-start md:text-left">
          <Link href="/" className="mx-auto inline-flex w-fit md:mx-0" aria-label="El Trovador Errante, inicio">
            <Image src="/brand/logo-white.png" alt="" width={192} height={192} className="h-40 w-40 object-contain lg:h-48 lg:w-48" />
          </Link>

          <div className="pt-2 md:pt-8 md:text-center">
            <div className="mb-4 text-base font-semibold uppercase">Redes</div>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 lg:gap-4">
              {socialNetworks.map((social) => <SocialIcon key={social.name} social={social} />)}
            </div>
          </div>

          <div id="contacto" className="pt-2 md:pt-8 md:text-right">
            <div className="mb-5 text-base font-semibold uppercase">Contacto</div>
            <a href="mailto:enzothome1@gmail.com" className="inline-flex min-h-11 items-center text-base font-normal underline-offset-4 hover:underline">
              enzothome1@gmail.com
            </a>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-[1220px] border-t border-white/60 pt-4 text-center text-sm font-normal">
          © {new Date().getFullYear()} El Trovador Errante
        </div>
      </div>
    </footer>
  );
}
