"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { updateRegistrationSession } from "@/app/api/registration/save-step";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem, Button } from "@/components/ui";

// Validation schema for Gender
const GenderSchema = z.object({
  gender: z.string().min(1, { message: "Gender is required" }),
});

export default function GenderForm() {
  const form = useForm<z.infer<typeof GenderSchema>>({
    resolver: zodResolver(GenderSchema),
    defaultValues: {
      gender: "",
    },
  });

  const router = useRouter();

  const onSubmit = async (data: z.infer<typeof GenderSchema>) => {
    try {
      console.log("Selected Gender:", data.gender);

      // Call API to update registration session
      await updateRegistrationSession({ gender: data.gender });

      // Redirect to the next step
      router.push("/registration/show-gender");
    } catch (error) {
      console.error("Error updating registration session:", error);
      form.setError("gender", {
        message: "An unexpected error occurred. Please try again.",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  value={field.value}
                  onValueChange={(value) => form.setValue("gender", value)}
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