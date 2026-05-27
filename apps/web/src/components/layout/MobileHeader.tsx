"use client";

import { useRouter } from "next/navigation";
import { LogOut, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase/client";
import { useState } from "react";

interface MobileHeaderProps {
  title: string;
  /** Icono opcional para mostrar junto al título */
  icon?: React.ReactNode;
  /** Clases adicionales para el header */
  className?: string;
}

export function MobileHeader({ title, icon, className }: MobileHeaderProps) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await supabase.auth.signOut();
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        "md:hidden",
        className
      )}
    >
      <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
        {/* Título con icono opcional */}
        <div className="flex items-center gap-2">
          {icon && (
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
              {icon}
            </span>
          )}
          <h1 className="text-base font-semibold text-foreground truncate max-w-[200px]">
            {title}
          </h1>
        </div>

        {/* Botón de menú / acciones */}
        <div className="flex items-center gap-1">
          {/* Botón de cerrar sesión */}
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={cn(
              "inline-flex items-center justify-center rounded-md px-2.5 py-2",
              "min-h-[44px] min-w-[44px]",
              "text-muted-foreground hover:text-destructive hover:bg-destructive/10",
              "transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              isLoggingOut && "opacity-50 cursor-not-allowed"
            )}
            aria-label="Cerrar sesión"
            title="Cerrar sesión"
          >
            <LogOut className="h-5 w-5" aria-hidden="true" />
          </button>

          {/* Botón de menú (placeholder para futuro drawer) */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={cn(
              "inline-flex items-center justify-center rounded-md px-2.5 py-2",
              "min-h-[44px] min-w-[44px]",
              "text-muted-foreground hover:text-foreground hover:bg-accent",
              "transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            )}
            aria-label="Abrir menú"
            aria-expanded={isMenuOpen}
            aria-haspopup="true"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}