import type { RequestHandler } from "./$types";

const SITE_URL = "https://shaders.devmischief.com";
const EXCLUDED_ROUTES = new Set(["/test", "/logo-explorations"]);

function toRoutePath(filePath: string): string {
    const withoutPrefix = filePath.replace("/src/routes", "");
    const withoutPage = withoutPrefix.replace("/+page.svelte", "");
    const withoutRouteGroups = withoutPage.replace(/\/\([^/]+\)/g, "");
    return withoutRouteGroups || "/";
}

function getCanonicalPaths(): string[] {
    const pageModules = import.meta.glob("/src/routes/**/+page.svelte");
    const discoveredPaths = Object.keys(pageModules)
        .map(toRoutePath)
        .filter((path) => !/\[[^\]]+\]/.test(path))
        .filter((path) => !EXCLUDED_ROUTES.has(path));

    const uniquePaths = Array.from(new Set(["/", ...discoveredPaths]));
    return uniquePaths.sort((a, b) => a.localeCompare(b));
}

export const GET: RequestHandler = () => {
    const urls = getCanonicalPaths()
        .map((path) => `${SITE_URL}${path === "/" ? "/" : path}`)
        .map((loc) => `  <url><loc>${loc}</loc></url>`)
        .join("\n");

    const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

    return new Response(body, {
        headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=0, s-maxage=3600"
        }
    });
};
