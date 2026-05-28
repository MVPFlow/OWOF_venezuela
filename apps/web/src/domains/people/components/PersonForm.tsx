"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { personSchema } from "../schemas/person.schema";
import type { PersonInput } from "../schemas/person.schema";
import type { Person } from "../types";

interface PersonFormProps {
  initialData?: Person;
  onSubmit: (data: PersonInput) => Promise<void>;
  isSubmitting?: boolean;
}

export function PersonForm({
  initialData,
  onSubmit,
  isSubmitting = false,
}: PersonFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PersonInput>({
    resolver: zodResolver(personSchema),
    defaultValues: {
      first_name: initialData?.first_name ?? "",
      last_name: initialData?.last_name ?? "",
      email: initialData?.email ?? "",
      phone: initialData?.phone ?? "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <label
          htmlFor="first_name"
          className="text-sm font-medium text-foreground"
        >
          Nombre <span className="text-destructive">*</span>
        </label>
        <input
          id="first_name"
          type="text"
          autoComplete="given-name"
          inputMode="text"
          {...register("first_name")}
          className="block w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Juan"
          disabled={isSubmitting}
        />
        {errors.first_name && (
          <p className="text-xs text-destructive">{errors.first_name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="last_name"
          className="text-sm font-medium text-foreground"
        >
          Apellido <span className="text-destructive">*</span>
        </label>
        <input
          id="last_name"
          type="text"
          autoComplete="family-name"
          inputMode="text"
          {...register("last_name")}
          className="block w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Pérez"
          disabled={isSubmitting}
        />
        {errors.last_name && (
          <p className="text-xs text-destructive">{errors.last_name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="email"
          className="text-sm font-medium text-foreground"
        >
          Correo electrónico
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          {...register("email")}
          className="block w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="juan@ejemplo.com"
          disabled={isSubmitting}
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="phone"
          className="text-sm font-medium text-foreground"
        >
          Teléfono
        </label>
        <input
          id="phone"
          type="tel"
          autoComplete="tel"
          inputMode="numeric"
          {...register("phone")}
          className="block w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="+58 412 123 4567"
          disabled={isSubmitting}
        />
        {errors.phone && (
          <p className="text-xs text-destructive">{errors.phone.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[44px]"
      >
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {initialData ? "Actualizar persona" : "Crear persona"}
      </button>
    </form>
  );
}
