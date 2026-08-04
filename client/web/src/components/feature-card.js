import Image from "next/image";

export default function FeatureCard({ item }) {
  return (
    <div className="flex flex-col gap-6 rounded-[20px]  bg-gray-100 p-8">
      <div className="flex   rounded-lg ">
        <Image
          width={100}
          height={100}
          className=""
          alt={item.title}
          src={item.img}
        ></Image>
      </div>

      <div>
        <h3 className="font-display text-xl font-bold text-foreground">
          {item.title}
        </h3>

        <p className="mt-2 max-w-[28ch] text-sm leading-relaxed text-muted-foreground">
          {item.description}
        </p>
      </div>
    </div>
  );
}
