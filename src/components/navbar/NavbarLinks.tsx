// src/components/navbar/NavbarLinks.tsx
import Link from "next/link";
import { navLinks } from "@/configs/navbar";

export default function NavbarLinks() {
  return (
    <div className="hidden lg:flex gap-6">
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-congress-50 hover:text-[#80eeff] transition duration-600 "
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}
