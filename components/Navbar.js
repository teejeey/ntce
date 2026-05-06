"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

/** Warm the App Router cache so first clicks feel instant (especially over ngrok). */
const PREFETCH_HREFS = [
  "/",
  "/schedule",
  "/programme",
  "/speakers",
  "/sponsors",
  "/events",
  "/about",
  "/register",
  "/contact",
  "/faq",
  "/packages",
];

const links = [
  { href: "/", label: "Home" },
  { href: "/schedule", label: "Programme" },
  // { href: "/programme", label: "Conference & Exhibitions" },
  { href: "/speakers", label: "Speakers" },
  { href: "/sponsors", label: "Sponsors" },
  { href: "/events", label: "Announcement" },
  { href: "/about", label: "About Us" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(event) {
      const el = navRef.current;
      if (el && !el.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  useEffect(() => {
    for (const href of PREFETCH_HREFS) {
      try {
        router.prefetch(href);
      } catch {
        // ignore prefetch failures (e.g. during tests)
      }
    }
  }, [router]);

  return (
    <nav
      ref={navRef}
      className={`navbar container ${open ? "menu-open" : ""}`}
    >
      <Link className="brand" href="/">
        <img className="brand-logo" src="/logo1.png" alt="NTCE logo" loading="lazy" />
      </Link>

      <button
        className="nav-toggle"
        type="button"
        aria-label="Toggle navigation"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={`hamburger ${open ? "open" : ""}`}>
          <span />
          <span />
          <span />
        </span>
      </button>

      <ul className={`nav-links ${open ? "open" : ""}`}>
        {links.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={pathname === item.href ? "active" : ""}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      <Link className="btn btn-outline" href="/register">
        Registration
      </Link>
    </nav>
  );
}