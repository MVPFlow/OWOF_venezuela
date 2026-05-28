"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, AlertCircle, Users, Search, X } from "lucide-react";
import { PersonCard } from "./PersonCard";
import { archivePerson } from "../actions/archivePerson";
import { getPeople } from "../queries/getPeople";

function PersonCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm animate-pulse">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-full bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-2/3 rounded bg-muted" />
          <div className="h-3 w-1/2 rounded bg-muted" />
        </div>
        <div className="h-5 w-16 rounded-full bg-muted" />
      </div>
    </div>
  );
}

export function PersonList() {
  const [search, setSearch] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    data: people,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["people"],
    queryFn: () => getPeople(),
  });

  const handleArchive = async (personId: string) => {
    setErrorMessage(null);
    const result = await archivePerson(personId);
    if (result.success) {
      refetch();
    } else {
      setErrorMessage(result.error?.general?.[0] ?? "Error al archivar la persona");
    }
  };

  const filtered = people?.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      p.first_name.toLowerCase().includes(q) ||
      p.last_name.toLowerCase().includes(q) ||
      (p.email?.toLowerCase() ?? "").includes(q) ||
      (p.phone ?? "").includes(q)
    );
  });

  if (isLoading) {
    return (
      <div className="space-y-3" role="status" aria-label="Cargando personas">
        {Array.from({ length: 4 }).map((_, i) => (
          <PersonCardSkeleton key={i} />
        ))}
        <span className="sr-only">Cargando personas...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-6 w-6 text-destructive" aria-hidden="true" />
        </div>
        <p className="mt-3 text-sm font-medium text-destructive">
          Error al cargar las personas
        </p>
        <p className="mt-1 text-xs text-muted-foreground text-center max-w-xs">
          {error instanceof Error ? error.message : "Intenta de nuevo más tarde"}
        </p>
        <button
          onClick={() => refetch()}
          className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 min-h-[44px]"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!people || people.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Users className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
        </div>
        <p className="mt-3 text-sm font-medium text-foreground">
          No hay personas registradas
        </p>
        <p className="mt-1 text-xs text-muted-foreground text-center max-w-xs">
          Crea tu primera persona para comenzar a gestionar tu organización
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {errorMessage && (
        <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="flex-1">{errorMessage}</span>
          <button
            onClick={() => setErrorMessage(null)}
            className="shrink-0 p-0.5 rounded hover:bg-destructive/20 focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label="Cerrar mensaje de error"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <input
          type="search"
          placeholder="Buscar personas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="block w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          aria-label="Buscar personas por nombre, correo o teléfono"
        />
      </div>

      {filtered && filtered.length > 0 ? (
        <div className="space-y-3" role="list" aria-label="Lista de personas">
          {filtered.map((person) => (
            <div role="listitem" key={person.id}>
              <PersonCard
                person={person}
                onArchive={handleArchive}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8">
          <Search className="h-8 w-8 text-muted-foreground/50" aria-hidden="true" />
          <p className="mt-2 text-sm text-muted-foreground">
            No se encontraron personas con &quot;{search}&quot;
          </p>
        </div>
      )}

      {filtered && (
        <p className="text-center text-xs text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? "persona" : "personas"}
        </p>
      )}
    </div>
  );
}
