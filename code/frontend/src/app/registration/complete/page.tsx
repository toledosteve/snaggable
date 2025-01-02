"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getRegistrationState } from "@/app/api/registration/get-registration-state";
import { completeRegistration } from "@/app/api/registration/complete-registration";

const LoadingPage = () => {
  const router = useRouter();

  useEffect(() => {
    const handleCompletion = async () => {
      try {
        const state = await getRegistrationState();

        if (state.currentStep === "complete") {
          await completeRegistration();

          router.push("/registration/get-started");
        } else {
          const nextStepRoute = `/registration/${state.nextStep || "get-started"}`;
          router.push(nextStepRoute);
        }
      } catch (error) {
        console.error("Error handling registration completion:", error);
        router.push("/registration/get-started"); 
      }
    };

    handleCompletion();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white text-center">
      <h1 className="text-2xl font-bold mb-4">Finalizing your registration...</h1>
      <p className="text-gray-500">Please wait while we set things up for you.</p>
    </div>
  );
};

export default LoadingPage;
