import { hydrate, prerender as renderToHtml } from "preact-iso";
import { App } from "./app";
import { pageMeta, site } from "./data/site";
if (typeof window !== "undefined")
  hydrate(<App />, document.getElementById("app")!);
export async function prerender(data: { url: string }) {
  const path = new URL(data.url, site.url).pathname.replace(/\/$/, "") || "/";
  const meta = pageMeta[path] || pageMeta["/404"];
  const result = await renderToHtml(<App />);
  return {
    ...result,
    head: {
      lang: "en-GB",
      title: `${meta.title} | OneSIT`,
      elements: new Set([
        {
          type: "meta",
          props: { name: "description", content: meta.description },
        },
        { type: "link", props: { rel: "canonical", href: site.url + path } },
        {
          type: "meta",
          props: { property: "og:title", content: `${meta.title} | OneSIT` },
        },
        {
          type: "meta",
          props: { property: "og:description", content: meta.description },
        },
        {
          type: "meta",
          props: { property: "og:url", content: site.url + path },
        },
        {
          type: "meta",
          props: {
            name: "robots",
            content:
              path === "/tools/newsletter" || path === "/404"
                ? "noindex,follow"
                : "index,follow",
          },
        },
      ]),
    },
  };
}
