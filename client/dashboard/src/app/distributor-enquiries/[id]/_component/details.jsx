"use client";

import moment from "moment";

import Loader from "@/components/loader";
import ErrorMessage from "@/components/ui/error";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDistributorEnquiry } from "@/hooks/use-distributor-enquiries";

function Row({ label, children }) {
  if (children === null || children === undefined || children === "")
    return null;

  return (
    <div className="grid gap-1 py-2.5 text-sm sm:grid-cols-3 sm:gap-4">
      <div className="text-muted-foreground">{label}</div>
      <div className="break-words whitespace-pre-wrap sm:col-span-2">
        {children}
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="divide-y">{children}</CardContent>
    </Card>
  );
}

// list of options (+ "Other" text when given)
function Options({ items, other }) {
  if (!items?.length) return null;

  return (
    <div className="flex flex-wrap gap-1">
      {items.map((item) => (
        <Badge key={item} variant="secondary">
          {item === "Other" && other ? `Other: ${other}` : item}
        </Badge>
      ))}
    </div>
  );
}

export default function Details({ id }) {
  const { data: record, isLoading, isError, error } = useDistributorEnquiry(id);

  if (isLoading) return <Loader />;
  if (isError) return <ErrorMessage error={error} />;
  if (!record) return null;

  const websiteHref = record.website
    ? /^https?:\/\//i.test(record.website)
      ? record.website
      : `https://${record.website}`
    : null;

  return (
    <div className="mt-4 grid gap-4 lg:grid-cols-2">
      <div className="space-y-4">
        <Section title="Company Information">
          <Row label="Company Name">{record.company_name}</Row>
          <Row label="Country">{record.country}</Row>
          <Row label="City / Region">{record.city_region}</Row>
          <Row label="Website">
            {websiteHref && (
              <a
                href={websiteHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                {record.website}
              </a>
            )}
          </Row>
          <Row label="Business Type">
            <Options
              items={record.business_type}
              other={record.business_type_other}
            />
          </Row>
        </Section>

        <Section title="Contact Information">
          <Row label="Contact Person">{record.contact_person}</Row>
          <Row label="Designation">{record.designation}</Row>
          <Row label="Email">
            <a href={`mailto:${record.email}`} className="underline">
              {record.email}
            </a>
          </Row>
          <Row label="WhatsApp / Mobile">{record.mobile}</Row>
        </Section>
      </div>

      <div className="space-y-4">
        <Section title="Business Information">
          <Row label="Products of Interest">
            <Options
              items={record.products_of_interest}
              other={record.products_other}
            />
          </Row>
          <Row label="About Company">{record.about_company}</Row>
          <Row label="Heard About Us">
            <Options
              items={record.heard_from}
              other={record.heard_from_other}
            />
          </Row>
        </Section>

        <Section title="Submission">
          <Row label="Submitted On">
            {moment(record.created_at).format("DD/MM/YYYY, hh:mm A")}
          </Row>
          <Row label="Last Updated">
            {moment(record.updated_at).format("DD/MM/YYYY, hh:mm A")}
          </Row>
        </Section>
      </div>
    </div>
  );
}
