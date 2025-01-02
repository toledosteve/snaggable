export const stepRoutes: Record<string, string> = {
  get_started: "/registration/get-started",
  confirm_phone: "/registration/confirm-phone",
  name: "/registration/enter-name",
  dob: "/registration/enter-dob",
  gender: "/registration/gender",
  show_gender: "/registration/show-gender",
  photos: "/registration/upload-photos",
  location: "/registration/location",
  pledge: "/registration/pledge",
  complete: "/registration/complete",
}

export function getRouteForNextStep(step: string): string {
  const route = stepRoutes[step];
  if (!route) {
    throw new Error(`No route found for step: ${step}`);
  }
  return route;
}