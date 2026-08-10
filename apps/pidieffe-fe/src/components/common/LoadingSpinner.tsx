export function LoadingSpinner({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 p-8">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-neutral-300 border-t-coral" />
      {message && <p className="text-sm text-neutral-600">{message}</p>}
    </div>
  );
}
