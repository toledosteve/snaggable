"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { updateRegistrationSession } from "@/app/api/registration/update-registration";
import { useRouter } from "next/navigation";
import DatePicker, { DatePickerValue } from "@/components/ui/date-picker";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
} from "@/components/ui/form";
import { Button } from "@/components/ui";

// Validation schema for DOB
const DOBSchema = z.object({
  dob: z.object({
    month: z.string().min(1, { message: "Month is required" }),
    day: z
      .number({ message: "Day is required" })
      .int({ message: "Day is required" })
      .min(1, { message: "Day is required" })
      .max(31, { message: "Day must be valid" }),
    year: z
      .number({ message: "Year is required" })
      .int({ message: "Year is required" })
      .min(new Date().getFullYear() - 100, { message: "Year must be realistic" })
      .max(new Date().getFullYear() - 18, { message: "You must be at least 18 years old" }),
  }),
});

export default function DOBForm() {
  const form = useForm<z.infer<typeof DOBSchema>>({
    resolver: zodResolver(DOBSchema),
    defaultValues: {
      dob: { month: "", day: undefined, year: undefined },
    },
  });
  
  const router = useRouter();

  const onSubmit = async (data: z.infer<typeof DOBSchema>) => {
    try {
      // Call API to update registration session
      await updateRegistrationSession({ dob: data.dob });

      // Redirect to the next step
      router.push("/registration/gender");
    } catch (error) {
      console.error("Error updating registration session:", error);
      form.setError("dob", { message: "An unexpected error occurred. Please try again." });
    }
  };

  const handleFieldChange = (
    field: keyof DatePickerValue,
    value: string | number | undefined
  ) => {
    if (value !== undefined && value !== null) {
      form.clearErrors(`dob`); // Clear specific field errors
      form.setValue(`dob.${field}`, value, { shouldValidate: false }); // Validate only the current field
    }
  };

  // Focus on the first validation error
  const errorMessage =
    form.formState.errors.dob?.month?.message ||
    form.formState.errors.dob?.day?.message ||
    form.formState.errors.dob?.year?.message;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <DatePicker
                  value={field.value}
                  onChange={(field, value) => handleFieldChange(field, value)}
                  disableDay={!field.value.month} // Disable day until month is selected
                  disableYear={!field.value.day} // Disable year until day is selected
                />
              </FormControl>
              <div className="text-red-500 text-sm mt-2">
                {errorMessage}
              </div>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          {form.formState.isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
}
