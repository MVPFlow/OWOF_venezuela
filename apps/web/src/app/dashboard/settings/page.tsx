import { Settings } from "lucide-react";

export const metadata = {
  title: "Configuración",
  description: "Configuración del sistema",
};

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <section aria-labelledby="settings-heading">
        <h1
          id="settings-heading"
          className="text-xl font-bold text-foreground sm:text-2xl"
        >
          Configuración
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Administra la configuración de tu cuenta y la organización
        </p>
      </section>
      <div className="flex flex-col items-center justify-center py-12">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Settings className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
        </div>
        <p className="mt-3 text-sm font-medium text-foreground">
          Configuración próximamente
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Esta sección estará disponible en una próxima actualización
        </p>
      </div>
    </div>
  );
}
