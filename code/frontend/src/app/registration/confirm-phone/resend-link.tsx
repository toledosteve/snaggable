"use client";

import React from "react";
import { resendVerification } from "@/app/api/registration/resend-verification";

export default function ResendLink() {
  const handleResend = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    try {
      await resendVerification();
      alert("Verification code resent.");
    } catch (error) {
      console.error("Error resending verification code:", error);
      alert("Failed to resend verification code. Please try again.");
    }
  };

  return (
    <a href="#" className="text-blue-600" onClick={handleResend}>
      Resend
    </a>
  );
}
