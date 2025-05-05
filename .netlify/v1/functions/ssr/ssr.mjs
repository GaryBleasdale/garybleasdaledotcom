
				import createSSRHandler from './.netlify/build/entry.mjs';
				export default createSSRHandler({"cacheOnDemandPages":false,"notFoundContent":"<!DOCTYPE html><style>.container[data-astro-cid-zetdm5md]{display:flex;width:100vw;height:100vh;align-items:center;justify-content:center;flex-direction:column;gap:20px}\n</style><div class=\"container\" data-astro-cid-zetdm5md> <h1 data-astro-cid-zetdm5md>404 Error: URL not found</h1> <h2 data-astro-cid-zetdm5md><a href=\"/\" data-astro-cid-zetdm5md>Navigate back to garybleasdale.com</a></h2> </div> "});
				export const config = {
					includedFiles: ['**/*'],
					name: 'Astro SSR',
					nodeBundler: 'none',
					generator: '@astrojs/netlify@6.3.2',
					path: '/*',
					preferStatic: true,
				};
			