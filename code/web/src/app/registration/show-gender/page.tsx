import { Progress } from "@/components/ui";
import ShowGenderForm from "./form";

export default async function ShowGenderPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <div className="max-w-md w-full text-center">
        <Progress value={66} className="mb-6" />

        <h1 className="text-2xl font-bold mb-4">Show your gender on your profile?</h1>

        <ShowGenderForm />
      </div>
    </div>
  );
}
