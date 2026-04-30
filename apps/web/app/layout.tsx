import "./globals.css";
import { Navbar } from "@/components/shared/Navbar";

export const metadata = {
  title: "Codebase Live AI",
  description: "AI-powered live interview screening platform"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
