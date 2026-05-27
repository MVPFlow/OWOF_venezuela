import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { BottomNavigation } from "@/components/layout/BottomNavigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Si no hay sesión, redirigir al login
  if (!user) {
    redirect("/login");
  }

  // Extraer nombre del usuario para mostrar
  const userName =
    user.user_metadata?.full_name ||
    user.email?.split("@")[0] ||
    "Usuario";

  return (
    <div className="relative min-h-dvh bg-background pb-16 md:pb-0">
      {/* Mobile Header - solo visible en mobile */}
      <MobileHeader title={userName} />

      {/* Contenido principal */}
      <main className="mx-auto max-w-lg px-4 py-6 md:max-w-4xl md:px-6 lg:max-w-6xl">
        {children}
      </main>

      {/* Bottom Navigation - solo visible en mobile */}
      <BottomNavigation />
    </div>
  );
}