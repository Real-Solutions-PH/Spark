"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Sparkles, Clock, Settings, Bell, X } from "lucide-react";
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
    <div className="min-h-screen bg-spark-neutral-50 flex justify-center">
      <div className="w-full max-w-[428px] relative flex flex-col min-h-screen">
        {/* Notification Banner */}
        {showBanner && mockNotifications && mockNotifications.length > 0 && (
          <div className="bg-spark-primary-100 px-4 py-3 flex items-center justify-between gap-3">
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
                  <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 2} />
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
  );
}
