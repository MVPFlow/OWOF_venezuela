declare module "next-pwa" {
	import type { NextConfig } from "next";

	interface PWAConfig {
		dest: string;
		register?: boolean;
		skipWaiting?: boolean;
		disable?: boolean;
		publicExcludes?: string[];
		buildExcludes?: string[];
		fallbacks?: Record<string, string>;
	}

	function withPWA(config: PWAConfig): (nextConfig: NextConfig) => NextConfig;

	export default withPWA;
}