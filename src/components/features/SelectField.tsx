import { ChevronDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Option } from "@/types/attendance";

interface SelectFieldProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder: string;
  disabled?: boolean;
  loading?: boolean;
  invalid?: boolean;
}

export default function SelectField({
  id,
  value,
  onChange,
  options,
  placeholder,
  disabled,
  loading,
  invalid,
}: SelectFieldProps) {
  const isDisabled = disabled || loading;
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        disabled={isDisabled}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "w-full appearance-none rounded-xl border bg-card px-4 pr-10 py-3 text-base sm:text-sm text-foreground",
          "field-focus min-h-[48px]",
          "disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed",
          invalid ? "border-destructive/60" : "border-input hover:border-brand-teal/50",
        )}
      >
        <option value="">{loading ? "Loading options…" : placeholder}</option>
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin text-brand-teal" />
        ) : (
          <ChevronDown className={cn("h-4 w-4 transition-colors", !isDisabled && "text-brand-teal")} />
        )}
      </div>
    </div>
  );
}
