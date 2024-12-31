"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { sendVerification } from "@/app/api/registration/send-verification";
import { Input, Button, Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from "@/components/ui";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";

// Validation schema
const PhoneNumberSchema = z.object({
  countryCode: z.string().min(1, "Country code is required."),
  phoneNumber: z.string().regex(/^\d+$/, "Must be a valid phone number."),
});

export default function PhoneNumberForm() {
  const form = useForm<z.infer<typeof PhoneNumberSchema>>({
    resolver: zodResolver(PhoneNumberSchema),
    defaultValues: {
      countryCode: "+1",
      phoneNumber: "",
    },
  });

  const router = useRouter();

  async function onSubmit(data: z.infer<typeof PhoneNumberSchema>) {
    try {
      const response = await sendVerification(data);

      if (response?.message) {
        form.setError("phoneNumber", { message: response.message });
        return;
      }

      // Redirect on success
      router.push("/registration/confirm-phone");
    } catch (error) {
      console.error("Error submitting phone number:", error);
      form.setError("phoneNumber", { message: "An unexpected error occurred. Please try again." });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex items-center space-x-2">
          {/* Country Code Selector */}
          <FormField
            control={form.control}
            name="countryCode"
            render={({ field }) => (
              <FormItem className="w-28">
                <FormControl>
                  <Select {...field}>
                    <SelectTrigger>
                      <SelectValue placeholder="Code" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="+1">+1 (USA)</SelectItem>
                      <SelectItem value="+44">+44 (UK)</SelectItem>
                      <SelectItem value="+91">+91 (India)</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />

          {/* Phone Number Input */}
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter your phone number"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Error Message */}
        {form.formState.errors.phoneNumber && (
          <p className="text-red-500 text-sm text-center mt-2">
            {form.formState.errors.phoneNumber.message}
          </p>
        )}

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Sending..." : "Continue"}
        </Button>
      </form>
    </Form>
  );
}
