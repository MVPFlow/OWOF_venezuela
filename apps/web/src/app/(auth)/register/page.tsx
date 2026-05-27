"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@/domains/auth/schemas";
import { register as registerAction } from "@/domains/auth/actions/register";
import Link from "next/link";
import { useState } from "react";

export default function RegisterPage() {
	const [serverError, setServerError] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<RegisterInput>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	const onSubmit = async (data: RegisterInput) => {
		setServerError(null);
		const result = await registerAction(data);

		if (!result.success) {
			const generalError = result.error?.general?.[0];
			if (generalError) {
				setServerError(generalError);
			}
		}
	};

	return (
		<div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
			<div className="mx-auto w-full max-w-md space-y-6">
				<div className="text-center">
					<h1 className="text-3xl font-bold tracking-tight">
						Crear cuenta
					</h1>
					<p className="mt-2 text-sm text-muted-foreground">
						Regístrate para acceder a la plataforma
					</p>
				</div>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
					{serverError && (
						<div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
							{serverError}
						</div>
					)}

					<div className="space-y-2">
						<label
							htmlFor="email"
							className="text-sm font-medium leading-none"
						>
							Correo electrónico
						</label>
						<input
							id="email"
							type="email"
							placeholder="correo@ejemplo.com"
							className="flex h-12 w-full rounded-lg border border-input bg-background px-4 py-3 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
							{...register("email")}
						/>
						{errors.email && (
							<p className="text-sm text-destructive">
								{errors.email.message}
							</p>
						)}
					</div>

					<div className="space-y-2">
						<label
							htmlFor="password"
							className="text-sm font-medium leading-none"
						>
							Contraseña
						</label>
						<input
							id="password"
							type="password"
							placeholder="Mínimo 6 caracteres"
							className="flex h-12 w-full rounded-lg border border-input bg-background px-4 py-3 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
							{...register("password")}
						/>
						{errors.password && (
							<p className="text-sm text-destructive">
								{errors.password.message}
							</p>
						)}
					</div>

					<div className="space-y-2">
						<label
							htmlFor="confirmPassword"
							className="text-sm font-medium leading-none"
						>
							Confirmar contraseña
						</label>
						<input
							id="confirmPassword"
							type="password"
							placeholder="Repite la contraseña"
							className="flex h-12 w-full rounded-lg border border-input bg-background px-4 py-3 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
							{...register("confirmPassword")}
						/>
						{errors.confirmPassword && (
							<p className="text-sm text-destructive">
								{errors.confirmPassword.message}
							</p>
						)}
					</div>

					<button
						type="submit"
						disabled={isSubmitting}
						className="flex h-12 w-full items-center justify-center rounded-lg bg-primary text-base font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
					>
						{isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
					</button>
				</form>

				<div className="text-center text-sm text-muted-foreground">
					¿Ya tienes cuenta?{" "}
					<Link
						href="/login"
						className="font-medium text-primary underline-offset-4 hover:underline"
					>
						Inicia sesión
					</Link>
				</div>
			</div>
		</div>
	);
}