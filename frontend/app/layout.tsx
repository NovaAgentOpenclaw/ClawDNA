import type { Metadata } from "next"
import { Space_Grotesk, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import { DynamicWalletProvider } from "@/components/wallet/DynamicWallet"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  weight: ["400", "500", "600", "700"],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "ClawDNA | Evolve. Breed. Conquer.",
  description: "AI agent evolution platform powered by genetic algorithms, breeding mechanics, and fitness optimization on Solana blockchain.",
  keywords: ["AI", "agents", "genetic algorithms", "Solana", "NFT", "breeding", "evolution"],
  authors: [{ name: "ClawDNA" }],
  openGraph: {
    title: "ClawDNA | Digital Evolution",
    description: "Breed AI agents. Optimize DNA. Build the ultimate intelligence through genetic algorithms on-chain.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} font-body bg-void text-foreground antialiased`}
      >
        <DynamicWalletProvider>
          {children}
        </DynamicWalletProvider>
      </body>
    </html>
  )
}
