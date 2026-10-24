"use client";

import moment from "moment";

import Loader from "@/components/loader";
import ErrorMessage from "@/components/ui/error";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEnquiry } from "@/hooks/use-enquiries";

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

export default function Details({ id }) {
  const { data: record, isLoading, isError, error } = useEnquiry(id);

  if (isLoading) return <Loader />;
  if (isError) return <ErrorMessage error={error} />;
  if (!record) return null;

  return (
    <div className="mt-4 grid gap-4 lg:grid-cols-2">
      <div className="space-y-4">
        <Section title="Contact Information">
          <Row label="Name">{record.name}</Row>
          <Row label="Email">
            {record.email && (
              <a href={`mailto:${record.email}`} className="underline">
                {record.email}
              </a>
            )}
          </Row>
          <Row label="Phone">
            {record.phone && (
              <a href={`tel:${record.phone}`} className="underline">
                {record.phone}
              </a>
            )}
          </Row>
          <Row label="Company">{record.company}</Row>
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

      <div className="space-y-4">
        <Section title="Enquiry">
          <Row label="Subject">{record.subject}</Row>
          <Row label="Message">{record.message}</Row>
        </Section>
      </div>
    </div>
  );
}
