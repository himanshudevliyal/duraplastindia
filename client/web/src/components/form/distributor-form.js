"use client";

import { cloneElement, isValidElement, useId, useState } from "react";
import { useForm, useFormContext, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useCreateDistributorEnquiry } from "@/hooks/use-distributor-enquiry";
import {
  BUSINESS_TYPES,
  PRODUCTS_OF_INTEREST,
  HEARD_FROM,
  COUNTRIES,
} from "@/lib/data/distributor-form";

const trimmed = (message) => z.string().trim().min(1, message);

const schema = z
  .object({
    // Company Information
    company_name: trimmed("Company name is required"),
    country: trimmed("Please select a country"),
    city_region: trimmed("City / Region is required"),
    website: z
      .string()
      .trim()
      .refine(
        (v) => !v || /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$/i.test(v),
        "Enter a valid website (e.g. www.example.com)",
      )
      .optional(),
    business_type: z.array(z.string()).min(1, "Select at least one option"),
    business_type_other: z.string().trim().optional(),

    // Contact Information
    contact_person: trimmed("Contact person is required"),
    designation: trimmed("Designation is required"),
    email: trimmed("Email address is required").email("Enter a valid email"),
    mobile: trimmed("WhatsApp / mobile number is required")
      .regex(/^[0-9+\-()\s]+$/, "Enter a valid number (digits, +, -, spaces)")
      .refine(
        (v) => v.replace(/\D/g, "").length >= 7,
        "Number must have at least 7 digits",
      ),

    // Business Information
    products_of_interest: z
      .array(z.string())
      .min(1, "Select at least one product"),
    products_other: z.string().trim().optional(),
    about_company: trimmed("Please tell us about your company").min(
      20,
      "Please write at least 20 characters",
    ),
    heard_from: z.array(z.string()).optional(),
    heard_from_other: z.string().trim().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.business_type.includes("Other") && !data.business_type_other) {
      ctx.addIssue({
        code: "custom",
        path: ["business_type_other"],
        message: "Please specify",
      });
    }
    if (data.products_of_interest.includes("Other") && !data.products_other) {
      ctx.addIssue({
        code: "custom",
        path: ["products_other"],
        message: "Please specify",
      });
    }
  });

const defaultValues = {
  company_name: "",
  country: "",
  city_region: "",
  website: "",
  business_type: [],
  business_type_other: "",
  contact_person: "",
  designation: "",
  email: "",
  mobile: "",
  products_of_interest: [],
  products_other: "",
  about_company: "",
  heard_from: [],
  heard_from_other: "",
};

const inputClass = "h-12 w-full rounded-full border px-5 bg-white";

function FieldError({ error }) {
  return error ? (
    <p className="mt-1 text-sm text-red-500">{error.message}</p>
  ) : null;
}

// the label is tied to its control (id / htmlFor) so screen readers announce it
function Field({ label, required, error, children }) {
  const generatedId = useId();
  const single = isValidElement(children);
  const controlId = single ? (children.props.id ?? generatedId) : undefined;

  return (
    <div>
      <label htmlFor={controlId} className="mb-2 block text-sm font-medium">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      {single ? cloneElement(children, { id: controlId }) : children}
      <FieldError error={error} />
    </div>
  );
}

// checkbox group bound to an array field (+ "Other" text box)
function CheckboxGroup({ name, otherName, label, required, options }) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const selected = watch(name) || [];

  const toggle = (option, checked) => {
    setValue(
      name,
      checked ? [...selected, option] : selected.filter((v) => v !== option),
      { shouldValidate: true, shouldDirty: true },
    );
  };

  return (
    <div>
      <p className="mb-3 text-sm font-medium">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((option) => (
          <label
            key={option}
            className="flex cursor-pointer items-center gap-2 text-sm"
          >
            <input
              type="checkbox"
              className="size-4 accent-[var(--color-primary,#0f3d6e)]"
              checked={selected.includes(option)}
              onChange={(e) => toggle(option, e.target.checked)}
            />
            {option}
          </label>
        ))}
      </div>

      {selected.includes("Other") && (
        <div className="mt-3 max-w-md">
          <input
            type="text"
            placeholder="Please specify"
            className={cn(inputClass, { "border-red-500": errors[otherName] })}
            {...register(otherName)}
          />
          <FieldError error={errors[otherName]} />
        </div>
      )}

      <FieldError error={errors[name]} />
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <h3 className="border-b pb-2 text-lg font-semibold uppercase tracking-wide">
      {children}
    </h3>
  );
}

export default function DistributorForm() {
  const [serverError, setServerError] = useState("");

  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  const { mutate, isPending, isSuccess, reset: resetMutation } =
    useCreateDistributorEnquiry(() => {
      reset();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

  const onSubmit = (values) => {
    setServerError("");

    // honeypot: bots fill hidden fields, real users never see it
    if (document.getElementById("distributor-hp")?.value) return;

    mutate(
      {
        ...values,
        website: values.website || "",
        heard_from: values.heard_from || [],
      },
      {
        onError: (error) => {
          setServerError(
            error?.response?.data?.message ||
              "Something went wrong. Please try again.",
          );
        },
      },
    );
  };

  if (isSuccess) {
    return (
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center">
        <h3 className="text-xl font-semibold text-primary">
          Thank you for your interest!
        </h3>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          We have received your distributor application. Our team will review
          it and get back to you shortly. A confirmation has been sent to your
          email address.
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-6"
          onClick={() => resetMutation()}
        >
          Submit another application
        </Button>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10" noValidate>
        {/* Company Information */}
        <div className="space-y-5">
          <SectionTitle>Company Information</SectionTitle>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Company Name"
              required
              error={errors.company_name}
            >
              <input
                type="text"
                placeholder="Enter Company Name"
                className={cn(inputClass, {
                  "border-red-500": errors.company_name,
                })}
                {...register("company_name")}
              />
            </Field>

            <Field label="Country" required error={errors.country}>
              <select
                className={cn(inputClass, {
                  "border-red-500": errors.country,
                })}
                {...register("country")}
              >
                <option value="">Select Country</option>
                {COUNTRIES.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="City / Region" required error={errors.city_region}>
              <input
                type="text"
                placeholder="Enter City / Region"
                className={cn(inputClass, {
                  "border-red-500": errors.city_region,
                })}
                {...register("city_region")}
              />
            </Field>

            <Field label="Company Website" error={errors.website}>
              <input
                type="text"
                placeholder="Enter Website"
                className={cn(inputClass, {
                  "border-red-500": errors.website,
                })}
                {...register("website")}
              />
            </Field>
          </div>

          <CheckboxGroup
            name="business_type"
            otherName="business_type_other"
            label="Business Type"
            required
            options={BUSINESS_TYPES}
          />
        </div>

        {/* Contact Information */}
        <div className="space-y-5">
          <SectionTitle>Contact Information</SectionTitle>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Contact Person"
              required
              error={errors.contact_person}
            >
              <input
                type="text"
                placeholder="Full Name"
                className={cn(inputClass, {
                  "border-red-500": errors.contact_person,
                })}
                {...register("contact_person")}
              />
            </Field>

            <Field label="Designation" required error={errors.designation}>
              <input
                type="text"
                placeholder="Job Title"
                className={cn(inputClass, {
                  "border-red-500": errors.designation,
                })}
                {...register("designation")}
              />
            </Field>

            <Field label="Email Address" required error={errors.email}>
              <input
                type="email"
                placeholder="Email Address"
                className={cn(inputClass, { "border-red-500": errors.email })}
                {...register("email")}
              />
            </Field>

            <Field
              label="WhatsApp / Mobile Number"
              required
              error={errors.mobile}
            >
              <input
                type="tel"
                placeholder="Contact Number (with country code)"
                className={cn(inputClass, { "border-red-500": errors.mobile })}
                {...register("mobile")}
              />
            </Field>
          </div>
        </div>

        {/* Business Information */}
        <div className="space-y-6">
          <SectionTitle>Business Information</SectionTitle>

          <CheckboxGroup
            name="products_of_interest"
            otherName="products_other"
            label="Products of Interest"
            required
            options={PRODUCTS_OF_INTEREST}
          />

          <Field
            label="Briefly tell us about your company and your business activities"
            required
            error={errors.about_company}
          >
            <textarea
              rows={6}
              placeholder="Message"
              className={cn("w-full rounded-2xl border bg-white p-5", {
                "border-red-500": errors.about_company,
              })}
              {...register("about_company")}
            />
          </Field>

          <CheckboxGroup
            name="heard_from"
            otherName="heard_from_other"
            label="How did you hear about us?"
            options={HEARD_FROM}
          />
        </div>

        {/* honeypot */}
        <input
          id="distributor-hp"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
          defaultValue=""
        />

        {serverError && (
          <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {serverError}
          </p>
        )}

        <div className="space-y-3">
          {/* <p className="text-sm text-muted-foreground">
            Fields marked (<span className="text-red-500">*</span>) are
            mandatory.
          </p> */}

          <Button
            type="submit"
            variant="lg"
            className="bg-primary text-white"
            disabled={isPending}
          >
            {isPending ? "Submitting..." : "Submit Application"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
