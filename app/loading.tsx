export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8F8F8]">
      <div role="status" aria-live="polite" className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#DBEAFE] border-t-[#2563EB]" />
        <span className="text-sm font-medium text-[#64748B]">Loading...</span>
      </div>
    </main>
  );
}