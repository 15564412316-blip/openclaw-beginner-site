import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "OpenClaw 新手安全上手站",
  description:
    "一个面向零基础用户的互动式新手引导网站，帮助用户理解、安装、配置并首次使用 OpenClaw / skills",
  keywords: ["OpenClaw", "skills", "AI", "新手指南", "安装教程"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="dark">
      <body className="font-sans antialiased bg-background text-foreground min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
