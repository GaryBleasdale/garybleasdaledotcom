import '@astrojs/internal-helpers/path';
import 'kleur/colors';
import { q as NOOP_MIDDLEWARE_HEADER, v as decodeKey } from './chunks/astro/server_wUy6F35M.mjs';
import 'clsx';
import 'cookie';
import 'es-module-lexer';
import 'html-escaper';

const NOOP_MIDDLEWARE_FN = async (_ctx, next) => {
  const response = await next();
  response.headers.set(NOOP_MIDDLEWARE_HEADER, "true");
  return response;
};

const codeToStatusMap = {
  // Implemented from tRPC error code table
  // https://trpc.io/docs/server/error-handling#error-codes
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TIMEOUT: 405,
  CONFLICT: 409,
  PRECONDITION_FAILED: 412,
  PAYLOAD_TOO_LARGE: 413,
  UNSUPPORTED_MEDIA_TYPE: 415,
  UNPROCESSABLE_CONTENT: 422,
  TOO_MANY_REQUESTS: 429,
  CLIENT_CLOSED_REQUEST: 499,
  INTERNAL_SERVER_ERROR: 500
};
Object.entries(codeToStatusMap).reduce(
  // reverse the key-value pairs
  (acc, [key, value]) => ({ ...acc, [value]: key }),
  {}
);

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///home/gmbleasdale/Desktop/Source_Code_Bleasdale_eComm/garybleasdale.com/","cacheDir":"file:///home/gmbleasdale/Desktop/Source_Code_Bleasdale_eComm/garybleasdale.com/node_modules/.astro/","outDir":"file:///home/gmbleasdale/Desktop/Source_Code_Bleasdale_eComm/garybleasdale.com/dist/","srcDir":"file:///home/gmbleasdale/Desktop/Source_Code_Bleasdale_eComm/garybleasdale.com/src/","publicDir":"file:///home/gmbleasdale/Desktop/Source_Code_Bleasdale_eComm/garybleasdale.com/public/","buildClientDir":"file:///home/gmbleasdale/Desktop/Source_Code_Bleasdale_eComm/garybleasdale.com/dist/","buildServerDir":"file:///home/gmbleasdale/Desktop/Source_Code_Bleasdale_eComm/garybleasdale.com/.netlify/build/","adapterName":"@astrojs/netlify","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"404.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/404","isIndex":false,"type":"page","pattern":"^\\/404\\/?$","segments":[[{"content":"404","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/404.astro","pathname":"/404","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/commits/[year].json","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/commits\\/([^/]+?)\\.json\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"commits","dynamic":false,"spread":false}],[{"content":"year","dynamic":true,"spread":false},{"content":".json","dynamic":false,"spread":false}]],"params":["year"],"component":"src/pages/api/commits/[year].json.ts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"inline","content":"html{font-family:Menlo,Monaco,Lucida Console,Courier New,Courier,monospace;letter-spacing:-.025rem}body,figure{margin:0;padding:0}a{text-decoration:none}ul{list-style:none;margin:0;padding:0}*,*:before,*:after{box-sizing:border-box}h1,h2,h3,h4{margin:0;font-family:system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Open Sans,Helvetica Neue,sans-serif}p{color:#666;font-size:.9rem;line-height:1.5;margin:0;text-wrap:pretty}.print{display:none!important}@media print{.no-print{display:none!important}.print{display:block!important}astro-dev-toolbar{display:none!important}article{break-inside:avoid}}\n.ch-container{display:block}.ch-container,.ch-domain,.ch-domain-container,.ch-domain-container-animation-wrapper{overflow:visible}.ch-domain-container.in-transition .ch-domain-container-animation-wrapper{overflow:hidden}.ch-domain-bg{fill:transparent}.ch-domain-text{fill:currentColor;font-size:10px}.ch-subdomain{overflow:visible}.ch-subdomain-bg{fill:#151b23}.ch-subdomain-bg.highlight{stroke:#444;stroke-width:1px}.ch-subdomain-bg:hover{stroke:#000;stroke-width:1px}.ch-subdomain-text{font-size:8px;pointer-events:none}[data-theme=dark] .ch-subdomain-bg{fill:#2d333b}[data-theme=dark] .ch-subdomain-bg.highlight{stroke:#768390}[data-theme=dark] .ch-subdomain-bg:hover{stroke:#636e7b}#ch-plugin-legend>svg{background:transparent;color:currentColor}#ch-tooltip{background:#222;border-radius:2px;box-shadow:2px 2px 2px #0003;box-sizing:border-box;color:#bbb;display:none;font-size:12px;line-height:1.4;padding:5px 10px;text-align:center}#ch-tooltip[data-show]{display:block}#ch-tooltip-arrow,#ch-tooltip-arrow:before{background:inherit;height:8px;position:absolute;width:8px}#ch-tooltip-arrow{visibility:hidden}#ch-tooltip-arrow:before{content:\"\";transform:rotate(45deg);visibility:visible}#ch-tooltip[data-popper-placement^=top]>#ch-tooltip-arrow{bottom:-4px;margin-left:-4px}#ch-tooltip[data-popper-placement^=bottom]>#ch-tooltip-arrow{margin-left:-4px;top:-4px}#ch-tooltip[data-popper-placement^=left]>#ch-tooltip-arrow{right:-4px}#ch-tooltip[data-popper-placement^=right]>#ch-tooltip-arrow{left:-4px}#ch-tooltip[data-theme=dark]{background:#636e7b;color:#cdd9e5}.button{background:#2d333b;color:#adbac7;border-radius:4px;padding:6px;font-size:14px}.button:active{background:#292e33}\n"}],"routeData":{"route":"/git","isIndex":false,"type":"page","pattern":"^\\/git\\/?$","segments":[[{"content":"git","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/git.astro","pathname":"/git","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/home/gmbleasdale/Desktop/Source_Code_Bleasdale_eComm/garybleasdale.com/src/pages/git.astro",{"propagation":"none","containsHead":true}],["/home/gmbleasdale/Desktop/Source_Code_Bleasdale_eComm/garybleasdale.com/src/pages/index.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000noop-actions":"_noop-actions.mjs","\u0000@astro-page:src/pages/404@_@astro":"pages/404.astro.mjs","\u0000@astro-page:src/pages/api/commits/[year].json@_@ts":"pages/api/commits/_year_.json.astro.mjs","\u0000@astro-page:src/pages/git@_@astro":"pages/git.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_no8lLMX3.mjs","/home/gmbleasdale/Desktop/Source_Code_Bleasdale_eComm/garybleasdale.com/node_modules/unstorage/drivers/fs-lite.mjs":"chunks/fs-lite_COtHaKzy.mjs","/home/gmbleasdale/Desktop/Source_Code_Bleasdale_eComm/garybleasdale.com/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_Bwra99Nm.mjs","@/components/react/CommitHeatmap":"_astro/CommitHeatmap.B571U5Rt.js","@astrojs/react/client.js":"_astro/client.BPIbHqJh.js","/home/gmbleasdale/Desktop/Source_Code_Bleasdale_eComm/garybleasdale.com/src/components/sections/Hero.astro?astro&type=script&index=0&lang.ts":"_astro/Hero.astro_astro_type_script_index_0_lang.UhWSgTes.js","/home/gmbleasdale/Desktop/Source_Code_Bleasdale_eComm/garybleasdale.com/src/components/KeyboardManager.astro?astro&type=script&index=0&lang.ts":"_astro/KeyboardManager.astro_astro_type_script_index_0_lang.CRs8wqyy.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["/home/gmbleasdale/Desktop/Source_Code_Bleasdale_eComm/garybleasdale.com/src/components/sections/Hero.astro?astro&type=script&index=0&lang.ts","let i=document.querySelector(\".email-icon\"),t=document.querySelector(\".email-a\"),l=document.querySelector(\".email-details-container\"),a=!1;i?.addEventListener(\"click\",function(){l.style.display=\"block\",a=!0});document.addEventListener(\"click\",function(e){e.target.closest(\".email-icon\")?t.classList.add(\"active-link\"):(l.style.display=\"none\",t.classList.remove(\"active-link\"),a=!1)});i.addEventListener(\"mouseenter\",function(){t?.classList.add(\"active-link\")});i.addEventListener(\"mouseleave\",function(){a===!1&&t?.classList.remove(\"active-link\")});l?.addEventListener(\"click\",function(){navigator.clipboard.writeText(\"gary@garybleasdale.com\").then(()=>{let e=document.querySelector(\".email-copy-success\");e.style.display=\"block\",setTimeout(()=>{e.style.display=\"none\"},3e3)})});"]],"assets":["/_astro/index.BCPmCe3x.css","/favicon.png","/favicon.svg","/nested_repos_calendar.png","/profile.jpg","/_astro/CommitHeatmap.B571U5Rt.js","/_astro/KeyboardManager.astro_astro_type_script_index_0_lang.CRs8wqyy.js","/_astro/client.BPIbHqJh.js","/_astro/index.BVOCwoKb.js","/404.html","/index.html"],"buildFormat":"directory","checkOrigin":true,"serverIslandNameMap":[],"key":"AiEBnEuxMbGNq4oaRDSqYHFjH76jXWisho8LTDE2SNY=","sessionConfig":{"driver":"fs-lite","options":{"base":"/home/gmbleasdale/Desktop/Source_Code_Bleasdale_eComm/garybleasdale.com/node_modules/.astro/sessions"}}});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = () => import('./chunks/fs-lite_COtHaKzy.mjs');

export { manifest };
