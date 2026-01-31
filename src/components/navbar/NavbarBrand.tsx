// src/components/navbar/NavbarBrand.tsx
import Link from "next/link";

export default function NavbarBrand() {
  return (
    <Link href="/" className="text-xl text-congress-50 font-bold">
      การจัดการเทคโนโลยีการผลิตและสารสนเทศ
    </Link>
  );
}
