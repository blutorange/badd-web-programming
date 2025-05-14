// @ts-check

/**
 * Enables or disables all AJAX links.
 * @param {boolean} enabled Whether to enable or disable the links.
 */
function toggleAjaxLinks(enabled) {
	for (const link of document.querySelectorAll(".ajax-link")) {
		link.classList.toggle("disabled", !enabled);
	}
}

/**
 * Updates the content of the `<main>` section with the given content.
 * @param {string} content The new content, an HTML snippet.
 */
function updateMainContent(content) {
	const main = document.querySelector("main");
	if (main === null) {
		console.warn("No <main> found in page");
		return;
	}
	const parser = new DOMParser();
	const parsed = parser.parseFromString(content, "text/html");

	// We must treat scripts separately
	const scripts = parsed.querySelectorAll("script");
	for (const script of scripts) {
		script.remove();
	}

	// Update the main section with the new content
	main.innerHTML = "";
	main.append(...parsed.body.children);

	// Insert scripts manually so the browser executes them
	for (const script of document.querySelectorAll(".dynamic-script")) {
		script.remove();
	}
	for (const script of scripts) {
		const newScript = document.createElement("script");
		if (script.textContent) {
			newScript.textContent = script.textContent;
		}
		if (script.src) {
			newScript.src = script.src;
		}
		newScript.classList.add("dynamic-script");
		document.body.append(newScript);
	}
}

export function initNavigation() {
	for (const link of document.querySelectorAll(".ajax-link")) {
		if (!(link instanceof HTMLAnchorElement)) {
			continue;
		}
		link.addEventListener("click", async (event) => {
			// Prevent the default action of clicking in the link, which is to open the linked page.
			event.preventDefault();
			// Prevent other handlers from handling the click, we already handled it.
			event.stopPropagation();
			toggleAjaxLinks(false);
			try {
				const response = await fetch(link.href);
				if (response.status !== 200) {
					throw new Error(`Server returned ${response.status}`);
				}
				const snippet = await response.text();
				updateMainContent(snippet);
			} catch (e) {
				console.error(`Unable to load page <${link.href}>`, e);
				const error = document.createElement("sample");
				error.textContent = e.stack ?? e.message;
				error.classList.add("page-load-error");
				updateMainContent(error.outerHTML);
			} finally {
				await new Promise((r) => setTimeout(r, 500));
				toggleAjaxLinks(true);
			}
		});
	}
}
