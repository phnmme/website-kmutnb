// src/components/navbar/NavbarLinks.tsx
import Link from "next/link";
import { navLinks, authNavLinks } from "@/configs/navbar";
import { User } from "@/types/user";

export default function NavbarLinks({ user }: { user?: User | null }) {
  const links = user ? authNavLinks : navLinks;
  return (
    <div className="hidden lg:flex gap-6">
      {links.map((link) => (
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
