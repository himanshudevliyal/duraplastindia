"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { LoaderCircleIcon } from "lucide-react";
import { toast } from "sonner";
import z from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import Loader from "../loader";
import ErrorMessage from "../ui/error";

import {
  useDistributorEnquiry,
  useDistributorEnquiryOptions,
  useUpdateDistributorEnquiry,
} from "@/hooks/use-distributor-enquiries";

const optionalText = z.string().optional().nullable();

export const schema = z.object({
  // Company Information
  company_name: z.string().trim().min(1, "Company name is required"),
  country: z.string().trim().min(1, "Country is required"),
  city_region: z.string().trim().min(1, "City / Region is required"),
  website: optionalText,
  business_type: z.array(z.string()).min(1, "Select at least one"),
  business_type_other: optionalText,

  // Contact Information
  contact_person: z.string().trim().min(1, "Contact person is required"),
  designation: z.string().trim().min(1, "Designation is required"),
  email: z.string().trim().email("Invalid email"),
  mobile: z
    .string()
    .trim()
    .min(5, "WhatsApp / mobile number is required")
    .regex(/^[0-9+\-()\s]+$/, "Invalid contact number"),

  // Business Information
  products_of_interest: z.array(z.string()).min(1, "Select at least one"),
  products_other: optionalText,
  about_company: z.string().trim().min(1, "This field is required"),
  heard_from: z.array(z.string()).optional(),
  heard_from_other: optionalText,
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

function FieldError({ error }) {
  return error ? (
    <p className="text-xs text-red-500">{error.message}</p>
  ) : null;
}

function TextField({ name, label, required, placeholder, className }) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={name}>
        {label}
        {required && <span className="text-red-500"> *</span>}
      </Label>
      <Input
        id={name}
        {...register(name)}
        placeholder={placeholder || `Enter ${label.toLowerCase()}`}
        className={cn({ "border-red-500": errors[name] })}
      />
      <FieldError error={errors[name]} />
    </div>
  );
}

// checkbox group bound to an array field (+ optional "Other" text input)
function CheckboxGroup({ name, otherName, label, required, options = [] }) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();

  const selected = watch(name) || [];

  const toggle = (option, checked) => {
    const next = checked
      ? [...selected, option]
      : selected.filter((item) => item !== option);

    setValue(name, next, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <div className="col-span-full space-y-3">
      <Label>
        {label}
        {required && <span className="text-red-500"> *</span>}
      </Label>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {options.map((option) => (
          <label
            key={option}
            className="flex cursor-pointer items-center gap-2 text-sm"
          >
            <Checkbox
              checked={selected.includes(option)}
              onCheckedChange={(checked) => toggle(option, checked === true)}
            />
            {option}
          </label>
        ))}
      </div>

      {otherName && selected.includes("Other") && (
        <Input
          {...register(otherName)}
          placeholder="Please specify"
          className="max-w-md"
        />
      )}

      <FieldError error={errors[name]} />
    </div>
  );
}

export default function DistributorEnquiryForm({ id }) {
  const router = useRouter();

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

  const { data, isLoading, isError, error } = useDistributorEnquiry(id);
  const { data: options } = useDistributorEnquiryOptions();

  const updateMutation = useUpdateDistributorEnquiry(id, () => {
    toast.success("Updated.");
    router.push(`/distributor-enquiries/${id}`);
  });

  useEffect(() => {
    if (!data) return;

    // keep only the form fields (drop id / created_at / updated_at) and
    // turn nulls from the API into empty strings for the inputs
    const values = {};
    Object.keys(defaultValues).forEach((key) => {
      values[key] = data[key] ?? defaultValues[key];
    });
    reset(values);
  }, [data, reset]);

  const onSubmit = (values) => {
    updateMutation.mutate({
      ...values,
      website: values.website || "",
      heard_from: values.heard_from || [],
    });
  };

  if (isLoading) return <Loader />;
  if (isError) return <ErrorMessage error={error} />;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Company Information */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold">Company Information</h3>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <TextField name="company_name" label="Company Name" required />
            <TextField name="country" label="Country" required />
            <TextField name="city_region" label="City / Region" required />
            <TextField name="website" label="Company Website" />
          </div>

          <div className="grid gap-4">
            <CheckboxGroup
              name="business_type"
              otherName="business_type_other"
              label="Business Type"
              required
              options={options?.business_types}
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold">Contact Information</h3>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <TextField name="contact_person" label="Contact Person" required />
            <TextField name="designation" label="Designation" required />
            <TextField name="email" label="Email Address" required />
            <TextField
              name="mobile"
              label="WhatsApp / Mobile Number"
              required
            />
          </div>
        </div>

        {/* Business Information */}
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold">Business Information</h3>

          <div className="grid gap-6">
            <CheckboxGroup
              name="products_of_interest"
              otherName="products_other"
              label="Products of Interest"
              required
              options={options?.products_of_interest}
            />

            <div className="space-y-2">
              <Label htmlFor="about_company">
                About the company and its business activities
                <span className="text-red-500"> *</span>
              </Label>
              <Textarea
                id="about_company"
                {...register("about_company")}
                rows={5}
                className={cn({ "border-red-500": errors.about_company })}
              />
              <FieldError error={errors.about_company} />
            </div>

            <CheckboxGroup
              name="heard_from"
              otherName="heard_from_other"
              label="How did you hear about us?"
              options={options?.heard_from}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            type="submit"
            disabled={updateMutation.isPending}
            className="w-full sm:w-auto"
          >
            {updateMutation.isPending && (
              <LoaderCircleIcon className="animate-spin" size={16} />
            )}
            Update
          </Button>

          <Button variant="outline" asChild>
            <Link href={`/distributor-enquiries/${id}`}>Cancel</Link>
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
