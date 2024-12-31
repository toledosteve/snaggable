"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui";

const LocationAccessModal = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLocationAccess = () => {
    if (!navigator.geolocation) {
      setErrorMessage("Geolocation is not supported by your browser.");
      return;
    }

    setIsOpen(true); // Show modal

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("Location granted:", position);
        setErrorMessage(null);
        setIsOpen(false); // Close modal after successful permission
        // Navigate to pledge page
        router.push("/registration/pledge");
      },
      (error) => {
        console.error("Error getting location:", error.message);
        setErrorMessage("Failed to get location access. Please try again.");
      }
    );
  };

  return (
    <>
      {/* Trigger Button */}
      <Button variant="default" className="mb-4" onClick={handleLocationAccess}>
        Allow location access
      </Button>

      {/* Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="text-center">
          <DialogHeader>
            <DialogTitle>Please allow access to your location</DialogTitle>
          </DialogHeader>
          <p className="text-gray-500">
            Click "Allow" in your browser to grant access to your location.
          </p>
          {errorMessage && (
            <p className="text-red-500 text-sm mt-4">{errorMessage}</p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LocationAccessModal;
