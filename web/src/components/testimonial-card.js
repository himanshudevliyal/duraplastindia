import { Star, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

export function GoogleMark({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fill="#4285F4"
        d="M23.5 12.27c0-.82-.07-1.64-.22-2.42H12v4.59h6.47a5.6 5.6 0 0 1-2.4 3.66v3h3.87c2.27-2.1 3.56-5.2 3.56-8.83Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.06 7.94-2.9l-3.87-3c-1.08.73-2.47 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.1A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29a7.2 7.2 0 0 1 0-4.58v-3.1H1.27a12 12 0 0 0 0 10.78l4-3.1Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.76 0 3.34.6 4.58 1.79l3.43-3.43C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.27 6.61l4 3.1C6.22 6.86 8.87 4.75 12 4.75Z"
      />
    </svg>
  );
}

export function StarRow({ rating }) {
  return <div className="flex items-center gap-1" aria-hidden></div>;
}

export default function TestimonialCard({ item }) {
  return (
    <div className="flex h-full flex-col gap-5 rounded-[20px] bg-gray-100 p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-muted">
            <UserRound className="h-5 w-5 text-primary" strokeWidth={1.5} />
          </div>
          <div>
            <p className="font-display text-lg    text-foreground">
              {item.name}
            </p>
            <p className="text-md text-muted-foreground">{item.date}</p>
          </div>
        </div>
        <GoogleMark className="h-6 w-6 shrink-0" />
      </div>

      <StarRow rating={item.rating} />

      <p className="text-sm leading-relaxed text-muted-foreground">
        &ldquo;{item.quote}&rdquo;
      </p>
    </div>
  );
}
