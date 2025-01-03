"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui";
import LocationAccessModal from "@/components/LocationAccessModal";
import { saveStep } from "@/app/api/registration/save-step";

const LocationAccessPage = () => {
  const router = useRouter();
  const [isGranted, setIsGranted] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // Guard to prevent duplicate saves

  const checkLocationAccess = async () => {
    if (!navigator.permissions) return;

    try {
      const permissionStatus = await navigator.permissions.query({
        name: "geolocation",
      });

      console.log("Permission status:", permissionStatus.state);

      if (permissionStatus.state === "granted" && !isSaving) {
        setIsGranted(true);
        await handleSaveLocation();
        router.push("/registration/pledge");
      }
    } catch (error) {
      console.error("Error checking location permission:", error);
    }
  };

  const handleSaveLocation = async () => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by your browser.");
      return;
    }

    if (isSaving) return;
    setIsSaving(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        try {
          await saveStep({
            step: "location",
            data: { latitude, longitude, accuracy },
          });
        } catch (error) {
          console.error("Error saving location:", error);
        } finally {
          setIsSaving(false); 
        }
      },
      (error) => {
        console.error("Error getting location:", error.message);
        setIsSaving(false); 
      }
    );
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
          Grant us access to your location so we can show you awesome matches in
          your area.
        </p>
        {!isGranted && (
          <LocationAccessModal
            onAllow={async () => {
              await handleSaveLocation();
              router.push("/registration/pledge");
            }}
          />
        )}
      </div>
    </div>
  );
};

export default LocationAccessPage;
