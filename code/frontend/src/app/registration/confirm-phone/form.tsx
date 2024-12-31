"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { verifyOtp } from "@/app/api/registration/verify-otp";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui";

// Validation schema for OTP
const OtpSchema = z.object({
  otp: z.string().length(4, "OTP must be exactly 4 digits"),
});

export default function OTPForm() {
  const form = useForm<z.infer<typeof OtpSchema>>({
    resolver: zodResolver(OtpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const router = useRouter();

  async function onSubmit(data: z.infer<typeof OtpSchema>) {
    try {
      const response = await verifyOtp(data);

      if (response?.message) {
        form.setError("otp", { message: response.message });
        return;
      }

      // Redirect to the next step on success
      router.push("/registration/enter-name");
    } catch (error) {
      console.error("Error verifying OTP:", error);
      form.setError("otp", { message: "An unexpected error occurred. Please try again." });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 flex flex-col items-center justify-center"
      >
        {/* OTP Input */}
        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <InputOTP maxLength={4} {...field}>
                  <InputOTPGroup className="flex gap-x-4 justify-center">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <InputOTPSlot
                        key={index}
                        index={index}
                        className="h-12 w-12 text-xl text-center border-2 border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage className="text-center mt-2" />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type="submit" className="w-full py-4 text-lg font-semibold">
          {form.formState.isSubmitting ? "Verifying..." : "Continue"}
        </Button>
      </form>
    </Form>
  );
}
