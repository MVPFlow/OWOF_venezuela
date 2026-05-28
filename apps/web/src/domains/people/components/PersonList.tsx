"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2, AlertCircle, Users } from "lucide-react";
import { PersonCard } from "./PersonCard";
import { archivePerson } from "../actions/archivePerson";
import { getPeople } from "../queries/getPeople";

export function PersonList() {
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
    const result = await archivePerson(personId);
    if (result.success) {
      refetch();
    } else {
      alert(result.error?.general?.[0] ?? "Error al archivar la persona");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-3 text-sm text-muted-foreground">Cargando personas...</p>
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
        <p className="mt-1 text-xs text-muted-foreground">
          {error instanceof Error ? error.message : "Intenta de nuevo más tarde"}
        </p>
        <button
          onClick={() => refetch()}
          className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
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
        <p className="mt-1 text-xs text-muted-foreground">
          Crea tu primera persona para comenzar
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {people.map((person) => (
        <PersonCard
          key={person.id}
          person={person}
          onArchive={handleArchive}
        />
      ))}
    </div>
  );
}