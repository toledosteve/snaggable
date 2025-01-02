import { Progress } from "@/components/ui";
import NameForm from "./form";

export default async function NamePage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <div className="max-w-md w-full text-center">
        <Progress value={33} className="mb-6" />
        <h1 className="text-2xl font-bold mb-4">Nice one! So, what do you like to be called?</h1>
        <p className="text-gray-500 mb-4">This is how you’ll appear on Snaggable.</p>
        <NameForm />
      </div>
    </div>
  );
}
