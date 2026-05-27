"use client";

export default function Error({
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-4">
			<h2 className="text-2xl font-bold">Algo salió mal</h2>
			<p className="text-muted-foreground">
				Ha ocurrido un error inesperado. Por favor, intenta de nuevo.
			</p>
			<button
				onClick={reset}
				className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
			>
				Intentar de nuevo
			</button>
		</div>
	);
}