import { z } from "zod";

export const loginSchema = z.object({
	email: z
		.string()
		.min(1, "El correo electrónico es requerido")
		.email("Ingresa un correo electrónico válido"),
	password: z
		.string()
		.min(1, "La contraseña es requerida")
		.min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export const registerSchema = z
	.object({
		email: z
			.string()
			.min(1, "El correo electrónico es requerido")
			.email("Ingresa un correo electrónico válido"),
		password: z
			.string()
			.min(1, "La contraseña es requerida")
			.min(6, "La contraseña debe tener al menos 6 caracteres"),
		confirmPassword: z
			.string()
			.min(1, "La confirmación de contraseña es requerida"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Las contraseñas no coinciden",
		path: ["confirmPassword"],
	});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;