import { cn } from "@/lib/utils";

// ponytail: efferd's footer just needs a horizontal hairline; a bordered div covers it.
export function FullWidthDivider({
  position,
  className,
}: {
  position?: "top" | "bottom";
  className?: string;
}) {
  return (
    <div
      role="separator"
      className={cn("h-px w-full bg-border", position === "top" && "mb-2", className)}
    />
  );
}
