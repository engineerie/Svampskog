import { computed } from "vue";
import type { ComputedRef } from "vue";
import { useAsyncData } from "#app";

const overlayDatasetConfigs = {
  retention: {
    slug: "retention-trees",
    fields: {
      framework: "framework",
      startskog: "startskog",
      time: "time",
    },
  },
  seedTree: {
    slug: "seed-trees",
    fields: {
      framework: "framework",
      startskog: "startskog",
      time: "time",
    },
  },
  smaplantor: {
    slug: "smaplantor",
    fields: {
      framework: "framework",
      startskog: "startskog",
      time: "time",
    },
  },
  hogstubbar: {
    slug: "hogstubbar",
    fields: {
      framework: "framework",
      startskog: "startskog",
      time: "time",
    },
  },
  naturvardsarter: {
    slug: "naturvard",
    fields: {
      framework: "framework",
      startskog: "startskog",
      time: "time",
    },
  },
  kanteffekt: {
    slug: "kanteffekt",
    fields: {
      framework: "framework",
      startskog: null,
      time: "start",
    },
  },
} as const;

export type OverlayKey =
  | "retention"
  | "kanteffekt"
  | "rottacke"
  | "seedTree"
  | "smaplantor"
  | "hogstubbar"
  | "naturvardsarter"
  | "tradplantor";

type DatasetOverlayKey = keyof typeof overlayDatasetConfigs;

type OverlayContext = {
  framework: string | null | undefined;
  startskog: string | null | undefined;
  time: string | null | undefined;
};

type DatasetState = {
  data: ComputedRef<any[]>;
  pending: ComputedRef<boolean>;
};

type FilteredDatasetMap = Record<DatasetOverlayKey, any[]>;

const datasetOverlayKeys = Object.keys(
  overlayDatasetConfigs,
) as DatasetOverlayKey[];

function normalizeValue(value: string | null | undefined) {
  if (!value) return value ?? null;
  return value.replace(/_+$/g, "");
}

function matchesValueField(
  source: unknown,
  target: string | null | undefined,
  allowAll = true,
) {
  if (!target) return false;
  if (source == null) return true;
  const normalizedTarget = normalizeValue(target);
  if (Array.isArray(source)) {
    return (
      (allowAll && source.includes("alla")) ||
      source.some((item) => normalizeValue(String(item)) === normalizedTarget)
    );
  }
  if (typeof source === "string") {
    if (allowAll && source === "alla") return true;
    return normalizeValue(source) === normalizedTarget;
  }
  return false;
}

function applyFilter(
  collection: any[],
  ctx: OverlayContext,
  config: (typeof overlayDatasetConfigs)[DatasetOverlayKey],
  options: { ignoreStartskog?: boolean } = {},
) {
  const { ignoreStartskog = false } = options;
  const { fields } = config;
  return collection.filter((item) => {
    if (!item) return false;

    if (fields.framework) {
      const value = (item as Record<string, unknown>)[fields.framework];
      if (!matchesValueField(value, ctx.framework, false)) return false;
    }

    if (fields.startskog && !ignoreStartskog && ctx.startskog) {
      const value = (item as Record<string, unknown>)[fields.startskog];
      if (!matchesValueField(value, ctx.startskog, true)) return false;
    }

    if (fields.time) {
      const value = (item as Record<string, unknown>)[fields.time];
      if (!matchesValueField(value, ctx.time, true)) return false;
    }

    return true;
  });
}

function filterEntries(
  collection: any[],
  ctx: OverlayContext,
  config: (typeof overlayDatasetConfigs)[DatasetOverlayKey],
) {
  if (!Array.isArray(collection) || collection.length === 0) return [];
  if (!ctx?.framework || !ctx?.time) return collection;

  const normalizedCtx: OverlayContext = {
    framework: normalizeValue(ctx.framework),
    startskog: normalizeValue(ctx.startskog),
    time: ctx.time,
  };

  const isRetention = config.slug === "retention-trees";
  if (isRetention) {
    const framework = normalizedCtx.framework;
    const time = normalizedCtx.time;
    if (!framework || framework === "naturskydd") {
      return [];
    }
    if (!time || time === "innan") {
      return [];
    }
    // surface every retention tree for all frameworks/times (post avverkning) by normalizing to 'alla'
    const base = Array.isArray(collection) ? collection : [];
    return base.map(point => ({
      ...point,
      framework: "alla",
      startskog: "alla",
      time: "alla",
    }));
  }

  let results = applyFilter(collection, normalizedCtx, config);

  if (
    results.length === 0 &&
    config.fields.startskog &&
    normalizedCtx.startskog
  ) {
    if (import.meta.dev) {
      console.log(
        `[overlayRegistry] no entries for slug fallback (framework=${normalizedCtx.framework}, startskog=${normalizedCtx.startskog}, time=${normalizedCtx.time})`,
      );
    }
    results = applyFilter(collection, normalizedCtx, config, {
      ignoreStartskog: true,
    });
  }

  if (import.meta.dev) {
    console.log(`[overlayRegistry] filter result`, {
      slug: config.slug,
      total: collection.length,
      matched: results.length,
      context: normalizedCtx,
    });
  }

  return results;
}

export const DEFAULT_NATURVARD_TIMES = [
  "innan",
  "efter",
  "10 år",
  "20 år",
  "50 år",
  "80 år",
];

const defaultAvailability: Record<OverlayKey, boolean> = {
  retention: true,
  kanteffekt: true,
  rottacke: true,
  seedTree: true,
  smaplantor: true,
  hogstubbar: true,
  naturvardsarter: true,
  tradplantor: true,
};

function computeRottackeAvailability(ctx: OverlayContext) {
  const fw = ctx.framework;
  const time = ctx.time;
  if (!fw || !time) return true;
  const isSkarmtrad = fw === "skärmträd" || fw === "skarmtrad";
  const isBladning = fw === "blädning" || fw === "bladning";
  const showForSkarmtrad = isSkarmtrad && time === "efter";
  const showForBladning =
    isBladning && ["efter", "20 år", "50 år", "80 år"].includes(time);
  return showForSkarmtrad || showForBladning;
}

function computeTradplantorAvailability(ctx: OverlayContext) {
  const fw = ctx.framework;
  const time = ctx.time;
  if (!fw || !time) return true;
  return fw === "trakthygge" && time === "20 år";
}

async function fetchJson(path: string) {
  try {
    return await $fetch<any>(path);
  } catch {
    return null;
  }
}

function getFrameworkAliases(name: string): string[] {
  switch (name) {
    case "blädning":
      return ["blädning", "bladning"];
    case "skärmträd":
      return ["skärmträd", "skarmtrad"];
    default:
      return [name];
  }
}

function expandNaturvardConfig(raw: any): any[] {
  if (!raw || typeof raw !== "object") return [];

  const pointsArray = Array.isArray(raw.points) ? raw.points : [];
  const pointMap = new Map<string, any>();
  if (pointsArray.length) {
    pointsArray.forEach((point: any) => {
      if (point?.id != null) {
        pointMap.set(point.id, point);
      }
    });
  }

  const startskogSets = raw.startskogSets ?? null;
  const markersByStartskogRaw = raw.markers ?? {};
  const defaults = raw.defaults ?? {};
  const frameworksConfig = raw.frameworks ?? {};

  const baseTimeOrder: string[] = Array.isArray(raw.timelineOrder)
    ? [...raw.timelineOrder]
    : [...DEFAULT_NATURVARD_TIMES];

  const seenTimes = new Set(baseTimeOrder);
  Object.values(frameworksConfig).forEach((perStartskog: any) => {
    if (!perStartskog || typeof perStartskog !== "object") return;
    Object.values(perStartskog).forEach((timeline: any) => {
      if (!Array.isArray(timeline)) return;
      timeline.forEach((entry) => {
        const time = entry?.time;
        if (time && !seenTimes.has(time)) {
          seenTimes.add(time);
          baseTimeOrder.push(time);
        }
      });
    });
  });

  const timeOrder = baseTimeOrder;

  const markerMaps = new Map<string, Map<string, any>>();
  if (pointsArray.length && startskogSets && typeof startskogSets === "object") {
    Object.entries(startskogSets).forEach(([startskog, ids]) => {
      const map = new Map<string, any>();
      if (Array.isArray(ids)) {
        ids.forEach((id) => {
          const marker = pointMap.get(id);
          if (marker) map.set(id, marker);
        });
      }
      markerMaps.set(startskog, map);
    });
  } else {
    Object.entries(markersByStartskogRaw).forEach(([startskog, list]) => {
      const map = new Map<string, any>();
      if (Array.isArray(list)) {
        list.forEach((marker) => {
          if (marker?.id != null) map.set(marker.id, marker);
        });
      }
      markerMaps.set(startskog, map);
    });
  }

  const results: any[] = [];

  Object.entries(frameworksConfig).forEach(([frameworkName, perStartskog]) => {
    const aliases = getFrameworkAliases(frameworkName);
    const perStart = perStartskog ?? {};

    markerMaps.forEach((markerMap, startskog) => {
      if (!markerMap || markerMap.size === 0) return;
      const allIds = Array.from(markerMap.keys());
      const baseIds: string[] = Array.isArray(defaults[startskog])
        ? defaults[startskog]
        : allIds;

      let previousCurrent = new Set<string>(baseIds);
      let removedPersistent = new Set<string>();

      const timelineEntries = Array.isArray(perStart[startskog])
        ? perStart[startskog]
        : [];
      const timelineMap = new Map<string, any>();
      timelineEntries.forEach((entry: any) => {
        if (entry?.time) {
          timelineMap.set(entry.time, entry);
        }
      });

      timeOrder.forEach((time) => {
        let current = new Set<string>(previousCurrent);
        const entry = timelineMap.get(time);

        if (entry) {
          if (entry.set) {
            if (entry.set === "base") {
              current = new Set(baseIds);
            } else if (entry.set === "all") {
              current = new Set(allIds);
            } else if (Array.isArray(entry.set)) {
              current = new Set(entry.set);
            }
          }
          if (Array.isArray(entry.remove)) {
            entry.remove.forEach((id: string) => {
              current.delete(id);
              removedPersistent.add(id);
            });
          }
          if (Array.isArray(entry.add)) {
            entry.add.forEach((id: string) => {
              current.add(id);
              removedPersistent.delete(id);
            });
          }
        }

        previousCurrent.forEach((id) => {
          if (!current.has(id)) {
            removedPersistent.add(id);
          }
        });

        current.forEach((id) => {
          if (removedPersistent.has(id)) {
            removedPersistent.delete(id);
          }
        });

        aliases.forEach((fw) => {
          current.forEach((id) => {
            const marker = markerMap.get(id) || pointMap.get(id);
            if (!marker) return;
            results.push({
              id: marker.id,
              x: marker.x,
              y: marker.y,
              framework: fw,
              startskog,
              time,
              removed: false,
            });
          });
          removedPersistent.forEach((id) => {
            const marker = markerMap.get(id) || pointMap.get(id);
            if (!marker) return;
            results.push({
              id: marker.id,
              x: marker.x,
              y: marker.y,
              framework: fw,
              startskog,
              time,
              removed: true,
            });
          });
        });

        previousCurrent = new Set(current);
      });
    });
  });

  return results;
}

function expandNaturvardDataset(raw: any): any[] {
  if (!raw) return [];
  if (Array.isArray(raw.mycelium)) return raw.mycelium;
  if (
    (raw.markers && raw.frameworks) ||
    (raw.points && raw.startskogSets && raw.frameworks)
  ) {
    return expandNaturvardConfig(raw);
  }
  return [];
}

async function loadSmaplantor() {
  const candidates = ['/småplantor.json', '/småplantor.json'];
  for (const path of candidates) {
    const data = await fetchJson(path);
    if (data) return data;
  }
  return null;
}

export function useOverlayRegistry() {
  const { data: overlayData, pending: overlaysPending } = useAsyncData(
    'overlay-datasets-json',
    async () => {
      const [retention, seedTrees, smaplantor, hogstubbar, naturvard, kanteffekt] = await Promise.all([
        fetchJson('/retentionTrees.json'),
        fetchJson('/api/seedTrees'),
        loadSmaplantor(),
        fetchJson('/hogstubbar.json'),
        fetchJson('/naturvard.json'),
        fetchJson('/api/kanteffekt'),
      ]);

      return {
        'retention-trees': Array.isArray(retention?.trees) ? retention.trees : [],
        'seed-trees': Array.isArray(seedTrees?.trees) ? seedTrees.trees : [],
        smaplantor: Array.isArray(smaplantor?.trees)
          ? smaplantor.trees
          : Array.isArray(smaplantor)
            ? smaplantor
            : [],
        hogstubbar: Array.isArray(hogstubbar?.stubbar) ? hogstubbar.stubbar : [],
        naturvard: expandNaturvardDataset(naturvard),
        kanteffekt: Array.isArray(kanteffekt?.features) ? kanteffekt.features : [],
      } as Record<string, any[]>;
    },
  );

  const datasets: Record<DatasetOverlayKey, DatasetState> = {} as Record<
    DatasetOverlayKey,
    DatasetState
  >;

  datasetOverlayKeys.forEach((key) => {
    const slug = overlayDatasetConfigs[key].slug;
    datasets[key] = {
      data: computed(() => overlayData.value?.[slug] ?? []),
      pending: computed(() => overlaysPending.value),
    };
  });

  const filterDataset = (key: DatasetOverlayKey, ctx: OverlayContext) =>
    filterEntries(datasets[key].data.value, ctx, overlayDatasetConfigs[key]);

  const filterAll = (ctx: OverlayContext): FilteredDatasetMap => {
    const result = {} as FilteredDatasetMap;
    datasetOverlayKeys.forEach((key) => {
      result[key] = filterDataset(key, ctx);
    });
    if (import.meta.dev) {
      console.log(
        "[overlayRegistry] filterAll context",
        ctx,
        "result lengths",
        Object.fromEntries(
          datasetOverlayKeys.map((key) => [key, result[key]?.length ?? 0]),
        ),
      );
    }
    return result;
  };

  const availabilityFor = (
    ctx: OverlayContext,
  ): Record<OverlayKey, boolean> => {
    if (!ctx?.framework || !ctx?.time || !ctx?.startskog) {
      return { ...defaultAvailability };
    }

    const filtered = filterAll(ctx);

    const availability: Record<OverlayKey, boolean> = {
      retention:
        datasets.retention.pending.value || filtered.retention.length > 0,
      kanteffekt:
        datasets.kanteffekt.pending.value || filtered.kanteffekt.length > 0,
      rottacke: computeRottackeAvailability(ctx),
      seedTree: datasets.seedTree.pending.value || filtered.seedTree.length > 0,
      smaplantor:
        datasets.smaplantor.pending.value || filtered.smaplantor.length > 0,
      hogstubbar:
        datasets.hogstubbar.pending.value || filtered.hogstubbar.length > 0,
      naturvardsarter:
        datasets.naturvardsarter.pending.value ||
        filtered.naturvardsarter.length > 0,
      tradplantor: computeTradplantorAvailability(ctx),
    };

    return availability;
  };

  const pendingAny = computed(
    () =>
      overlaysPending.value ||
      datasetOverlayKeys.some((key) => datasets[key].pending.value),
  );

  return {
    datasets,
    filterDataset,
    filterAll,
    availabilityFor,
    pendingAny,
  };
}
