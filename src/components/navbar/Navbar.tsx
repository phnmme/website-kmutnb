// src/components/navbar/Navbar.tsx
"use client";

import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import NavbarBrand from "./NavbarBrand";
import NavbarLinks from "./NavbarLinks";
import NavbarActions from "./NavbarActions";
import MobileSidebar from "./MobileSidebar";
import { User } from "@/types/user";

type Props = {
  user?: User | null;
  loading?: boolean; // เพิ่ม
  onLogout?: () => void;
};

export default function Navbar({ user, loading = false, onLogout }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-bluez-tone-3 shadow-md backdrop-blur-md">
        <div className="mx-auto h-full px-6 flex items-center justify-between">
          <NavbarBrand />
          <NavbarLinks isAdmin={false} />
          <div className="flex items-center gap-4">
            <div className="hidden lg:block">
              {/* เพิ่ม: Loading skeleton */}
              {loading ? (
                <div className="flex items-center gap-3">
                  <div className="h-8 w-20 bg-gray-200/50 rounded-md animate-pulse"></div>
                  <div className="h-8 w-20 bg-gray-200/50 rounded-md animate-pulse"></div>
                </div>
              ) : (
                <NavbarActions user={user} onLogout={onLogout} />
              )}
            </div>

            <button
              onClick={() => setIsOpen(true)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100"
              aria-label="Open menu"
              disabled={loading} // เพิ่ม
            >
              <Menu className="w-6 h-6 text-congress-50" />
            </button>
          </div>
        </div>
      </nav>

      <MobileSidebar
        isOpen={isOpen}
        user={user}
        loading={loading} // เพิ่ม prop
        onClose={() => setIsOpen(false)}
        onLogout={onLogout}
      />
    </>
  );
}
