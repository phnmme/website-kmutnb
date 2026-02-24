// src/app/layout.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Prompt } from "next/font/google";
import "./globals.css";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { logout, removeToken } from "@/action/authAction";
import { User } from "@/types/user";

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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch {
        removeToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []); // ✅ ไม่มี dependency เพราะ fetchUser ไม่ได้ใช้ค่าจาก state/props

  const handleLogout = () => {
    logout();
    setUser(null);
    router.push("/login");
  };

  return (
    <html lang="th">
      <body className={`${prompt.className} antialiased`}>
        <Navbar user={user} loading={loading} onLogout={handleLogout} />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
