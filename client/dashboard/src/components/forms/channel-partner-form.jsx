"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircleIcon, XIcon } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import z from "zod";

import FileUpload from "@/components/file-uploader";
import Loader from "../loader";
import ErrorMessage from "../ui/error";
import config from "@/config";

import {
  useChannelPartner,
  useCreateChannelPartner,
  useUpdateChannelPartner,
} from "@/hooks/channel-partner";

const defaultValues = {
  country: "",
  iso: "",
  region: "",
  company: "",
  address: [],
  contact_person: "",
  mobile: "",
  email: "",
  website: "",
  logo: [],
  description: "",
  map_iframe: "",
};

export const schema = z.object({
  country: z.string().min(1, "Country is required"),
  iso: z.string().optional(),
  region: z.string().optional(),
  company: z.string().min(1, "Company is required"),
  address: z.any().optional(),
  contact_person: z.string().optional(),
  mobile: z.string().optional(),
  email: z.string().optional(),
  website: z.string().optional(),
  logo: z.any().optional(),
  description: z.string().optional(),
  map_iframe: z.string().optional(),
});

export default function ChannelPartnerForm({ id, type }) {
  const router = useRouter();

  const [file, setFile] = useState(null);
  const [logoUrl, setLogoUrl] = useState("");

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

  const createMutation = useCreateChannelPartner(() => {
    reset();
    router.push("/channel-partners?page=1&limit=10");
    toast.success("Created.");
  });

  const updateMutation = useUpdateChannelPartner(id, () => {
    reset();
    router.back();
    toast.success("Updated.");
  });

  const { data, isLoading, isError, error } = useChannelPartner(id);

  useEffect(() => {
    if (type === "edit" && data) {
      reset(data);

      if (data.logo?.length) {
        setLogoUrl(data.logo[0]);
      }
    }
  }, [data, type, reset]);

  const handleLogoChange = useCallback((files) => {
    setFile(files?.[0] ?? null);
  }, []);

  const onSubmit = (data) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key === "logo") return;

      if (typeof value === "object") {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value ?? "");
      }
    });

    if (file) {
      formData.append("logo", file);
    }

    if (type === "edit") {
      formData.append("logo", JSON.stringify(logoUrl ? [logoUrl] : []));

      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const isPending =
    (type === "create" && createMutation.isPending) ||
    (type === "edit" && updateMutation.isPending);

  if (type === "edit" && isLoading) {
    return <Loader />;
  }

  if (type === "edit" && isError) {
    return <ErrorMessage error={error} />;
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-3 gap-4">
          {/* Logo */}
          <div className="col-span-full space-y-3">
            <Label>Logo</Label>

            <FileUpload
              onFileChange={handleLogoChange}
              inputName="logo"
              multiple={false}
              maxFiles={1}
            />

            {logoUrl && (
              <div className="relative size-28">
                <Image
                  src={`${config.file_base}/${logoUrl}`}
                  width={200}
                  height={200}
                  alt="logo"
                  className="size-full rounded object-cover"
                  unoptimized
                />

                <Button
                  type="button"
                  size="icon"
                  className="absolute -top-2 -right-2 size-6 rounded-full"
                  onClick={() => setLogoUrl("")}
                >
                  <XIcon size={14} />
                </Button>
              </div>
            )}
          </div>

          {/* Company */}
          <div className="space-y-2">
            <Label>Company</Label>

            <Input
              {...register("company")}
              placeholder="Enter company"
              className={cn({
                "border-red-500": errors.company,
              })}
            />

            {errors.company && (
              <p className="text-xs text-red-500">{errors.company.message}</p>
            )}
          </div>

          {/* Country */}
          <div className="space-y-2">
            <Label>Country</Label>

            <Input {...register("country")} placeholder="Enter country" />
          </div>

          {/* ISO */}
          <div className="space-y-2">
            <Label>ISO</Label>

            <Input {...register("iso")} placeholder="ISO code" />
          </div>

          {/* Region */}
          <div className="space-y-2">
            <Label>Region</Label>

            <Input {...register("region")} placeholder="Enter region" />
          </div>

          {/* Contact Person */}
          <div className="space-y-2">
            <Label>Contact Person</Label>

            <Input
              {...register("contact_person")}
              placeholder="Contact person"
            />
          </div>

          {/* Mobile */}
          <div className="space-y-2">
            <Label>Mobile</Label>

            <Input {...register("mobile")} placeholder="Mobile number" />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label>Email</Label>

            <Input {...register("email")} placeholder="Email" />
          </div>

          {/* Website */}
          <div className="space-y-2">
            <Label>Website</Label>

            <Input {...register("website")} placeholder="Website" />
          </div>

          {/* Address */}
          <div className="col-span-full space-y-2">
            <Label>Address</Label>

            <Textarea {...register("address")} placeholder="Enter address" />
          </div>

          {/* Map Iframe */}
          <div className="col-span-full space-y-2">
            <Label>Google Map Iframe</Label>

            <Textarea
              {...register("map_iframe")}
              placeholder='<iframe src="https://www.google.com/maps/embed?..."></iframe>'
              rows={6}
            />
          </div>

          {/* Description */}
          <div className="col-span-full space-y-2">
            <Label>Description</Label>

            <Textarea
              {...register("description")}
              placeholder="Enter description"
            />
          </div>
        </div>

        <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
          {isPending && <LoaderCircleIcon className="animate-spin" size={16} />}
          Submit
        </Button>
      </form>
    </FormProvider>
  );
}
