# 🔴 Errores Críticos — Pendientes de Reparación

Diagnóstico realizado el 27/05/2026. 20 errores de TypeScript en 3 archivos, más 2 problemas estructurales.

---

## ERROR 1 (CRÍTICO): `archivePerson.ts` — 3 funciones duplicadas en 1 solo archivo

**Archivo:** `apps/web/src/domains/people/actions/archivePerson.ts`

El archivo contiene **3 funciones completas** una tras otra, cada una con sus propias directivas `"use server"` e imports repetidos:

| Líneas | Función | Problema |
|--------|---------|----------|
| 1-70 | `createPerson()` | Ya existe en `createPerson.ts` (duplicado) |
| 71-170 | `updatePerson()` | Ya existe en `updatePerson.ts` (duplicado) |
| 171-252 | `archivePerson()` | Es la función real que debería estar sola |

Causa **18 errores TS2300** (identificadores duplicados: `revalidatePath`, `redirect`, `createClient`, `personSchema`, `PersonInput`, `Database`).

**Reparación:** Eliminar líneas 1-170 completas. Dejar solo el bloque `archivePerson()` (líneas 171-252) con su directiva `"use server"` e imports correspondientes.

---

## ERROR 2 (CRÍTICO): Tipos de Supabase no resuelven `.insert()` / `.update()`

**Archivos:** `apps/web/src/domains/people/actions/createPerson.ts:51` y `apps/web/src/domains/people/actions/updatePerson.ts:78`

Error: `'first_name' does not exist in type 'never[]'`. La variable tipada como `Database["public"]["Tables"]["people"]["Insert"]` no hace match con el genérico esperado por `supabase.from("people").insert()`.

**Reparación (opciones):**
1. Pasar el tipo explícitamente:
   ```ts
   supabase.from("people").insert<Database["public"]["Tables"]["people"]["Insert"]>(insertData)
   ```
2. O castear como workaround rápido:
   ```ts
   supabase.from("people").insert(insertData as any)
   ```

---

## ERROR 3 (MODERADO): `query-provider.tsx` tiene contenido equivocado

**Archivo:** `apps/web/src/providers/query-provider.tsx`

Contiene configuración de navegación (duplicado de `navigation.config.ts`) en lugar de un `QueryClientProvider` de React Query. `useQuery` en `PersonList.tsx` fallará en runtime.

**Reparación:** Reemplazar contenido con:
```tsx
"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

const QUERY_STALE_TIME = 1000 * 60 * 5; // 5 min

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: QUERY_STALE_TIME, retry: 1 },
        },
      })
  );
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
```

Luego envolver `{children}` con `<QueryProvider>` en el root layout.

---

## ERROR 4 (MENOR): Rutas del BottomNavigation no existen

**Archivo:** `apps/web/src/components/layout/BottomNavigation.tsx`

Enlaza a `/dashboard/people`, `/dashboard/projects`, `/dashboard/settings` — no hay `page.tsx` para esas rutas. Causarán 404 en navegación.

**Reparación:** Crear los archivos de página correspondientes o ajustar los hrefs a rutas existentes.

---

## ERROR 5 (MENOR): ANON KEY de Supabase truncada en `.env.local`

**Archivo:** `apps/web/.env.local`

Valor actual: `sb_publishable_7Cs28xcyfapxHAO-UmJAJg_M4stW_r-`

Parece incompleta. Una clave publishable real de Supabase es más larga. Causaría fallos de autenticación en runtime.

**Reparación:** Reemplazar con la clave completa desde el panel de Supabase.
