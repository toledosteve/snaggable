"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui";
import LocationAccessModal from "@/components/ui/LocationAccessModal";

const LocationAccessPage = () => {
  const router = useRouter();

  const checkLocationAccess = async () => {
    console.log(navigator.permissions);
    if (!navigator.permissions) return;

    try {
      const permissionStatus = await navigator.permissions.query({ name: "geolocation" });
      if (permissionStatus.state === "granted") {
        // Auto-route to pledge page if permission is already granted
        router.push("/registration/pledge");
      } else if (permissionStatus.state === "prompt") {
        console.log("Location permission needs to be prompted.");
      } else {
        console.log("Location permission denied. User needs to allow access.");
      }
    } catch (error) {
      console.error("Error checking location permission:", error);
    }
  };

  useEffect(() => {
    checkLocationAccess();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <div className="max-w-md w-full text-center">
        <Progress value={88} className="mb-6" />

        <h1 className="text-2xl font-bold mb-4">
          We need your location to show who’s nearby
        </h1>
        <p className="text-gray-500 mb-6">
          Grant us access to your location so we can show you awesome matches in your area.
        </p>

        <LocationAccessModal />
      </div>
    </div>
  );
};

export default LocationAccessPage;
