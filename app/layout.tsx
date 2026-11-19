import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { AppShell } from "@/components/lite/app-shell";
import { StudioProvider } from "@/components/lite/studio-provider";
import { studio } from "@/data/studio";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: studio.name, template: `%s · ${studio.name}` },
  description: "A free music mixing dashboard built with Thock UI.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <StudioProvider>
            <AppShell>{children}</AppShell>
          </StudioProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
