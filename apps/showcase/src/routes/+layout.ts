import type { LayoutLoad } from "./$types";

const SITE_URL = "https://shaders.devmischief.com";
const SITE_NAME = "Paper Shaders for Svelte";
const DEFAULT_TITLE = "Paper Shaders for Svelte";
const DEFAULT_DESCRIPTION =
    "Beautiful, production-ready shader components for Svelte. Explore interactive demos, copy usage code, and ship faster.";
const DEFAULT_OG_IMAGE = "/assets/paper-texture.png";

const NO_INDEX_ROUTES = new Set(["/test", "/logo-explorations"]);

function titleCaseFromSlug(slug: string): string {
    return slug
        .split("-")
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
}

function buildSeo(pathname: string) {
    const isHome = pathname === "/";
    const noIndex = NO_INDEX_ROUTES.has(pathname);

    if (isHome) {
        const canonical = `${SITE_URL}/`;
        return {
            siteName: SITE_NAME,
            title: DEFAULT_TITLE,
            description: DEFAULT_DESCRIPTION,
            canonical,
            ogUrl: canonical,
            ogImage: `${SITE_URL}${DEFAULT_OG_IMAGE}`,
            robots: "index, follow",
            jsonLd: {
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: SITE_NAME,
                description: DEFAULT_DESCRIPTION,
                url: SITE_URL
            }
        };
    }

    const slug = pathname.replace(/^\/+/, "");
    const shaderName = titleCaseFromSlug(slug);
    const title = noIndex
        ? `${shaderName} | ${SITE_NAME}`
        : `${shaderName} Shader for Svelte | ${SITE_NAME}`;
    const description = noIndex
        ? `${shaderName} utility page in Paper Shaders Svelte.`
        : `Interactive ${shaderName} shader for Svelte with live playground controls and copy-paste usage code.`;
    const canonical = `${SITE_URL}${pathname}`;

    return {
        siteName: SITE_NAME,
        title,
        description,
        canonical,
        ogUrl: canonical,
        ogImage: `${SITE_URL}${DEFAULT_OG_IMAGE}`,
        robots: noIndex ? "noindex, nofollow" : "index, follow",
        jsonLd: {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: title,
            description,
            url: canonical,
            isPartOf: {
                "@type": "WebSite",
                name: SITE_NAME,
                url: SITE_URL
            }
        }
    };
}

export const load: LayoutLoad = ({ url }) => {
    return {
        seo: buildSeo(url.pathname)
    };
};
