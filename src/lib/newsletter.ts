import { safeUrl } from "./events";
export type NewsletterPreview = {
  subject: string;
  text: string;
  links: { label: string; url: string }[];
  images: { name: string; data: Uint8Array; mime: string }[];
};
export function readInertHtml(html: string) {
  const template = document.createElement("template");
  template.innerHTML = html;
  template.content
    .querySelectorAll("script,style,iframe,object,embed,form,svg,math")
    .forEach((node) => node.remove());
  const links = Array.from(template.content.querySelectorAll("a[href]"))
    .map((a) => ({
      label: a.textContent?.trim() || "Source link",
      url: a.getAttribute("href") || "",
    }))
    .filter((a) => safeUrl(a.url));
  template.content
    .querySelectorAll("p,div,tr,br,h1,h2,h3,li")
    .forEach((node) => node.append(document.createTextNode("\n")));
  const text = (template.content.textContent || "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n[ \t]*\n+/g, "\n\n")
    .trim();
  return { text, links: [...new Map(links.map((a) => [a.url, a])).values()] };
}
