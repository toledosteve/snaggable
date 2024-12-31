"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { updateRegistrationSession } from "@/app/api/registration/update-registration";
import { Button, Input } from "@/components/ui";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

// Validation schema
const NameSchema = z.object({
  name: z.string().min(1, "Name is required."),
});

export default function NameForm() {
  const form = useForm<z.infer<typeof NameSchema>>({
    resolver: zodResolver(NameSchema),
    defaultValues: {
      name: "",
    },
  });

  const router = useRouter();

  async function onSubmit(data: z.infer<typeof NameSchema>) {
    try {
      // Update the registration session
      await updateRegistrationSession({ name: data.name });

      // Redirect to the next step
      router.push("/registration/enter-dob");
    } catch (error) {
      console.error("Error updating name:", error);
      form.setError("name", { message: "An unexpected error occurred." });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Your name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Submitting..." : "Continue"}
        </Button>
      </form>
    </Form>
  );
}
