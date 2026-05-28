import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Users, FolderKanban, TrendingUp, Activity } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

function MetricCard({
  title,
  value,
  description,
  icon,
  trend,
}: MetricCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1.5">
          <TrendingUp
            className={`h-4 w-4 ${
              trend.isPositive ? "text-green-500" : "text-red-500"
            }`}
            aria-hidden="true"
          />
          <span
            className={`text-xs font-medium ${
              trend.isPositive ? "text-green-500" : "text-red-500"
            }`}
          >
            {trend.isPositive ? "+" : ""}
            {trend.value}%
          </span>
          <span className="text-xs text-muted-foreground">vs mes anterior</span>
        </div>
      )}
    </div>
  );
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const userName =
    user.user_metadata?.full_name || user.email?.split("@")[0] || "Usuario";
  const now = new Date();
  const hour = now.getHours();

  let greeting = "Buenos días";
  if (hour >= 12 && hour < 18) greeting = "Buenas tardes";
  if (hour >= 18) greeting = "Buenas noches";

  // For now, metrics are static; in production they'd come from the database
  const metrics = [
    {
      title: "Personas registradas",
      value: "0",
      description: "Total de personas en la plataforma",
      icon: <Users className="h-5 w-5" aria-hidden="true" />,
      trend: { value: 0, isPositive: true },
    },
    {
      title: "Proyectos activos",
      value: "0",
      description: "Proyectos en curso",
      icon: <FolderKanban className="h-5 w-5" aria-hidden="true" />,
      trend: { value: 0, isPositive: true },
    },
    {
      title: "Actividad reciente",
      value: "0",
      description: "Acciones en las últimas 24h",
      icon: <Activity className="h-5 w-5" aria-hidden="true" />,
    },
    {
      title: "Tasa de engagement",
      value: "0%",
      description: "Usuarios activos semanales",
      icon: <TrendingUp className="h-5 w-5" aria-hidden="true" />,
      trend: { value: 0, isPositive: true },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Sección de bienvenida */}
      <section aria-labelledby="welcome-heading">
        <div className="rounded-xl bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 p-6">
          <h1
            id="welcome-heading"
            className="text-xl font-bold text-foreground sm:text-2xl"
          >
            {greeting}, {userName}
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Bienvenido a tu panel de control. Aquí podrás gestionar personas,
            proyectos y más. (v2)
          </p>
        </div>
      </section>

      {/* Métricas principales */}
      <section aria-labelledby="metrics-heading">
        <h2 id="metrics-heading" className="sr-only">
          Métricas del dashboard
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => (
            <MetricCard key={metric.title} {...metric} />
          ))}
        </div>
      </section>

      {/* Acciones rápidas */}
      <section aria-labelledby="quick-actions-heading">
        <h2
          id="quick-actions-heading"
          className="mb-4 text-lg font-semibold text-foreground"
        >
          Acciones rápidas
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              label: "Nueva persona",
              description: "Registrar miembro",
              href: "/dashboard/people/new",
            },
            {
              label: "Nuevo proyecto",
              description: "Crear proyecto",
              href: "/dashboard/projects",
            },
            {
              label: "Ver reportes",
              description: "Estadísticas",
              href: "/dashboard/reports",
            },
            {
              label: "Configuración",
              description: "Ajustes",
              href: "/dashboard/settings",
            },
          ].map((action) => (
            <a
              key={action.label}
              href={action.href}
              className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-border bg-card p-4 text-center transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <span className="text-sm font-medium text-foreground">
                {action.label}
              </span>
              <span className="text-xs text-muted-foreground">
                {action.description}
              </span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
