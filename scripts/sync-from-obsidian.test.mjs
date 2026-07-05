import { describe, it, expect } from "vitest";
import { rewriteImages, referencedImageNames } from "./sync-from-obsidian.mjs";

describe("rewriteImages", () => {
  it("rewrites markdown attachments to /img/<slug>/", () => {
    expect(rewriteImages("![a](attachments/0.png)", "aio")).toBe(
      "![a](/img/aio/0.png)"
    );
  });

  it("rewrites Obsidian wikilink embeds by basename", () => {
    expect(rewriteImages("![[Xnip.png]]", "cw")).toBe("![](/img/cw/Xnip.png)");
    expect(rewriteImages("![[sub/dir/Xnip.png|cap]]", "cw")).toBe(
      "![cap](/img/cw/Xnip.png)"
    );
  });

  it("rewrites raw <img src> local paths, keeping other attributes", () => {
    expect(
      rewriteImages('<img src="5.png" alt="AIO" width="200" />', "aio")
    ).toBe('<img src="/img/aio/5.png" alt="AIO" width="200" />');
  });

  it("leaves remote, data, and already-rooted <img src> untouched", () => {
    for (const src of [
      "https://x.com/a.png",
      "data:image/png;base64,AAAA",
      "/img/aio/5.png",
    ]) {
      const tag = `<img src="${src}" />`;
      expect(rewriteImages(tag, "aio")).toBe(tag);
    }
  });
});

describe("referencedImageNames", () => {
  it("collects basenames across markdown, wikilink, and <img>", () => {
    const body = [
      "![](attachments/0.png)",
      "![[sub/Xnip.png|cap]]",
      '<img src="5.png" />',
    ].join("\n");
    expect(referencedImageNames(body)).toEqual(
      new Set(["0.png", "Xnip.png", "5.png"])
    );
  });

  it("ignores remote and data URLs", () => {
    const body =
      '![](https://x.com/a.png)\n<img src="data:image/png;base64,AAAA" />';
    expect(referencedImageNames(body)).toEqual(new Set());
  });
});
