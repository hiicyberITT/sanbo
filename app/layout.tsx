import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { LiveChatWidget } from "@/components/support/live-chat-widget"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BTC Exchange Pro - Professional Bitcoin Trading Platform",
  description: "Advanced Bitcoin trading platform with real-time charts, order book, and professional trading tools",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <LiveChatWidget />
        </ThemeProvider>
      </body>
    </html>
  )
}
