import "../globals.css";
import Navbar from "../../components/navbar";
import Container from "../../components/container";
import { contextProvider as ContextProvider } from "../../context/context";

export const metadata = {
  title: "E-Governance Whistleblower",
  description: "Anonymous reporting platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 min-h-screen global-css-test">
        <ContextProvider>
          <Navbar />
          <main className="py-8">
            <Container>{children}</Container>
          </main>
        </ContextProvider>
      </body>
    </html>
  );
}
