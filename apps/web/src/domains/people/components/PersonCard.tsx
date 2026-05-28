"use client";

import { useState } from "react";
import { Pencil, Archive, User, Mail, Phone, ChevronDown, ChevronUp } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Person } from "../types";

interface PersonCardProps {
  person: Person;
  onArchive: (id: string) => void;
}

export function PersonCard({ person, onArchive }: PersonCardProps) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-md">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-start justify-between p-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
        aria-expanded={expanded}
        aria-label={`${person.first_name} ${person.last_name} - ${expanded ? "colapsar" : "expandir"} detalles`}
      >
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <User className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-foreground truncate">
              {person.first_name} {person.last_name}
            </h3>
            {person.email && (
              <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span className="truncate">{person.email}</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
              person.status === "active"
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
            }`}
          >
            {person.status === "active" ? "Activo" : "Archivado"}
          </span>
          {expanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-border px-4 pb-4 pt-3">
          {person.phone && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
              <Phone className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>{person.phone}</span>
            </div>
          )}

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => router.push(`/dashboard/people/${person.id}/edit`)}
              className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 min-h-[36px]"
              aria-label={`Editar a ${person.first_name} ${person.last_name}`}
            >
              <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
              Editar
            </button>
            {person.status === "active" && (
              <button
                onClick={() => onArchive(person.id)}
                className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 min-h-[36px]"
                aria-label={`Archivar a ${person.first_name} ${person.last_name}`}
              >
                <Archive className="h-3.5 w-3.5" aria-hidden="true" />
                Archivar
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
