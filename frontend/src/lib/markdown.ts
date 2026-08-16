import { marked } from "marked";
import crimepulseMd from "../content/crimepulse_readme.md?raw";
import travelmindMd from "../content/travelmind_readme.md?raw";

marked.setOptions({ gfm: true, breaks: false });

export function markdownToHtml(markdown: string): string {
  return marked.parse(markdown) as string;
}

export const CRIMEPULSE_README_HTML = markdownToHtml(crimepulseMd);
export const TRAVELMIND_README_HTML = markdownToHtml(travelmindMd);
