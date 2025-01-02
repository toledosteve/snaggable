import { Progress } from "@/components/ui";
import DOBForm from "./form";

export default async function BirthdayPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <div className="max-w-md w-full text-center">
        <Progress value={44} className="mb-6" />

        <h1 className="text-2xl font-bold mb-4">Hey there! When’s your birthday?</h1>
        <p className="text-gray-500 mb-4">You must be at least 18 years old to use Snaggable.</p>

        <DOBForm />

        <p className="text-sm text-gray-500 mt-6">
          Prefer to use your Facebook birthday?{' '}
          <a href="#" className="text-blue-600">Use Facebook instead</a>.
        </p>
      </div>
    </div>
  );
}
