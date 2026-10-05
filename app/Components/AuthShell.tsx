import Image from "next/image";
import type { InputHTMLAttributes, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import BackgroundCircles from "@/app/Components/BackgroundCircles";

const ring =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2563EB]";

export const linkClass = `font-semibold text-[#2563EB] hover:underline ${ring}`;
export const buttonClass = `h-14 w-full cursor-pointer rounded-2xl bg-[#2563EB] text-base font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 ${ring}`;

export function AuthShell({
  title,
  subtitle,
  footer,
  children,
}: {
  title: string;
  subtitle: string;
  footer: ReactNode;
  children: ReactNode;
}) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F8F8F8] px-6 py-10 font-sans">
      <BackgroundCircles />
      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg">
            <Image src="/robot.png" width={56} height={56} alt="" priority className="object-contain" />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
          <h1 className="text-center text-2xl font-bold text-[#1E293B]">{title}</h1>
          <p className="mt-2 text-center text-sm text-[#64748B]">{subtitle}</p>
          {children}
        </div>

        <p className="mt-6 text-center text-sm text-[#64748B] sm:text-base">{footer}</p>
      </div>
    </main>
  );
}

export function AuthField({
  id,
  label,
  icon: Icon,
  ...props
}: { id: string; label: string; icon: LucideIcon } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-600">
        {label}
      </label>
      <div className="flex h-14 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 transition focus-within:border-[#2563EB] focus-within:ring-2 focus-within:ring-[#2563EB]/30">
        <Icon size={16} aria-hidden className="shrink-0 text-slate-400" />
        <input id={id} className="w-full bg-transparent text-sm text-slate-900 outline-none" {...props} />
      </div>
    </div>
  );
}

export function FormError({ message, children }: { message: string; children?: ReactNode }) {
  return (
    <p role="alert" className="text-sm text-red-600">
      {message} {children}
    </p>
  );
}