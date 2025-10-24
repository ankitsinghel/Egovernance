import "../globals.css";
import Navbar from "../../components/navbar";
import Container from "../../components/container";
import { contextProvider as ContextProvider } from "../../context/context";
import { Spinner } from "@/components/loader";
import { cookies } from "next/headers";
import { getAdminFromToken } from "../../lib/auth";

export const metadata = {
  title: "E-Governance Whistleblower",
  description: "Anonymous reporting platform",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Read httpOnly cookie on the server and hydrate initial user for the client provider
  const cookieStore = await cookies();
  const token = cookieStore.get("egov_token")?.value || null;
  const admin = token ? await getAdminFromToken(token) : null;
  const initialUser = admin
    ? {
        id: String((admin as any).id),
        name: (admin as any).name || (admin as any).email || "",
        role: (admin as any).role || "Admin",
      }
    : null;

  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 min-h-screen global-css-test">
        <ContextProvider initialUser={initialUser}>
          <Spinner />
          <Navbar />
          <main className="py-8">
            <Container>{children}</Container>
          </main>
        </ContextProvider>
      </body>
    </html>
  );
}
