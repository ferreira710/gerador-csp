export type Directive =
	| "default-src"
	| "script-src"
	| "style-src"
	| "img-src"
	| "font-src"
	| "connect-src"
	| "frame-src"
	| "object-src"
	| "base-uri"
	| "form-action"
	| "frame-ancestors";

export type Policy = Partial<Record<Directive, string[]>>;

export const DIRECTIVE_ORDER: Directive[] = [
	"default-src",
	"script-src",
	"style-src",
	"img-src",
	"font-src",
	"connect-src",
	"frame-src",
	"object-src",
	"base-uri",
	"form-action",
	"frame-ancestors",
];

const FETCH_DIRECTIVES: Directive[] = [
	"script-src",
	"style-src",
	"img-src",
	"font-src",
	"connect-src",
	"frame-src",
];

export const BASE_POLICY: Policy = {
	"default-src": ["'self'"],
	"object-src": ["'none'"],
	"base-uri": ["'self'"],
	"form-action": ["'self'"],
	"frame-ancestors": ["'none'"],
};

function removeRedundantSources(sources: string[]): string[] {
	if (!sources.includes("https:")) return sources;
	return sources.filter((source) => !source.startsWith("https://"));
}

export function mergePolicies(base: Policy, additions: Policy[]): Policy {
	const result: Policy = {};

	for (const directive of DIRECTIVE_ORDER) {
		const sources = base[directive];
		if (sources) result[directive] = [...sources];
	}

	for (const addition of additions) {
		for (const directive of DIRECTIVE_ORDER) {
			const sources = addition[directive];
			if (!sources) continue;

			const inherited = FETCH_DIRECTIVES.includes(directive)
				? (result["default-src"] ?? [])
				: [];
			const current = result[directive] ?? inherited;
			const merged = [...new Set([...current, ...sources])];

			const withoutNone =
				merged.length > 1 ? merged.filter((s) => s !== "'none'") : merged;

			result[directive] = removeRedundantSources(withoutNone);
		}
	}

	return result;
}

export function buildCsp(policy: Policy): string {
	return DIRECTIVE_ORDER.flatMap((directive) => {
		const sources = policy[directive];
		return sources?.length ? [`${directive} ${sources.join(" ")}`] : [];
	}).join("; ");
}
