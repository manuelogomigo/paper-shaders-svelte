import type { Handle } from "@sveltejs/kit";

const AGENT_DISCOVERY_LINKS = [
    '</.well-known/api-catalog.json>; rel="api-catalog"',
    '</docs/api.md>; rel="service-doc"'
];

function wantsMarkdown(acceptHeader: string | null): boolean {
    if (!acceptHeader) return false;
    return acceptHeader
        .toLowerCase()
        .split(",")
        .some((value) => value.trim().startsWith("text/markdown"));
}

function decodeEntities(text: string): string {
    return text
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
}

function stripTags(text: string): string {
    return decodeEntities(text.replace(/<[^>]+>/g, ""))
        .replace(/\s+/g, " ")
        .trim();
}

function htmlToMarkdown(html: string): string {
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const title = titleMatch ? decodeEntities(titleMatch[1].trim()) : "";

    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    let source = bodyMatch ? bodyMatch[1] : html;

    source = source
        .replace(/<script[\s\S]*?<\/script>/gi, "")
        .replace(/<style[\s\S]*?<\/style>/gi, "")
        .replace(/<nav[\s\S]*?<\/nav>/gi, "")
        .replace(/<footer[\s\S]*?<\/footer>/gi, "");

    let markdown = source
        // Preserve semantic blocks so content doesn't collapse together.
        .replace(/<(main|section|article|header|aside|div)[^>]*>/gi, "\n\n")
        .replace(/<\/(main|section|article|header|aside|div)>/gi, "\n\n")
        .replace(/<(ul|ol)[^>]*>/gi, "\n")
        .replace(/<\/(ul|ol)>/gi, "\n")
        .replace(/<(h1|h2|h3|h4|h5|h6)[^>]*>([\s\S]*?)<\/\1>/gi, (_, tag, c) => {
            const level = Number(tag[1]);
            const text = stripTags(c);
            return text ? `\n${"#".repeat(level)} ${text}\n` : "\n";
        })
        .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (_, c) => {
            const text = stripTags(c);
            return text ? `\n${text}\n` : "\n";
        })
        .replace(/<a[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, (_, href, text) => {
            const label = stripTags(text) || href;
            return ` [${label}](${href}) `;
        })
        .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, c) => {
            const text = stripTags(c);
            return text ? `- ${text}\n` : "";
        })
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<[^>]+>/g, "")
        .replace(/[ \t]+\n/g, "\n")
        .replace(/\n[ \t]+/g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim();

    // Normalize dense link runs into readable markdown lists.
    markdown = markdown
        .replace(/([^\n])\s{2,}\[/g, "$1\n[")
        .replace(/(\[[^\]]+\]\([^)]+\))(?:\s+\[[^\]]+\]\([^)]+\))+/g, (chunk) => {
            const links = chunk.match(/\[[^\]]+\]\([^)]+\)/g) ?? [];
            return `\n${links.map((link) => `- ${link}`).join("\n")}\n`;
        })
        .replace(/^(\[[^\]]+\]\([^)]+\))$/gm, "- $1")
        .replace(/\n(\d+)\n\/\s*\1\n/g, "\n")
        .replace(/\n{3,}/g, "\n\n")
        .trim();

    if (title) {
        markdown = `# ${title}\n\n${markdown}`;
    }

    return markdown;
}

function estimateTokenCount(text: string): number {
    // Cheap estimate for token budgeting if a model-specific tokenizer isn't available.
    return Math.max(1, Math.ceil(text.length / 4));
}

function addAgentDiscoveryLinkHeaders(headers: Headers, pathname: string): void {
    if (pathname !== "/") return;
    for (const link of AGENT_DISCOVERY_LINKS) {
        headers.append("link", link);
    }
}

export const handle: Handle = async ({ event, resolve }) => {
    const markdownRequested = wantsMarkdown(event.request.headers.get("accept"));
    const response = await resolve(event);
    const headers = new Headers(response.headers);
    addAgentDiscoveryLinkHeaders(headers, event.url.pathname);

    if (!markdownRequested) {
        return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers
        });
    }

    const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";
    if (!contentType.includes("text/html")) {
        return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers
        });
    }

    const html = await response.text();
    const markdown = htmlToMarkdown(html);
    headers.set("content-type", "text/markdown; charset=utf-8");
    headers.set("vary", "accept");
    headers.set("x-markdown-tokens", String(estimateTokenCount(markdown)));
    headers.delete("content-length");

    return new Response(markdown, {
        status: response.status,
        statusText: response.statusText,
        headers
    });
};
