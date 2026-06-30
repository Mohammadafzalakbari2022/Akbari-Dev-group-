import { revalidatePath } from "next/cache";
import { routing } from "@/i18n/routing";

export function getLocaleAwarePaths(path: string, locales: readonly string[] = routing.locales) {
  const normalized = path === "/" ? "" : path;
  const paths = [path];

  for (const locale of locales) {
    paths.push(`/${locale}${normalized}`);
  }

  return paths;
}

export function revalidatePublicPaths(paths: string[]) {
  for (const path of paths) {
    for (const localePath of getLocaleAwarePaths(path)) {
      revalidatePath(localePath);
    }
  }
}
