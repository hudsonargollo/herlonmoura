export default function Home(): JSX.Element {
  return (
    <main className="min-h-screen bg-dark-elevated">
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <h1 className="mb-4 text-display-lg text-neutral-light">
            Dr. Herlon Moura
          </h1>
          <p className="mb-8 text-body-lg text-neutral-medium">
            Especialista em Angiologia e Cirurgia Vascular
          </p>
          <button className="rounded-lg bg-surgical-teal px-8 py-3 font-semibold text-dark-elevated transition-all duration-300 hover:bg-surgical-teal-dark">
            Agendar Consulta
          </button>
        </div>
      </div>
    </main>
  );
}
