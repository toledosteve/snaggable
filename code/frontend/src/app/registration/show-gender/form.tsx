"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { updateRegistrationSession } from "@/app/api/registration/update-registration";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem, Switch, Button } from "@/components/ui";

// Validation schema for Show Gender
const ShowGenderSchema = z.object({
  gender: z.string().min(1, { message: "Gender is required" }),
  isVisible: z.boolean(),
});

export default function ShowGenderForm() {
  const form = useForm<z.infer<typeof ShowGenderSchema>>({
    resolver: zodResolver(ShowGenderSchema),
    defaultValues: {
      gender: "Man", // Default gender
      isVisible: true, // Default visibility
    },
  });

  const router = useRouter();

  const onSubmit = async (data: z.infer<typeof ShowGenderSchema>) => {
    try {
      console.log("Selected Gender:", data.gender);
      console.log("Visibility:", data.isVisible);

      // Update the registration session with gender visibility
      await updateRegistrationSession({ gender: data.gender, isVisible: data.isVisible });

      // Redirect to the next step
      router.push("/registration/upload-photos");
    } catch (error) {
      console.error("Error updating registration session:", error);
      form.setError("gender", {
        message: "An unexpected error occurred. Please try again.",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Visibility Toggle */}
        <FormField
          control={form.control}
          name="isVisible"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <label htmlFor="gender-visibility" className="text-sm font-medium">
                  Shown on your profile
                </label>
                <Switch
                  id="gender-visibility"
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(checked)}
                />
              </div>
            </FormItem>
          )}
        />

        {/* Gender Selection */}
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  value={field.value}
                  onValueChange={(value) => field.onChange(value)}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem id="man" value="Man" />
                    <label htmlFor="man" className="text-sm">
                      Man
                    </label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem id="woman" value="Woman" />
                    <label htmlFor="woman" className="text-sm">
                      Woman
                    </label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem id="nonbinary" value="Nonbinary" />
                    <label htmlFor="nonbinary" className="text-sm">
                      Nonbinary
                    </label>
                  </div>
                </RadioGroup>
              </FormControl>
              <div className="text-red-500 text-sm mt-2">
                {form.formState.errors.gender?.message}
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          {form.formState.isSubmitting ? "Submitting..." : "Continue"}
        </Button>
      </form>
    </Form>
  );
}
