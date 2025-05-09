import { c as createComponent, a as createAstro, m as maybeRenderHead, b as addAttribute, r as renderTemplate, d as renderComponent } from '../chunks/astro/server_BtlSuxVt.mjs';
import 'kleur/colors';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useRef, useState, useCallback, useEffect } from 'react';
import CalHeatmap from 'cal-heatmap';
import Tooltip from 'cal-heatmap/plugins/Tooltip';
import LegendLite from 'cal-heatmap/plugins/LegendLite';
import CalendarLabel from 'cal-heatmap/plugins/CalendarLabel';
import 'clsx';
import { b as basics, $ as $$Layout, a as $$Icon } from '../chunks/Icon_E9d5qyyl.mjs';
import { d as db, c as commits } from '../chunks/_astro_db_GhweK_FF.mjs';
/* empty css                               */
import { sql } from '@astrojs/db/dist/runtime/virtual.js';
export { renderers } from '../renderers.mjs';

function CommitHeatmap({ availableYears, initialYear }) {
  const heatmapRef = useRef(null);
  const cal = useRef(null);
  const [selectedYear, setSelectedYear] = useState(initialYear);
  const [commitData, setCommitData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchDataForYear = useCallback(
    async (year) => {
      if (isLoading) return;
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/commits/${year}.json`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCommitData(data);
      } catch (e) {
        setError(e.message);
        setCommitData({});
        console.error(`Failed to fetch commit data for year ${year}:`, e);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading]
  );
  useEffect(() => {
    if (selectedYear !== null) {
      fetchDataForYear(selectedYear);
    }
  }, [selectedYear, fetchDataForYear]);
  useEffect(() => {
    if (!heatmapRef.current) {
      console.warn("Heatmap container ref is not available.");
      return;
    }
    const defaultCalConfig = {
      itemSelector: heatmapRef.current,
      domain: {
        type: "month",
        gutter: 4,
        label: { text: "MMM", textAlign: "start", position: "top" }
      },
      subDomain: {
        type: "ghDay",
        radius: 2,
        width: 11,
        height: 11,
        gutter: 4
      },
      date: {
        start: /* @__PURE__ */ new Date(`${selectedYear}-01-01`)
      },
      range: 12,
      scale: {
        color: {
          type: "threshold",
          range: ["#14432a", "#166b34", "#37a446", "#4dd05a"],
          domain: [1, 2, 5]
        }
      },
      plugins: [
        [
          Tooltip,
          {
            text: function(_timestamp, value, dayjsDate) {
              return (value ? value : "No") + " contributions on " + dayjsDate.format("dddd, MMMM D, YYYY");
            }
          }
        ],
        [
          LegendLite,
          {
            includeBlank: true,
            itemSelector: "#ex-ghDay-legend",
            radius: 2,
            width: 11,
            height: 11,
            gutter: 4
          }
        ],
        [
          CalendarLabel,
          {
            width: 30,
            textAlign: "start",
            text: () => dayjs.weekdaysShort().map((d, i) => i % 2 == 0 ? "" : d),
            padding: [25, 0, 0, 0]
          }
        ]
      ]
    };
    if (!cal.current) {
      cal.current = new CalHeatmap();
      cal.current.paint(
        {
          ...defaultCalConfig,
          data: {
            source: commitData,
            x: "date",
            y: "value",
            groupy: "sum"
          }
        },
        defaultCalConfig.plugins
      );
      setIsLoading(false);
    } else if (!isLoading) {
      const currentCalStartDate = cal.current.getView().options.start;
      const currentCalYear = currentCalStartDate ? currentCalStartDate.getFullYear() : null;
      if (currentCalYear !== selectedYear) {
        cal.current.jumpTo(new Date(selectedYear, 0, 1));
      }
      cal.current.update(commitData, false);
    }
    return () => {
      if (cal.current) {
        cal.current.destroy();
        cal.current = null;
      }
    };
  }, [commitData, selectedYear, isLoading]);
  const handleYearSelect = (year) => {
    if (year !== selectedYear) {
      setSelectedYear(year);
    }
  };
  return /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("div", { style: { marginBottom: "15px", textAlign: "right" }, children: /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column" }, children: [
    /* @__PURE__ */ jsx("div", { ref: heatmapRef, style: { minHeight: "160px", minWidth: "95%" }, children: isLoading && /* @__PURE__ */ jsx("div", { style: { width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsxs("p", { style: { color: "#768390" }, children: [
      !error && /* @__PURE__ */ jsxs("span", { children: [
        "Loading heatmap data for ",
        selectedYear,
        "..."
      ] }),
      error && /* @__PURE__ */ jsxs("span", { children: [
        "Error loading data for ",
        selectedYear,
        "..."
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "15px" }, children: [
      /* @__PURE__ */ jsx("div", { style: { display: "flex" }, children: availableYears.map((year) => /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => handleYearSelect(year),
          disabled: isLoading,
          style: {
            margin: "0 2px",
            padding: "4px 8px",
            cursor: isLoading ? "not-allowed" : "pointer",
            border: "1px solid #444",
            background: year === selectedYear ? "#0969da" : "#2d333b",
            color: year === selectedYear ? "#ffffff" : "#adbac7",
            borderRadius: "4px",
            fontSize: "12px",
            opacity: isLoading ? 0.6 : 1,
            pointerEvents: isLoading ? "none" : "auto"
          },
          "aria-pressed": year === selectedYear,
          children: year
        },
        year
      )) }),
      /* @__PURE__ */ jsxs("div", { style: { gap: "10px", display: "flex", justifyContent: "flex-end" }, children: [
        /* @__PURE__ */ jsx(
          "a",
          {
            className: "button button--sm button--secondary margin-top--sm",
            href: "#",
            onClick: (e) => {
              e.preventDefault();
              cal.current.previous(2);
            },
            children: "← Previous"
          }
        ),
        /* @__PURE__ */ jsx(
          "a",
          {
            className: "button button--sm button--secondary margin-top--sm margin-left--xs",
            href: "#",
            onClick: (e) => {
              e.preventDefault();
              cal.current.next(2);
              console.log(cal.current.navigator.maxDomainReached);
            },
            children: "Next →"
          }
        )
      ] })
    ] })
  ] }) }) });
}

const $$Astro = createAstro();
const $$Breadcrumb = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Breadcrumb;
  const { pathname } = Astro2.url;
  let paths = pathname.split("/").filter((path) => Boolean(path));
  let { style } = Astro2.props;
  let breadcrumbs = paths.map((segment, idx) => {
    return {
      name: segment,
      href: "/" + paths.slice(0, idx + 1).join("/")
    };
  });
  return renderTemplate`${paths.length > 0 && renderTemplate`${maybeRenderHead()}<nav aria-label="Breadcrumb"${addAttribute(style, "style")}><ol style="display: flex; gap: 0.5em; list-style: none; padding: 0; margin: 0;"><li><a href="/"${addAttribute({ ...style, textDecoration: "underline" }, "style")}>
HOME
</a></li>${breadcrumbs.map((crumb, idx) => renderTemplate`<li style="display: flex; align-items: center;"><span aria-hidden="true" style="margin: 0 0.5em;">
>
</span>${idx === breadcrumbs.length - 1 ? renderTemplate`<span${addAttribute({ fontWeight: "bold" }, "style")}>${crumb.name.toUpperCase()}</span>` : renderTemplate`<a${addAttribute(crumb.href, "href")}${addAttribute({ textDecoration: "underline" }, "style")}>${crumb.name.toUpperCase()}</a>`}</li>`)}</ol></nav>`}`;
}, "/home/gmbleasdale/Desktop/Source_Code_Bleasdale_eComm/garybleasdale.com/src/components/sections/Breadcrumb.astro", void 0);

const prerender = false;
const $$Git = createComponent(async ($$result, $$props, $$slots) => {
  const { name } = basics;
  let githubBasics = basics.profiles.find((el) => el.network === "GitHub");
  const yearResult = await db.selectDistinct({
    year: sql`CAST(strftime('%Y', ${commits.commit_timestamp}, 'unixepoch') AS INTEGER)`
  }).from(commits).orderBy(sql`${commits.commit_timestamp} DESC`);
  const availableYears = yearResult.map((row) => row.year);
  const initialYear = availableYears.length > 0 ? availableYears[0] : (/* @__PURE__ */ new Date()).getFullYear();
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": `${name}: Git`, "backgroundColor": "#22272d" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div${addAttribute({
    background: "#22272d",
    color: "#adbac7",
    borderRadius: "3px",
    padding: "1rem",
    overflow: "hidden",
    height: "100vh",
    width: "100vw",
    maxWidth: "840px",
    margin: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "10px"
  }, "style")}> ${renderComponent($$result2, "Breadcrumb", $$Breadcrumb, { "style": { color: "#adbac7" } })} <h1>Github-like commit calendar</h1> <div>
This is a commit heatmap for the production repos hosted on my local
      machine, few of which are on Github. Data is automatically updated every
      day at 4:35 AM EST.
</div> <div${addAttribute({ display: "flex", alignItems: "center", gap: "3px" }, "style")}>
You can visit my Github profile here:
<a${addAttribute(githubBasics.url, "href")} target="_blank"> ${renderComponent($$result2, "Icon", $$Icon, { "name": "simple-icons:github", "class": "icon hero-icon", "style": {
    backgroundColor: "white",
    color: "#22272d",
    width: "20px",
    height: "20px",
    borderRadius: "2px",
    padding: "1px"
  } })} </a> </div> <div> ${renderComponent($$result2, "CommitHeatmap", CommitHeatmap, { "client:load": true, "availableYears": availableYears, "initialYear": initialYear, "client:component-hydration": "load", "client:component-path": "@/components/react/CommitHeatmap", "client:component-export": "default" })} </div> <div${addAttribute({ float: "right", fontSize: 12 }, "style")}> <span${addAttribute({ color: "#768390" }, "style")}>Less</span> <div id="ex-ghDay-legend"${addAttribute({ display: "inline-block", margin: "0 4px" }, "style")}></div> <span${addAttribute({ color: "#768390", fontSize: 12 }, "style")}>More</span> </div> </div> ` })}`;
}, "/home/gmbleasdale/Desktop/Source_Code_Bleasdale_eComm/garybleasdale.com/src/pages/git.astro", void 0);

const $$file = "/home/gmbleasdale/Desktop/Source_Code_Bleasdale_eComm/garybleasdale.com/src/pages/git.astro";
const $$url = "/git";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Git,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
