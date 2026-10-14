import type { Metadata } from "next";
import { Inter, Poppins, Fira_Code, Geist, Montserrat } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });

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

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
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

const themeInitScript = `
(function() {
  try {
    var stored = localStorage.getItem('herlonmoura-theme');
    var theme = (stored === 'light' || stored === 'dark') ? stored : 'light';
    var root = document.documentElement;
    root.removeAttribute('data-theme');
    root.classList.remove('light', 'dark');
    root.setAttribute('data-theme', theme);
    root.classList.add(theme);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'light');
    document.documentElement.classList.add('light');
  }
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode {
  return (
    <html lang="pt-BR" className={cn("light", "font-sans", geist.variable)} data-theme="light" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        className={`${inter.variable} ${poppins.variable} ${montserrat.variable} ${firaCode.variable} ${geist.variable} bg-surface font-sans text-primary`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
