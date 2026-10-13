import DistributorForm from "@/components/form/distributor-form";
import { Section } from "@/components/layout/section";
import { BreadcrumbBanner } from "@/components/ui/breadcrumb";

export const metadata = {
  title: "Become a Distributor | Dura Plast India",
  description:
    "Partner with Dura Plast India as a distributor, importer or dealer for skylighting, roofing, polycarbonate and natural ventilation products.",
};

export default function BecomeADistributorPage() {
  return (
    <>
      <BreadcrumbBanner
        title="BECOME A DISTRIBUTOR"
        backgroundImage="/img/become-a-distributor.jpg"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Become a Distributor" },
        ]}
      />

      <Section>
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-2xl font-semibold">
           BECOME A RHINO TUFF INTERNATIONAL DISTRIBUTOR
          </h2>

          <p className="mx-auto mt-3 max-w-7xl text-center text-[15px] leading-7 text-muted-foreground">
           We are looking for business partners worldwide to promote our RHINO TUFF <b> Roofing, Skylighting & Natural Ventilation Solutions. </b>
          </p>
          <p>If you are interested, please fill-up and send us the Form given below and we shall get back to you!</p>

          <div className="mt-10">
          <div className=" bg-white p-5 rounded-lg shadow-md">
            <DistributorForm />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
