import "./globals.css";
import ContactFloat from "../components/ContactFloat";

export const metadata = {
  title: "National Technology Conference & Exhibition Bhutan",
  description: "NTCE 2026 official conference frontend",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          httpEquiv="Content-Security-Policy"
          content="upgrade-insecure-requests"
        />
      </head>
      <body suppressHydrationWarning>
        {children}
        <ContactFloat />
      </body>
    </html>
  );
}
