/**
 * Módulo de posts del blog — eliminado junto con la sección Blog (#80).
 * El contenido se migró a Notion. Backup en docs/blog-content-backup/.
 *
 * Se mantiene como stub vacío por compatibilidad de imports mientras
 * se migran las referencias. Eliminar en el próximo refactor.
 */
export type { Post } from "./types";
export type LoadedPost = import("./types").Post;

const EMPTY: import("./types").Post[] = [];

export async function getPosts(): Promise<import("./types").Post[]> {
  return EMPTY;
}

export async function getPost(_id: string): Promise<import("./types").Post | undefined> {
  return undefined;
}
