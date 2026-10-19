/**
 * Every internal link and asset goes through the build's base path, so the site works at the domain root
 * (`/`) and in a sub-folder such as GitHub Pages' `/KILN/`. Set it with BASE_PATH at build time.
 */
export const BASE = import.meta.env.BASE_URL;
export const HOME = BASE;
export const MENU = `${BASE}menu/`;
