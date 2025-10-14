import "../../app/globals.css";
import Container from "../../components/container";
import { cookies } from "next/headers";
import { verifyToken } from "../../lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const c = await cookies();
  const token = c.get("egov_token")?.value;
  const payload = token ? verifyToken(token) : null;
  const role = (payload as any)?.role;
  if (!payload || (role !== "Admin" && role !== "SuperAdmin")) {
    // redirect("/admin/login");
  }

  return (
    <main className="py-8">
      <Container>{children}</Container>
    </main>
  );
}
