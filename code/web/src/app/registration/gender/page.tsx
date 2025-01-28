import { Progress } from "@/components/ui";
import GenderForm from "./form";

export default async function GenderPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <div className="max-w-md w-full text-center">
        <Progress value={55} className="mb-6" />

        <h1 className="text-2xl font-bold mb-4">What’s your gender?</h1>

        <GenderForm />
      </div>
    </div>
  );
}
