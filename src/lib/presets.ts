import type { Policy } from "./csp";

export type Preset = {
	id: string;
	label: string;
	description: string;
	policy: Policy;
	warning?: string;
};

export const PRESETS: Preset[] = [
	{
		id: "google-fonts",
		label: "Google Fonts",
		description: "Fontes carregadas direto dos servidores do Google.",
		policy: {
			"style-src": ["https://fonts.googleapis.com"],
			"font-src": ["https://fonts.gstatic.com"],
		},
	},
	{
		id: "google-analytics",
		label: "Google Analytics 4",
		description: "Medição de acessos com o GA4 (gtag.js).",
		policy: {
			"script-src": ["https://*.googletagmanager.com"],
			"img-src": [
				"https://*.google-analytics.com",
				"https://*.googletagmanager.com",
			],
			"connect-src": [
				"https://*.google-analytics.com",
				"https://*.analytics.google.com",
				"https://*.googletagmanager.com",
			],
		},
	},
	{
		id: "youtube",
		label: "Vídeos do YouTube",
		description: "Vídeos incorporados na página com iframe.",
		policy: {
			"frame-src": [
				"https://www.youtube.com",
				"https://www.youtube-nocookie.com",
			],
		},
	},
	{
		id: "vimeo",
		label: "Vídeos do Vimeo",
		description: "Vídeos incorporados na página com iframe.",
		policy: {
			"frame-src": ["https://player.vimeo.com"],
		},
	},
	{
		id: "google-maps",
		label: "Mapa do Google Maps",
		description:
			"Mapa incorporado com iframe (opção Compartilhar > Incorporar).",
		policy: {
			"frame-src": ["https://www.google.com"],
		},
	},
	{
		id: "jsdelivr",
		label: "CDN jsDelivr",
		description: "Bibliotecas carregadas de cdn.jsdelivr.net.",
		policy: {
			"script-src": ["https://cdn.jsdelivr.net"],
			"style-src": ["https://cdn.jsdelivr.net"],
		},
	},
	{
		id: "external-images",
		label: "Imagens de qualquer site",
		description: "Imagens hospedadas em outros domínios e imagens em data URI.",
		policy: {
			"img-src": ["https:", "data:"],
		},
	},
	{
		id: "inline-styles",
		label: "Estilos inline",
		description: "Atributos style e tags <style> escritos direto no HTML.",
		policy: {
			"style-src": ["'unsafe-inline'"],
		},
		warning:
			"Libera qualquer estilo inline, inclusive os injetados por um atacante. Prefira nonce ou hash quando possível.",
	},
];
