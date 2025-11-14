import "../globals.css";
import Navbar from "../../components/navbar";
import Container from "../../components/container";
import { contextProvider as ContextProvider } from "../../context/context";
import { Spinner } from "@/components/loader";
import { getUserFromCookie } from "../../lib/auth";
import { Toaster } from "sonner";
import Footer from "../../components/footer";
import { getMasters } from "@/lib/getMasters/getMasters";

export const metadata = {
  title: "Satark",
  description: "Anonymous reporting platform",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { departments, states } = await getMasters();
  const initialUser = await getUserFromCookie();

  return (
    <html lang="en" className="light" style={{ colorScheme: "light" }}>
      <body className="bg-gray-50 text-gray-900 min-h-screen global-css-test">
        <ContextProvider
          initialUser={initialUser}
          initialDepartments={departments}
          initialStates={states}
        >
          <Toaster />
          <Spinner />
          <Navbar />
          <main className="py-8">
            <Container>{children}</Container>
          </main>
          <Footer />
        </ContextProvider>
      </body>
    </html>
  );
}
