"use client";

import { usePathname, useRouter } from "next/navigation";
import { Home, Users, Folder, Settings, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { label: "Inicio", href: "/dashboard", icon: Home },
  { label: "Personas", href: "/dashboard/people", icon: Users },
  { label: "Proyectos", href: "/dashboard/projects", icon: Folder },
  { label: "Ajustes", href: "/dashboard/settings", icon: Settings },
];

export function BottomNavigation() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden"
      aria-label="Navegación principal"
    >
      <ul className="mx-auto flex h-16 max-w-lg items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <li key={item.href} className="flex-1">
              <button
                onClick={() => router.push(item.href)}
                className={cn(
                  "flex w-full flex-col items-center justify-center gap-0.5 rounded-md px-3 py-1.5 transition-colors",
                  "min-h-[44px] min-w-[44px]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
                aria-current={isActive ? "page" : undefined}
                aria-label={item.label}
              >
                <Icon
                  className={cn("h-5 w-5", isActive && "fill-primary/10")}
                  aria-hidden="true"
                />
                <span
                  className={cn(
                    "text-[10px] font-medium leading-tight",
                    isActive && "font-semibold",
                  )}
                >
                  {item.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
