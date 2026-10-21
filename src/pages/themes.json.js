// Every theme's colours, fetched by the theme picker only when needed.
import { THEMES } from "../data/site.js";

export const GET = () =>
  new Response(JSON.stringify(THEMES), {
    headers: { "Content-Type": "application/json" },
  });
