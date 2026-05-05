import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <h3>NTCE 2026</h3>
          <p>National Technology Conference & Exhibition, Thimphu, Bhutan.</p>
        </div>
        <div>
          <h3>Quick Links</h3>
          <div className="footer-links">
            {/* <Link href="/programme">Programme</Link> */}
            <Link href="/faq">FAQ</Link>
            <Link href="/register">Register</Link>
          </div>
        </div>
        <div>
          <h3>Social Media</h3>
          <div className="social-icons">
            <a
              className="social-icon"
              href="https://www.facebook.com/share/1Cbizv5rFa/?mibextid=wwXIfr"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              title="Facebook"
            >
              f
            </a>
            <a
              className="social-icon"
              href="https://www.instagram.com/ntce.bt?igsh=MWVuZm90a3IzNGR0aw=="
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              title="Instagram"
            >
              ig
            </a>
            <a
              className="social-icon"
              href="https://www.tiktok.com/@ntce_2026"
              target="_blank"
              rel="noreferrer"
              aria-label="TikTok"
              title="TikTok"
            >
              ♪
            </a>
            <a
              className="social-icon"
              href="https://www.youtube.com/@NTCE_2026"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
              title="YouTube"
            >
              ▶
            </a>
          </div>
        </div>
      </div>
      <div className="container footer-bottom">
        <p>© 2026 National Technology Conference & Exhibition, Bhutan</p>
      </div>
    </footer>
  );
}
