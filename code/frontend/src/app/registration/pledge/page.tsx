"use client";

import React from "react";
import { Button } from "@/components/ui";
import { useRouter } from "next/navigation";

const PledgePage = () => {
  const router = useRouter();

  const handleAgree = () => {
    router.push("/registration/next-step");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white text-center">
      <div className="max-w-lg w-full">


        {/* Pledge Text */}
        <h1 className="text-2xl font-bold mb-4">Before you swipe</h1>
        <p className="text-gray-600 mb-4">
          Welcome! We’re excited to be part of your dating journey.
        </p>
        <p className="text-gray-600 mb-4">
          Here we treat everyone with kindness and respect, no matter their race, religion,
          nationality, ethnicity, skin color, ability, size, sex, gender identity, or sexual
          orientation.
        </p>
        <p className="text-gray-600 mb-4">
          In our mission to actively keep this space safe and inclusive, we ask you to join us by
          adhering to our{" "}
          <a href="/guidelines" className="text-blue-600 underline">
            guidelines
          </a>.
        </p>
        <p className="text-gray-600 mb-6">
          And remember: We’ve always got your back!
        </p>
        <p className="text-yellow-600 font-medium">With love, The Snaggable Team</p>

        {/* Action Button */}
        <div className="mt-8">
          <Button variant="default" className="w-full" onClick={handleAgree}>
            I agree
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PledgePage;
