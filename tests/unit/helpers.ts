import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = new URL('../../', import.meta.url).pathname;

/** All routes the site builds, derived from src/pages and the services collection. */
export function builtRoutes(): Set<string> {
  const pagesDir = join(root, 'src/pages');
  const routes = new Set<string>();
  const walk = (dir: string) => {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      if (statSync(full).isDirectory()) walk(full);
      else if (name.endsWith('.astro') && !name.startsWith('[')) {
        const rel = `/${relative(pagesDir, full).replace(/\.astro$/, '')}`;
        routes.add(rel === '/index' ? '/' : rel.replace(/\/index$/, ''));
      }
    }
  };
  walk(pagesDir);
  for (const path of servicePaths()) routes.add(path);
  return routes;
}

export function servicePaths(): string[] {
  const dir = join(root, 'src/content/services');
  return readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const match = readFileSync(join(dir, f), 'utf8').match(/^path:\s*(\S+)/m);
      if (!match?.[1]) throw new Error(`No path in ${f}`);
      return match[1];
    });
}

export function readRepoFile(path: string): string {
  return readFileSync(join(root, path), 'utf8');
}

export function listFiles(dir: string, ext: string): string[] {
  const out: string[] = [];
  const walk = (d: string) => {
    for (const name of readdirSync(d)) {
      const full = join(d, name);
      if (statSync(full).isDirectory()) walk(full);
      else if (name.endsWith(ext)) out.push(relative(root, full));
    }
  };
  walk(join(root, dir));
  return out;
}
