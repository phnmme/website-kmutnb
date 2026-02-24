// src/config/navbar.ts

import { Eye, Logs, ShieldUser, Users } from "lucide-react";

export const navLinks = [
  {
    label: "หน้าแรก",
    href: "/",
  },
  {
    label: "ข้อมูลนักศึกษา",
    href: "/students",
  },
  {
    label: "ข้อมูลสถิติ",
    href: "/statistics",
  },
];

export const authNavLinks = [
  {
    label: "หน้าแรก",
    href: "/",
  },
  {
    label: "ข้อมูลนักศึกษา",
    href: "/students",
  },
  {
    label: "ข้อมูลสถิติ",
    href: "/statistics",
  },
  {
    label: "แนะนำ & รีวิว",
    href: "/reviews",
  },
];

export const adminNavLinks = [
  {
    label: "จัดการผู้ใช้แอดมิน",
    href: "/backend/admin",
    icon: ShieldUser,
  },
  {
    label: "จัดการผู้ใช้ทั่วไป",
    href: "/backend/admin/users",
    icon: Users,
  },
  {
    label: "ดูรีวิว",
    href: "/backend/admin/reviews",
    icon: Eye,
  },
  {
    label: "ดูบันทึกกิจกรรม",
    href: "/backend/admin/logs",
    icon: Logs,
  },
];
