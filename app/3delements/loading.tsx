export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--s-color-bg-canvas)]">
      <div className="text-center">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-solid border-[var(--s-color-action-primary)] border-t-transparent" />
        <p className="text-body-lg" style={{ color: 'var(--s-color-content-body)' }}>
          Carregando...
        </p>
      </div>
    </div>
  );
}