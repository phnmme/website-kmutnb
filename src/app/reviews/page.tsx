/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import CareerReviewForm from "@/components/reviews/CareerReviewForm";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

export default function ReviewsPage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const hasChecked = useRef(false);

  useEffect(() => {
    if (hasChecked.current) return;
    hasChecked.current = true;

    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/");
    } else {
      setIsChecking(false);
    }
  }, [router]);

  if (isChecking) {
    return (
      <div className="relative flex items-center justify-center min-h-screen bg-bluez-tone-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-bluez-tone-5 mb-4"></div>
          <p className="text-bluez-tone-5">กำลังตรวจสอบ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center overflow-hidden py-10 pt-26 min-h-screen bg-bluez-tone-4 px-4 md:px-10">
      <CareerReviewForm />
    </div>
  );
}
