import type { Metadata } from "next";
import { Inter, Poppins, Fira_Code } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/app/context/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
  display: "swap",
});

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
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      </head>
      <body
        className={`${inter.variable} ${poppins.variable} ${firaCode.variable} font-sans antialiased`}
      >
        <ThemeProvider defaultTheme="light">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
