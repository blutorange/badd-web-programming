import Layout from "@theme/Layout";
import { type RefObject, useRef, useState, type ReactNode } from "react";

function applyHtml(ref: RefObject<HTMLIFrameElement | null>, html: string) {
	const iframe = ref.current;
	const iframeDoc = iframe?.contentDocument;
	if (iframe && iframeDoc) {
		iframeDoc.open();
		iframeDoc.write(html);
		iframeDoc.close();
	}
}

export default function CustomPage(): ReactNode {
	const [html, setHtml] = useState("");
	const [applyImmediate, setApplyImmediate] = useState(false);
	const iframeRef = useRef<HTMLIFrameElement>(null);
	const onHtmlChange = (newHtml: string) => {
		setHtml(newHtml);
		if (applyImmediate) {
			applyHtml(iframeRef, newHtml);
		}
	};
	return (
		<Layout>
			<div className="container">
				<h1>HTML Sandbox</h1>
				<p>
					Einfache Sandbox, hier kann man HTML-Schnippsel schreiben und
					ausprobieren.
				</p>
				<p>
					<label>
						HTML
						<textarea
							name="html"
							value={html}
							onChange={(e) => {
								onHtmlChange(e.target.value);
							}}
						/>
					</label>
				</p>
				<p>
					<label>
						<input
							type="checkbox"
							checked={applyImmediate}
							onChange={(e) => setApplyImmediate(e.target.checked)}
						/>
						Änderungen sofort anwenden?
					</label>
				</p>
				<p>
                    {applyImmediate ? undefined : <button
						name="execute"
						type="button"
						onClick={(e) => applyHtml(iframeRef, html)}
					>
						Anwenden
					</button>}
				</p>
				<iframe title="HTML-Sandbox" ref={iframeRef} />
			</div>
		</Layout>
	);
}
