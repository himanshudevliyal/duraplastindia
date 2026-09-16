"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";

import { useSubscribeNewsletter } from "@/hooks/newsletter";

import { z } from "zod";

export const newsletterSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

export default function Newsletter() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: "",
    },
  });

  const subscribeMutation = useSubscribeNewsletter(() => {
    reset();
  });

  const onSubmit = (data) => {
    subscribeMutation.mutate(data);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-white">
        Sign Up to Newsletter
      </h3>

      <p className="mt-4 text-[14px] leading-6 text-gray-400">
        Subscribe for product updates and project stories.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-5"
      >
        <div className="flex overflow-hidden rounded-full border border-white/15">
          <input
            type="email"
            placeholder="Your email address"
            {...register("email")}
            disabled={subscribeMutation.isPending}
            className="h-11 flex-1 bg-transparent px-5 text-sm text-white placeholder:text-gray-500 outline-none"
          />

          <Button
            type="submit"
            disabled={subscribeMutation.isPending}
            className="h-11 rounded-none rounded-r-full bg-[oklch(0.5164_0.2011_28.1378)] px-7 text-white hover:opacity-90"
          >
            {subscribeMutation.isPending ? "Submitting..." : "Sign Up"}
          </Button>
        </div>

        {errors.email && (
          <p className="mt-2 px-2 text-xs text-red-400">
            {errors.email.message}
          </p>
        )}

        {subscribeMutation.isSuccess && (
          <p className="mt-3 px-2 text-sm text-green-400">
            {subscribeMutation.data?.message ||
              "Thank you for subscribing to our newsletter."}
          </p>
        )}

        {subscribeMutation.isError && (
          <p className="mt-3 px-2 text-sm text-red-400">
            {subscribeMutation.error?.response?.data?.message ||
              "Something went wrong. Please try again."}
          </p>
        )}
      </form>

 
    </div>
  );
}