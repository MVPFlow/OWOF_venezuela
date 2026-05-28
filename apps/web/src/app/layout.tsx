import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { QueryProvider } from "@/providers/query-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: {
		default: "UMAF Social Platform",
		template: "%s | UMAF",
	},
	description:
		"Plataforma social para la gestión de personas, proyectos y pagos de UMAF",
	keywords: ["UMAF", "social", "platform", "ONG"],
	authors: [{ name: "UMAF" }],
	creator: "UMAF",
	publisher: "UMAF",
	manifest: "/manifest.json",
	icons: {
		icon: "/favicon.ico",
		apple: "/icons/apple-touch-icon.png",
	},
	openGraph: {
		type: "website",
		locale: "es_ES",
		url: "https://umaf.org",
		siteName: "UMAF Social Platform",
		title: "UMAF Social Platform",
		description:
			"Plataforma social para la gestión de personas, proyectos y pagos de UMAF",
	},
	twitter: {
		card: "summary_large_image",
		title: "UMAF Social Platform",
		description:
			"Plataforma social para la gestión de personas, proyectos y pagos de UMAF",
	},
	robots: {
		index: true,
		follow: true,
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="es" suppressHydrationWarning>
			<body className={inter.className}>
				<QueryProvider>{children}</QueryProvider>
			</body>
		</html>
	);
}