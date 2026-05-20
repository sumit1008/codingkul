import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "AlgoShashtra Admin",
  description: "DSA Sheets CMS — Admin Panel",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        {children}
        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            style: {
              background: "#0c0c1e",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#e8e8f4",
            },
          }}
        />
      </body>
    </html>
  );
}
