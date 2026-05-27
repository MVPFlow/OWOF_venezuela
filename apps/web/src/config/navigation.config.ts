export interface NavItem {
	title: string;
	href: string;
	icon?: string;
	description?: string;
	items?: NavItem[];
}

export const publicNavItems: NavItem[] = [
	{
		title: "Inicio",
		href: "/",
		description: "Página principal",
	},
	{
		title: "Acerca de",
		href: "/about",
		description: "Conoce la organización",
	},
	{
		title: "Proyectos",
		href: "/projects",
		description: "Nuestros proyectos activos",
	},
	{
		title: "Transparencia",
		href: "/transparency",
		description: "Información financiera y reportes",
	},
];

export const dashboardNavItems: NavItem[] = [
	{
		title: "Dashboard",
		href: "/dashboard",
		icon: "LayoutDashboard",
		description: "Panel principal",
	},
	{
		title: "Personas",
		href: "/dashboard/people",
		icon: "Users",
		description: "Gestión de personas",
	},
	{
		title: "Proyectos",
		href: "/dashboard/projects",
		icon: "FolderKanban",
		description: "Gestión de proyectos",
	},
	{
		title: "Pagos",
		href: "/dashboard/payments",
		icon: "CreditCard",
		description: "Gestión de pagos",
	},
	{
		title: "Reportes",
		href: "/dashboard/reports",
		icon: "BarChart3",
		description: "Reportes y estadísticas",
	},
	{
		title: "Configuración",
		href: "/dashboard/settings",
		icon: "Settings",
		description: "Configuración del sistema",
	},
];