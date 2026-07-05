import type { CollectionEntry } from "astro:content"

// A post is live only when its status is exactly "published" — the same signal
// the Obsidian sync gates on. No scheduled publishing: visibility never depends
// on pubDatetime, so a post shows on the next build regardless of its date.
const postFilter = ({ data }: CollectionEntry<"blog">) => {
  return data.status === "published"
}

export default postFilter
