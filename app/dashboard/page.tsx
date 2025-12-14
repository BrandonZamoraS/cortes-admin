"use client";

import { BundleDashboard } from "@/components/bundle-dashboard";
import { Navbar } from "@/components/navbar";

export default function DashboardPage() {
  return (
    <div className="flex h-full flex-col text-[var(--primary-dark)]">
      <Navbar activePage="dashboard" />

      {/* Contenido */}
      <main className="flex-1 overflow-hidden bg-[var(--primary-soft)]/60">
        <BundleDashboard />
      </main>
    </div>
  );
}
