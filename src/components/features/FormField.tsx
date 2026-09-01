import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export default function FormField({
  label,
  htmlFor,
  required,
  hint,
  error,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label
        htmlFor={htmlFor}
        className="flex items-center justify-between text-sm font-semibold text-foreground"
      >
        <span className="flex items-center gap-1.5">
          {label}
          {required && <span className="text-brand-orange">*</span>}
        </span>
        {hint && <span className="text-[11px] font-medium text-muted-foreground">{hint}</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs font-medium text-destructive flex items-center gap-1.5 animate-fade-up">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-destructive" />
          {error}
        </p>
      )}
    </div>
  );
}
