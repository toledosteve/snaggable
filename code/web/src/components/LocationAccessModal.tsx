"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui";

interface LocationAccessModalProps {
  onAllow: () => void;
}

const LocationAccessModal = ({ onAllow }: LocationAccessModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLocationAccess = () => {
    if (!navigator.geolocation) {
      setErrorMessage("Geolocation is not supported by your browser.");
      return;
    }

    setIsOpen(true);

    navigator.geolocation.getCurrentPosition(
      () => {
        setErrorMessage(null);
        setIsOpen(false);
        onAllow();
      },
      (error) => {
        console.error("Error getting location:", error.message);
        setErrorMessage("Failed to get location access. Please try again.");
      }
    );
  };

  return (
    <>
      <Button variant="default" className="mb-4" onClick={handleLocationAccess}>
        Allow location access
      </Button>
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
