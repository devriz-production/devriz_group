import type { ImageMetadata } from 'astro';

// Every image under src/assets, keyed by its file name without the extension.
const files = import.meta.glob<{ default: ImageMetadata }>('/src/assets/**/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
});

const byId = new Map<string, ImageMetadata>();
for (const [path, mod] of Object.entries(files)) {
  const id = path.split('/').pop()!.replace(/\.[^.]+$/, '');
  byId.set(id, mod.default);
}

export const findImage = (...ids: (string | undefined)[]) => {
  for (const id of ids) {
    if (id && byId.has(id)) return byId.get(id)!;
  }
  return undefined;
};

export const hasImage = (id: string) => byId.has(id);
