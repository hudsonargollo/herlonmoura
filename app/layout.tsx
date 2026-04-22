import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dr. Herlon Moura - Especialista em Angiologia e Cirurgia Vascular",
  description:
    "Consulte com Dr. Herlon Moura, especialista em angiologia e cirurgia vascular em Salvador, Bahia. Tratamento de varizes, trombose venosa profunda e doenças vasculares.",
  keywords: [
    "angiologista Salvador",
    "cirurgia vascular",
    "varizes",
    "trombose venosa profunda",
    "especialista vascular",
  ],
  openGraph: {
    title: "Dr. Herlon Moura - Especialista em Angiologia e Cirurgia Vascular",
    description:
      "Consulte com Dr. Herlon Moura, especialista em angiologia e cirurgia vascular em Salvador, Bahia.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      </head>
      <body className="bg-dark-elevated text-neutral-light">{children}</body>
    </html>
  );
}
