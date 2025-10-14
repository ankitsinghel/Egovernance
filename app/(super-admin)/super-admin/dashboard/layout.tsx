import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";
// import { verifyToken } from "../../../lib/auth";
import { redirect } from "next/navigation";
export const metadata = {
  title: "E-Governance Whistleblower",
  description: "Anonymous reporting platform",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
   const c = await cookies();
    const token = c.get("egov_token")?.value;
    const payload = token ? verifyToken(token) : null;
    if (!payload || (payload as any).role !== "SuperAdmin") {
      redirect("/super-admin/login");
    }
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 min-h-screen global-css-test">
        <main className="py-8">{children}</main>
      </body>
    </html>
  );
}
