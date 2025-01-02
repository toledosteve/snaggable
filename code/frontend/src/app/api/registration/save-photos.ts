"use server";

import { apiFetch } from "@/lib/api-client";
import { getRegistrationSession } from "@/lib/session";

export async function uploadPhotos(files: File[]): Promise<void> {
const registrationSession = await getRegistrationSession();
  const registrationId = registrationSession.registrationId;

  const formData = new FormData();
  files.forEach((file) => {
    formData.append("photos", file);
  });
  formData.append("registrationId", registrationId);

  const response = await apiFetch("/user/register/upload-photos", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to upload photos.");
  }
}
