const ErrorBoundary = ({
  error,
  reset,
}: {
  error: unknown
  reset: () => void
}) => {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 p-8 text-center"
      role="alert"
    >
      <p className="text-lg font-semibold text-red-400">Something went wrong</p>
      <p className="text-sm text-gray-400">
        {error instanceof Error ? error.message : String(error)}
      </p>
      <button
        className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition-colors"
        onClick={reset}
      >
        Reload
      </button>
    </div>
  )
}

export default ErrorBoundary
