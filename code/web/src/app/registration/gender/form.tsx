"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem, Button } from "@/components/ui";
import { saveStep } from "@/lib/api/registration/save-step";

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
      await saveStep({
        step: "gender",
        data: { gender: data.gender },
      });

      router.push("/registration/show-gender");
    } catch (error) {
      console.error("Error updating gender:", error);
      form.setError("gender", { message: "An unexpected error occurred." });
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
                    <RadioGroupItem id="uncle" value="Uncle" />
                    <label htmlFor="uncle" className="text-sm">
                      Uncle
                    </label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem id="auntie" value="Auntie" />
                    <label htmlFor="auntie" className="text-sm">
                      Auntie
                    </label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem id="2spirit" value="2 spirit" />
                    <label htmlFor="2spirit" className="text-sm">
                      2 Spirit
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