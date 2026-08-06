"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { useCreateEnquiry } from "@/hooks/use-enquiries";
export default function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      company: "",
      subject: "",
      message: "",
      agreed: false,
    },
  });

  const agreed = watch("agreed");

  const { mutate, isPending, isSuccess } = useCreateEnquiry(() => {
    reset();
  });

  const onSubmit = (data) => {
    mutate({
      name: data.name,
      phone: data.phone,
      email: data.email,
      company: data.company,
      subject: data.subject,
      message: data.message,
    });
  };

  if (isSuccess) {
    return (
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 text-primary">
        Thanks — your enquiry has been sent successfully.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <input
            type="text"
            placeholder="Your name*"
            className="h-12 w-full rounded-full border px-5"
            {...register("name", {
              required: "Name is required",
            })}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div>
          <input
            type="tel"
            placeholder="Your phone*"
            className="h-12 w-full rounded-full border px-5"
            {...register("phone", {
              required: "Phone is required",
            })}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <input
            type="email"
            placeholder="Your email*"
            className="h-12 w-full rounded-full border px-5"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Enter a valid email",
              },
            })}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div>
          <input
            type="text"
            placeholder="Company"
            className="h-12 w-full rounded-full border px-5"
            {...register("company")}
          />
        </div>
      </div>

      <div>
        <input
          type="text"
          placeholder="Subject*"
          className="h-12 w-full rounded-full border px-5"
          {...register("subject", {
            required: "Subject is required",
          })}
        />
        {errors.subject && (
          <p className="mt-1 text-sm text-red-500">{errors.subject.message}</p>
        )}
      </div>

      <div>
        <textarea
          rows={6}
          placeholder="Your message*"
          className="w-full rounded-2xl border p-5"
          {...register("message", {
            required: "Message is required",
          })}
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>
        )}
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          {...register("agreed", {
            required: true,
          })}
        />
        <span>
          I agree to the{" "}
          <Link href="/privacy" className="text-primary">
            Privacy Policy
          </Link>
        </span>
      </label>

      <Button
        type="submit"
        variant="lg"
        className="bg-primary text-white"
        disabled={!agreed || isPending}
      >
        {isPending ? "Sending..." : "Send"}
      </Button>
    </form>
  );
}
