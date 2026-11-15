import { useState } from "react";
import {
	BASE_POLICY,
	buildCsp,
	DIRECTIVE_ORDER,
	mergePolicies,
} from "./lib/csp";
import { DIRECTIVE_INFO } from "./lib/directives";
import { PRESETS } from "./lib/presets";

export default function App() {
	const [selectedIds, setSelectedIds] = useState<string[]>([]);
	const [copied, setCopied] = useState(false);

	const selected = PRESETS.filter((preset) => selectedIds.includes(preset.id));
	const policy = mergePolicies(
		BASE_POLICY,
		selected.map((preset) => preset.policy),
	);
	const csp = buildCsp(policy);
	const header = `Content-Security-Policy: ${csp}`;
	const activeDirectives = DIRECTIVE_ORDER.filter(
		(directive) => policy[directive]?.length,
	);

	function toggle(id: string) {
		setCopied(false);
		setSelectedIds((current) =>
			current.includes(id)
				? current.filter((item) => item !== id)
				: [...current, id],
		);
	}

	async function copy() {
		try {
			await navigator.clipboard.writeText(header);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch {
			setCopied(false);
		}
	}

	return (
		<main className="min-h-screen bg-zinc-950 text-zinc-100">
			<div className="mx-auto max-w-5xl px-6 py-12">
				<h1 className="text-3xl font-bold">Gerador de CSP</h1>
				<p className="mt-2 text-zinc-400">
					Marque o que o seu site usa e receba o header pronto.
				</p>

				<div className="mt-10 grid gap-8 lg:grid-cols-2">
					<fieldset>
						<legend className="mb-4 text-lg font-semibold">
							O que o seu site usa?
						</legend>

						<div className="grid gap-3">
							{PRESETS.map((preset) => {
								const isSelected = selectedIds.includes(preset.id);

								return (
									<label
										key={preset.id}
										className="flex cursor-pointer gap-3 rounded-lg border border-zinc-800 p-4 hover:border-zinc-600 has-checked:border-emerald-500 has-checked:bg-emerald-500/5"
									>
										<input
											type="checkbox"
											className="mt-1 size-4 accent-emerald-500"
											checked={isSelected}
											onChange={() => toggle(preset.id)}
										/>
										<span>
											<span className="block font-medium">{preset.label}</span>
											<span className="block text-sm text-zinc-400">
												{preset.description}
											</span>
											{preset.warning && isSelected && (
												<span
													role="alert"
													className="mt-2 block text-sm text-amber-400"
												>
													{preset.warning}
												</span>
											)}
										</span>
									</label>
								);
							})}
						</div>
					</fieldset>

					<section
						aria-labelledby="resultado"
						className="lg:sticky lg:top-8 lg:self-start"
					>
						<div className="mb-4 flex items-center justify-between">
							<h2 id="resultado" className="text-lg font-semibold">
								Seu header
							</h2>
							<button
								type="button"
								onClick={copy}
								className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-emerald-400"
							>
								{copied ? "Copiado!" : "Copiar"}
							</button>
						</div>

						<pre className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 text-sm whitespace-pre-wrap wrap-break-word">
							<code>{header}</code>
						</pre>
					</section>
				</div>

				<section aria-labelledby="explicacao" className="mt-12">
					<h2 id="explicacao" className="text-lg font-semibold">
						O que cada parte faz
					</h2>

					<dl className="mt-4 grid gap-4 md:grid-cols-2">
						{activeDirectives.map((directive) => (
							<div
								key={directive}
								className="rounded-lg border border-zinc-800 p-4"
							>
								<dt className="font-mono text-sm text-emerald-400">
									{directive}
								</dt>
								<dd className="mt-1 text-sm text-zinc-400">
									{DIRECTIVE_INFO[directive]}
								</dd>
							</div>
						))}
					</dl>
				</section>
			</div>
		</main>
	);
}
