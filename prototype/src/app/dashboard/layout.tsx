"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Sparkles,
  Clock,
  Settings,
  Bell,
  X,
  Zap,
} from "lucide-react";
import { mockNotifications } from "@/lib/mock-data";

const navItems = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/dashboard/insights", icon: Sparkles, label: "Insights" },
  { href: "/dashboard/journey", icon: Clock, label: "Journey" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [showBanner, setShowBanner] = useState(
    mockNotifications && mockNotifications.length > 0
  );

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-spark-neutral-50">
      {/* ─── Desktop Layout (lg+): Sidebar + Content ─── */}
      <div className="hidden lg:flex min-h-screen">
        {/* Sidebar */}
        <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-spark-neutral-100 flex flex-col z-30">
          {/* Logo / Brand */}
          <div className="px-6 py-6 border-b border-spark-neutral-100">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-spark-primary-500 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-heading text-xl font-bold text-spark-neutral-900">
                Spark
              </span>
            </Link>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {navItems.map(({ href, icon: Icon, label }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? "bg-spark-primary-50 text-spark-primary-600"
                      : "text-spark-neutral-500 hover:bg-spark-neutral-50 hover:text-spark-neutral-700"
                  }`}
                >
                  <Icon
                    className="w-5 h-5"
                    strokeWidth={active ? 2.5 : 2}
                  />
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="px-4 py-4 border-t border-spark-neutral-100">
            <div className="flex items-center gap-3 px-2">
              <div className="w-8 h-8 rounded-full bg-spark-primary-100 flex items-center justify-center">
                <span className="text-sm font-semibold text-spark-primary-600">
                  A
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-spark-neutral-800 truncate">
                  Alex Johnson
                </p>
                <p className="text-xs text-spark-neutral-400 truncate">
                  alex.johnson@example.com
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 ml-64">
          {/* Desktop Notification Banner */}
          {showBanner && mockNotifications && mockNotifications.length > 0 && (
            <div className="bg-spark-primary-100 px-6 py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Bell className="w-4 h-4 text-spark-primary-600 shrink-0" />
                <p className="text-sm text-spark-primary-800 truncate">
                  {mockNotifications[0].message || "You have new notifications"}
                </p>
              </div>
              <button
                onClick={() => setShowBanner(false)}
                className="shrink-0 p-1 rounded-full hover:bg-spark-primary-200 transition-colors"
                aria-label="Dismiss notification"
              >
                <X className="w-4 h-4 text-spark-primary-600" />
              </button>
            </div>
          )}

          <main className="min-h-screen">{children}</main>
        </div>
      </div>

      {/* ─── Mobile Layout (<lg): Bottom Nav ─── */}
      <div className="lg:hidden flex justify-center min-h-screen">
        <div className="w-full max-w-[428px] relative flex flex-col min-h-screen">
          {/* Notification Banner */}
          {showBanner && mockNotifications && mockNotifications.length > 0 && (
            <div className="bg-spark-primary-100 px-4 py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Bell className="w-4 h-4 text-spark-primary-600 shrink-0" />
                <p className="text-sm text-spark-primary-800 truncate">
                  {mockNotifications[0].message ||
                    "You have new notifications"}
                </p>
              </div>
              <button
                onClick={() => setShowBanner(false)}
                className="shrink-0 p-1 rounded-full hover:bg-spark-primary-200 transition-colors"
                aria-label="Dismiss notification"
              >
                <X className="w-4 h-4 text-spark-primary-600" />
              </button>
            </div>
          )}

          {/* Scrollable Content Area */}
          <main className="flex-1 overflow-y-auto pb-[56px]">{children}</main>

          {/* Bottom Navigation Bar */}
          <nav
            className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[428px] bg-white shadow-spark-low border-t border-spark-neutral-100"
            style={{ height: 56 }}
          >
            <div className="flex items-center justify-around h-full px-2">
              {navItems.map(({ href, icon: Icon, label }) => {
                const active = isActive(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${
                      active
                        ? "text-spark-primary-500"
                        : "text-spark-neutral-400 hover:text-spark-neutral-600"
                    }`}
                  >
                    <Icon
                      className="w-5 h-5"
                      strokeWidth={active ? 2.5 : 2}
                    />
                    <span
                      className={`text-[10px] leading-tight ${
                        active ? "font-semibold" : "font-medium"
                      }`}
                    >
                      {label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}
