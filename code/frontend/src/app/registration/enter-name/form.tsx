"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button, Input } from "@/components/ui";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { saveStep } from "@/app/api/registration/save-step";
import { useState } from "react";

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
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(data: z.infer<typeof NameSchema>) {
    setSubmitting(true);
    try {
      await saveStep({
        step: "name",
        data: { name: data.name },
      });

      router.push("/registration/enter-dob");
    } catch (error) {
      console.error("Error updating name:", error);
      form.setError("name", { message: "An unexpected error occurred." });
    } finally {
      setSubmitting(false);
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
        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? "Submitting..." : "Continue"}
        </Button>
      </form>
    </Form>
  );
}
