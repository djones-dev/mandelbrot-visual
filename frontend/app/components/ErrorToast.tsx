interface ErrorToastProps {
  error: string | null;
  onDismiss: () => void;
}

export function ErrorToast({ error, onDismiss }: ErrorToastProps) {
  if (!error) return null;

  return (
    <div className="absolute top-6 left-6 bg-red-500 text-white px-4 py-3 rounded-lg shadow-xl max-w-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-semibold">Error</div>
          <div className="text-sm">{error}</div>
        </div>
        <button
          onClick={onDismiss}
          className="text-white hover:text-red-100 font-bold"
        >
          ×
        </button>
      </div>
    </div>
  );
}
