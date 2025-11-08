import "../globals.css";
import Navbar from "../../components/navbar";
import Container from "../../components/container";
import { contextProvider as ContextProvider } from "../../context/context";
import { Spinner } from "@/components/loader";
import { cookies } from "next/headers";
import { getAdminFromToken } from "../../lib/auth";
import type { TokenPayloadT, Permission } from "../../lib/types";
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
  const cookieStore = await cookies();
  const token = cookieStore.get("egov_token")?.value || null;
  const admin = token ? await getAdminFromToken(token) : null;
  const tokenAdmin = admin as unknown as TokenPayloadT | null;
  const initialUser = tokenAdmin
    ? {
        id: String(tokenAdmin.id ?? ""),
        name: String(tokenAdmin.name ?? tokenAdmin.email ?? ""),
        role: (tokenAdmin.role as string) || "Admin",
        permissions: Array.isArray(tokenAdmin.permissions)
          ? (tokenAdmin.permissions as unknown as Permission[])
          : [],
      }
    : null;

  return (
    <html lang="en">
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
