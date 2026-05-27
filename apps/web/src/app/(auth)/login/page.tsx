"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/domains/auth/schemas";
import { login } from "@/domains/auth/actions/login";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
	const [serverError, setServerError] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<LoginInput>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = async (data: LoginInput) => {
		setServerError(null);
		const result = await login(data);

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
						Iniciar sesión
					</h1>
					<p className="mt-2 text-sm text-muted-foreground">
						Ingresa tus credenciales para acceder al panel
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
							className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
							<p className="text-sm text-destructive">{errors.email.message}</p>
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
							placeholder="••••••••"
							className="flex h-12 w-full rounded-lg border border-input bg-background px-4 py-3 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
							{...register("password")}
						/>
						{errors.password && (
							<p className="text-sm text-destructive">
								{errors.password.message}
							</p>
						)}
					</div>

					<button
						type="submit"
						disabled={isSubmitting}
						className="flex h-12 w-full items-center justify-center rounded-lg bg-primary text-base font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
					>
						{isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
					</button>
				</form>

				<div className="text-center text-sm text-muted-foreground">
					¿No tienes cuenta?{" "}
					<Link
						href="/register"
						className="font-medium text-primary underline-offset-4 hover:underline"
					>
						Regístrate
					</Link>
				</div>
			</div>
		</div>
	);
}