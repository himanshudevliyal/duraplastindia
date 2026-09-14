import Heading from "@/components/layout/heading";
import { Section } from "@/components/layout/section";
import Image from "next/image";

const technologies = [
  {
    title: "RHINO SOLAR HEAT SHIELD",
    image: "/img/rhino-solar-het-shild.png",
    description:
      "Low haze colors that provide a fair amount of light while limiting solar heat transmission.",
  },
  {
    title: "RHINO SOLAR HEAT BLOCK",
    image: "/img/shino-solar-headt-block.png",
    description:
      "Colors that provide a limited amount of light while completely blocking solar heat for cool building interiors.",
  },
  {
    title: "RHINO SOFT SPREAD",
    image: "/img/rino-soft-spread.png",
    description:
      "Diffuser colors that uniformly and evenly spread soft light over a large floor surface.",
  },
  {
    title: "RHINO LEAK STOP",
    image: "/img/rhino-leak-stop.png",
    description:
      "Polycarbonate sheets with condensation control properties to avoid problems of condensation and leakages in greenhouses and gardens.",
  },
  {
    title: "RHINO TUF GUARD",
    image: "/img/rhino-tuf-guard.png",
    description:
      "Polycarbonate sheets with abrasion resistant coatings to resist scratches and marks.",
  },
];

export default function OurTechnologies() {
  return (
    <Section className="w-full bg-slate-50 ">
        {/* Header */}



 <Heading
       
        heading="Our Technologies"
        subheading=" Innovative polycarbonate technologies designed to improve
            performance, durability, comfort and natural light management."
        className="mx-auto max-w-4xl"
        eyebrowClassName="justify-center"
        subheadingClassName="mx-auto mt-5 mb-14 max-w-3xl"
      />




        {/* Technology Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {technologies.map((tech) => (
            <div
              key={tech.id}
              className="text-center"
              
            >
              {/* Image */}
                <Image
                  src={tech.image}
                  alt={tech.title}
                  width={500}
                  height={500}
                  className=" mb-6 w-full object-contain transition-transform duration-300 group-hover:scale-105"
                />

              {/* Content */}
              <div className=" flex flex-1 flex-col">
              

                <p className="text-sm leading-6 text-slate-500">
                  {tech.description}
                </p>
              </div>

                    </div>
          ))}
        </div>
    </Section>
  );
}