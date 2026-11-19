/*
 * Links and previews for the full (Pro) template.
 * Building your own product on this starter? Set showProPreviews to false: the Pro menu,
 * the preview pages and the mixer teaser all disappear.
 */
export const showProPreviews = true;

/** Where "Get the full template" links go. */
export const proUrl = "https://thock-ui.vercel.app/templates/studio";

/** Live demo of the full template. Leave undefined to hide the demo buttons. */
export const demoUrl: string | undefined =
  process.env.NEXT_PUBLIC_PRO_DEMO_URL ?? "https://lowlight-studio-demo.vercel.app";
