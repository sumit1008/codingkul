function key(userId: string, sheetSlug: string, suffix: string) {
  return `ck_${suffix}_${userId}_${sheetSlug}`;
}

export function loadSolved(userId: string, sheetSlug: string): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(key(userId, sheetSlug, "solved"));
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

export function saveSolved(userId: string, sheetSlug: string, ids: Set<string>): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key(userId, sheetSlug, "solved"), JSON.stringify([...ids]));
}

export function loadBookmarks(userId: string, sheetSlug: string): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(key(userId, sheetSlug, "bm"));
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

export function saveBookmarks(userId: string, sheetSlug: string, ids: Set<string>): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key(userId, sheetSlug, "bm"), JSON.stringify([...ids]));
}
