export function chunkArray<T>(items: T[], size: number): T[][] {
  const chunked: T[][] = [];
  let pointer = 0;

  while (pointer < items.length) {
    chunked.push(items.slice(pointer, pointer + size));
    pointer += size;
  }

  return chunked;
}

export function unChunkArray<T>(chunked: T[][]): T[] {
  const items: T[] = [];

  for (const i in chunked) {
    items.push(...chunked[i]);
  }

  return items;
}
