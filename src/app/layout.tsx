// src/app/layout.tsx
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Bai_Jamjuree, Prompt } from "next/font/google";
import "./globals.css";

const bai = Bai_Jamjuree({
  subsets: ["thai", "latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
  display: "swap",
});

const prompt = Prompt({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-prompt",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className={prompt.className}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
