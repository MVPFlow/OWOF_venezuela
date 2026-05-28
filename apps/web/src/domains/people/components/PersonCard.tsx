"use client";

import { Pencil, Archive, User, Mail, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Person } from "../types";

interface PersonCardProps {
  person: Person;
  onArchive: (id: string) => void;
}

export function PersonCard({ person, onArchive }: PersonCardProps) {
  const router = useRouter();

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-start justify-between">
        {/* Avatar and Name */}
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <User className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-foreground truncate">
              {person.first_name} {person.last_name}
            </h3>
            {person.email && (
              <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span className="truncate">{person.email}</span>
              </div>
            )}
            {person.phone && (
              <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Phone className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>{person.phone}</span>
              </div>
            )}
          </div>
        </div>

        {/* Status Badge */}
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
            person.status === "active"
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
          }`}
        >
          {person.status === "active" ? "Activo" : "Archivado"}
        </span>
      </div>

      {/* Action Buttons */}
      {person.status === "active" && (
        <div className="mt-4 flex items-center gap-2 border-t border-border pt-3">
          <button
            onClick={() => router.push(`/dashboard/people/${person.id}/edit`)}
            className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
            aria-label={`Editar a ${person.first_name} ${person.last_name}`}
          >
            <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
            Editar
          </button>
          <button
            onClick={() => onArchive(person.id)}
            className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
            aria-label={`Archivar a ${person.first_name} ${person.last_name}`}
          >
            <Archive className="h-3.5 w-3.5" aria-hidden="true" />
            Archivar
          </button>
        </div>
      )}
    </div>
  );
}