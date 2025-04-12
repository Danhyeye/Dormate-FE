import AdminDashboardClient from "./AdminDashboardClient";
import { Suspense } from "react";
import AdminDashboardSkeleton from "./LoadingState";

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<AdminDashboardSkeleton />}>
      <AdminDashboardClient />
    </Suspense>
  );
}

