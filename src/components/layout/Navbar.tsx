"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Settings } from "lucide-react";

import { useAppModules } from "@/hooks/useSettings";
import { ALL_MODULES } from "@/lib/modules";

export function Navbar() {
  const pathname = usePathname();
  const { data: selectedModuleIds = [] } = useAppModules();

  const navItems = [
    {
      href: "/",
      label: "الرئيسية",
      icon: Home,
    },

    ...selectedModuleIds
      .map((id) => ALL_MODULES.find((m) => m.id === id))
      .filter((m): m is NonNullable<typeof m> => Boolean(m)),

    {
      href: "/settings",
      label: "الإعدادات",
      icon: Settings,
    },
  ];

  return (
    <nav
      dir="rtl"
      className="fixed bottom-0 inset-x-0 z-40 border-t border-neutral-200 bg-white sm:static sm:border-t-0 sm:border-b overflow-x-auto"
    >
      <div className="mx-auto flex max-w-lg justify-around sm:justify-center sm:gap-8 py-2 min-w-max px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-1 text-xs shrink-0 transition-colors ${
                isActive
                  ? "text-neutral-900"
                  : "text-neutral-400 hover:text-neutral-700"
              }`}
            >
              <Icon size={20} strokeWidth={2} />
              <span className="hidden md:block">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
