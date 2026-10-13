"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import moment from "moment";

function Row({ label, children }) {
  if (children === null || children === undefined || children === "")
    return null;

  return (
    <div className="grid grid-cols-3 gap-3 py-1.5 text-sm">
      <div className="text-muted-foreground">{label}</div>
      <div className="col-span-2 break-words whitespace-pre-wrap">
        {children}
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h4 className="mb-1 text-sm font-semibold">{title}</h4>
      <div className="divide-y">{children}</div>
    </div>
  );
}

// list of options + optional "Other" text
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

export default function ViewDialog({ record, onClose }) {
  return (
    <Dialog open={!!record} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        {record && (
          <>
            <DialogHeader>
              <DialogTitle>{record.company_name}</DialogTitle>
              <DialogDescription>
                Submitted{" "}
                {moment(record.created_at).format("DD/MM/YYYY, hh:mm A")}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5">
              <Section title="Company Information">
                <Row label="Country">{record.country}</Row>
                <Row label="City / Region">{record.city_region}</Row>
                <Row label="Website">
                  {record.website && (
                    <a
                      href={
                        /^https?:\/\//i.test(record.website)
                          ? record.website
                          : `https://${record.website}`
                      }
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
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
