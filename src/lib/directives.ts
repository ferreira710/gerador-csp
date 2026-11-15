import type { Directive } from "./csp";

export const DIRECTIVE_INFO: Record<Directive, string> = {
	"default-src":
		"Regra padrão. Vale para todo tipo de recurso que não tiver uma diretiva própria.",
	"script-src": "De onde o site pode carregar e executar JavaScript.",
	"style-src": "De onde o site pode carregar folhas de estilo (CSS).",
	"img-src": "De onde o site pode carregar imagens.",
	"font-src": "De onde o site pode carregar fontes.",
	"connect-src":
		"Para onde o JavaScript pode enviar requisições (fetch, XHR, WebSocket).",
	"frame-src": "Quais sites podem ser incorporados na página com iframe.",
	"object-src":
		"Plugins antigos como Flash (<object> e <embed>). O recomendado é bloquear tudo.",
	"base-uri":
		"Quais endereços a tag <base> pode usar. Impede que um atacante mude a base dos links relativos.",
	"form-action": "Para onde os formulários da página podem enviar dados.",
	"frame-ancestors":
		"Quais sites podem incorporar a sua página em um iframe. Protege contra clickjacking.",
};
