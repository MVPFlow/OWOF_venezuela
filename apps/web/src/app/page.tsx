import Link from "next/link";

export default function HomePage() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center p-24">
			<div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
				<h1 className="text-4xl font-bold text-center mb-4">
					UMAF Social Platform
				</h1>
				<p className="text-center text-muted-foreground">
					Plataforma Social UMAF - En construcción
				</p>
				<div className="mt-8 flex justify-center gap-4">
					<Link
						href="/login"
						className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
					>
						Iniciar Sesión
					</Link>
					<Link
						href="/register"
						className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
					>
						Registrarse
					</Link>
				</div>
			</div>
		</main>
	);
}