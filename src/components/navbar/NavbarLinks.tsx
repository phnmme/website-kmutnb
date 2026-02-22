// src/components/navbar/NavbarLinks.tsx
import Link from "next/link";
import { navLinks, adminNavLinks } from "@/configs/navbar";

export default function NavbarLinks({ isAdmin }: { isAdmin: boolean }) {
  const links = isAdmin ? adminNavLinks : navLinks;
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
