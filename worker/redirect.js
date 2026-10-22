// The site moved to https://vaultdraw.vercel.app. Vaultdraw 0.1.2 still links
// to this old workers.dev address from its Help menu, so every path redirects
// (301) to the same path there; the browser keeps any #fragment.
const TARGET = "https://vaultdraw.vercel.app";

export default {
  fetch(request) {
    const { pathname, search } = new URL(request.url);
    return Response.redirect(`${TARGET}${pathname}${search}`, 301);
  },
};
