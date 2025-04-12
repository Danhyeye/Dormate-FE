import AdminDashboardClient from "./AdminDashboardClient";
import AdminDashboardSkeleton from "./LoadingState";
import { Suspense } from "react";

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<AdminDashboardSkeleton />}>
      <AdminDashboardClient />
    </Suspense>
  );
}

