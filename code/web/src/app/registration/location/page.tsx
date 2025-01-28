"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui";
import LocationAccessModal from "@/components/LocationAccessModal";
import { saveStep } from "@/lib/api/registration/save-step";

const LocationAccessPage = () => {
  const router = useRouter();
  const [isGranted, setIsGranted] = useState(false);
  const [isSaving, setIsSaving] = useState(false); 
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Track errors

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
      }
    } catch (error) {
      console.error("Error checking location permission:", error);
      setErrorMessage("Failed to check location permissions.");
    }
  };

  const handleSaveLocation = async () => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by your browser.");
      setErrorMessage("Geolocation is not supported by your browser.");
      return;
    }

    if (isSaving) return;
    setIsSaving(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        try {
          console.log("Saving location:", { latitude, longitude, accuracy });
          await saveStep({
            step: "location",
            data: { latitude, longitude, accuracy },
          });
          router.push("/registration/pledge"); // Redirect after saving
        } catch (error) {
          console.error("Error saving location:", error);
          setErrorMessage("Failed to save your location. Please try again.");
        } finally {
          setIsSaving(false); 
        }
      },
      (error) => {
        console.error("Error getting location:", error.message);
        setErrorMessage("Failed to get your location. Please try again.");
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
        {errorMessage && (
          <div className="text-red-500 mb-4">{errorMessage}</div>
        )}
        {!isGranted && (
          <LocationAccessModal
            onAllow={async () => {
              await handleSaveLocation();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default LocationAccessPage;
