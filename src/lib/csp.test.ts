import { describe, expect, it } from "vitest";
import { BASE_POLICY, buildCsp, mergePolicies } from "./csp";
import { PRESETS } from "./presets";

function presetPolicy(id: string) {
	const preset = PRESETS.find((p) => p.id === id);
	if (!preset) throw new Error(`Preset não encontrado: ${id}`);
	return preset.policy;
}

describe("buildCsp", () => {
	it("gera o header da política base", () => {
		expect(buildCsp(BASE_POLICY)).toBe(
			"default-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'",
		);
	});

	it("ignora diretivas sem origens", () => {
		expect(buildCsp({ "default-src": ["'self'"], "img-src": [] })).toBe(
			"default-src 'self'",
		);
	});
});

describe("mergePolicies", () => {
	it("remove domínios https:// quando a diretiva já tem https:", () => {
		const policy = mergePolicies(BASE_POLICY, [
			presetPolicy("google-analytics"),
			presetPolicy("external-images"),
		]);

		expect(policy["img-src"]).toEqual(["'self'", "https:", "data:"]);
	});

	it("remove os domínios redundantes em qualquer ordem", () => {
		const policy = mergePolicies(BASE_POLICY, [
			presetPolicy("external-images"),
			presetPolicy("google-analytics"),
		]);

		expect(policy["img-src"]).toEqual(["'self'", "https:", "data:"]);
	});

	it("mantém o 'self' ao declarar uma diretiva nova", () => {
		const policy = mergePolicies(BASE_POLICY, [presetPolicy("google-fonts")]);

		expect(policy["style-src"]).toEqual([
			"'self'",
			"https://fonts.googleapis.com",
		]);
		expect(policy["font-src"]).toEqual(["'self'", "https://fonts.gstatic.com"]);
	});

	it("não repete origens", () => {
		const youtube = presetPolicy("youtube");
		const policy = mergePolicies(BASE_POLICY, [youtube, youtube]);

		expect(policy["frame-src"]).toEqual([
			"'self'",
			"https://www.youtube.com",
			"https://www.youtube-nocookie.com",
		]);
	});

	it("junta origens de presets diferentes na mesma diretiva", () => {
		const policy = mergePolicies(BASE_POLICY, [
			presetPolicy("google-fonts"),
			presetPolicy("jsdelivr"),
		]);

		expect(policy["style-src"]).toEqual([
			"'self'",
			"https://fonts.googleapis.com",
			"https://cdn.jsdelivr.net",
		]);
	});

	it("remove 'none' quando a diretiva ganha outra origem", () => {
		const policy = mergePolicies(BASE_POLICY, [
			{ "object-src": ["https://exemplo.com"] },
		]);

		expect(policy["object-src"]).toEqual(["https://exemplo.com"]);
	});

	it("não altera a política base", () => {
		const before = structuredClone(BASE_POLICY);
		mergePolicies(
			BASE_POLICY,
			PRESETS.map((p) => p.policy),
		);

		expect(BASE_POLICY).toEqual(before);
	});
});
