import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getAdminSession } from "@/lib/admin-auth";
import AdminShell from "@/components/admin/layout/AdminShell";

export const metadata = {
  title: "لوحة الإدارة — مهرة",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Skip auth check for login page to avoid redirect loop
  const headersList = await headers();
  const currentPath = headersList.get("x-current-path") || "";

  if (currentPath === "/admin/login") {
    return <>{children}</>;
  }

  const admin = await getAdminSession();

  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <AdminShell adminName={admin.full_name || admin.email}>
      {children}
    </AdminShell>
  );
}
