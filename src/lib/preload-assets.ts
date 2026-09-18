const globbed = import.meta.glob("../assets/*.{png,jpg,jpeg,svg,webp,gif}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const pointers = import.meta.glob("../assets/*.asset.json", {
  eager: true,
  import: "default",
}) as Record<string, { url?: string }>;

export const assetUrls: string[] = [
  ...Object.values(globbed),
  ...Object.values(pointers)
    .map((p) => p?.url)
    .filter((u): u is string => typeof u === "string"),
];

let preloadPromise: Promise<void> | undefined;

function loadOne(url: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = url;
    if (img.complete) resolve();
  });
}

/** Loads every image asset used across the app. Resolves when all settle. */
export function preloadAllAssets(
  onProgress?: (done: number, total: number) => void,
): Promise<void> {
  if (preloadPromise) return preloadPromise;
  const total = assetUrls.length;
  let done = 0;
  onProgress?.(0, total);
  preloadPromise = Promise.all(
    assetUrls.map((url) =>
      loadOne(url).then(() => {
        done += 1;
        onProgress?.(done, total);
      }),
    ),
  ).then(() => undefined);
  return preloadPromise;
}
