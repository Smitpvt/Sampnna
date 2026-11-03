import clsx from "clsx";

type Props = {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  className?: string;
  children: (a11y: { id: string; "aria-invalid": boolean; "aria-describedby"?: string }) => React.ReactNode;
};

/** Label + control + hint/error, wired up for screen readers. */
export function Field({ id, label, error, hint, optional, className, children }: Props) {
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;
  return (
    <div className={clsx("flex flex-col justify-end", className)}>
      <label htmlFor={id} className="eyebrow text-[0.6rem] sm:text-[0.66rem] opacity-80 leading-none">
        {label}
        {optional && <span className="ml-1 sm:ml-2 normal-case tracking-normal opacity-70">(optional)</span>}
      </label>
      {children({ id, "aria-invalid": Boolean(error), "aria-describedby": describedBy })}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-0.5 sm:mt-2 text-[0.68rem] sm:text-xs opacity-70">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-0.5 sm:mt-2 text-[0.72rem] sm:text-sm font-medium text-[#b3311d] [.on-dark_&]:text-[#ffb4a2]">
          {error}
        </p>
      )}
    </div>
  );
}

/** Off-screen honeypot. Real visitors never see or fill it. */
export function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label htmlFor="website">Leave this field empty</label>
      <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
