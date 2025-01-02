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
import { RadioGroup, RadioGroupItem, Switch, Button } from "@/components/ui";
import { saveStep } from "@/app/api/registration/save-step";
import { useEffect, useState } from "react";
import { getRegistrationState } from "@/app/api/registration/get-registration-state";

const ShowGenderSchema = z.object({
  gender: z.string().min(1, { message: "Gender is required" }),
  isVisible: z.boolean(),
});

export default function ShowGenderForm() {
  const [isLoading, setIsLoading] = useState(true);
  const [initialValues, setInitialValues] = useState({
    gender: "",
    isVisible: true,
  });

  const form = useForm<z.infer<typeof ShowGenderSchema>>({
    resolver: zodResolver(ShowGenderSchema),
    defaultValues: {
      gender: "", 
      isVisible: true, 
    },
  });

  const router = useRouter();

  useEffect(() => {
    async function fetchState() {
      try {
        const state = await getRegistrationState();
        const gender = state.registrationData?.gender?.gender || "";
        const isVisible = state.registrationData?.showGender?.showGender ?? true;

        setInitialValues({ gender, isVisible });
        form.reset({ gender, isVisible });
      } catch (error) {
        console.error("Failed to fetch registration state:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchState();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      form.reset(initialValues);
    }
  }, [isLoading, initialValues, form]);

  const onSubmit = async (data: z.infer<typeof ShowGenderSchema>) => {
    try {
      await saveStep({
        step: "show_gender",
        data: { showGender: data.isVisible },
      });

      router.push("/registration/show-gender");
    } catch (error) {
      console.error("Error updating gender visibility:", error);
      form.setError("isVisible", { message: "An unexpected error occurred." });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    <RadioGroupItem
                      id="man"
                      value="Uncle" 
                      disabled
                    />
                    <label htmlFor="man" className="text-sm">
                      Man
                    </label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem
                      id="woman"
                      value="Auntie" 
                      disabled
                    />
                    <label htmlFor="woman" className="text-sm">
                      Woman
                    </label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem
                      id="nonbinary"
                      value="Two Spirit" 
                      disabled
                    />
                    <label htmlFor="nonbinary" className="text-sm">
                      Nonbinary
                    </label>
                  </div>
                </RadioGroup>
              </FormControl>
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
