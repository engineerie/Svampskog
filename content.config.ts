import { defineCollection, z } from "@nuxt/content";

const variantEnum = z.enum([
  "solid",
  "outline",
  "subtle",
  "soft",
  "ghost",
  "link",
]);
const colorEnum = z.enum([
  "primary",
  "secondary",
  "tertiary",
  "rodeodust",
  "poison",
  "signal",
  "info",
  "success",
  "warning",
  "error",
  "kalkmark",
  "vanligmark",
  "time",
  "neutral",
]);
const sizeEnum = z.enum(["xs", "sm", "md", "lg", "xl"]);
const orientationEnum = z.enum(["vertical", "horizontal"]);
const numericStringSchema = z.union([z.number(), z.string()]);

const baseSchema = {
  title: z.string().nonempty(),
  description: z.string().nonempty(),
};

const linkSchema = z.object({
  label: z.string().nonempty(),
  to: z.string().nonempty(),
  icon: z.string().optional().editor({ input: "icon" }),
  size: sizeEnum.optional(),
  trailing: z.boolean().optional(),
  target: z.string().optional(),
  color: colorEnum.optional(),
  variant: variantEnum.optional(),
});

const imageSchema = z.object({
  src: z.string().nonempty(),
  alt: z.string().optional(),
  loading: z.string().optional(),
  srcset: z.string().optional(),
});

const badgeSchema = z.object({
  label: z.string().nonempty(),
  color: colorEnum.optional(),
});

const ecologyIntroItemSchema = z.object({
  title: z.string().nonempty(),
  description: z.string().nonempty(),
  image: z.string().optional(),
  img: z.string().optional(),
  img2: z.string().optional(),
  noBorder: z.boolean().optional(),
});

const ecologyIntroSectionSchema = z.object({
  title: z.string().nonempty(),
  description: z.string().nonempty(),
  items: z.array(ecologyIntroItemSchema),
});

const galleryItemSchema = z.object({
  title: z.string().nonempty(),
  image: z.string().nonempty(),
  description: z.string().optional(),
});

const gallerySectionSchema = z.object({
  title: z.string().nonempty(),
  description: z.string().optional(),
  items: z.array(galleryItemSchema),
});

const pressItemSchema = z.object({
  title: z.string().nonempty(),
  publication: z.string().optional(),
  publicationDate: z.string().optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
  url: z.string().nonempty(),
  badge: badgeSchema.optional(),
});

const timelineItemSchema = z.object({
  date: z.string().nonempty(),
  title: z.string().nonempty(),
  description: z.string().nonempty(),
  icon: z.string().optional().editor({ input: "icon" }),
});

const pressSectionSchema = z.object({
  title: z.string().nonempty(),
  description: z.string().nonempty(),
  items: z.array(pressItemSchema),
});

const timelineSectionSchema = z.object({
  title: z.string().nonempty(),
  description: z.string().nonempty(),
  items: z.array(timelineItemSchema),
});

const forestryTimelineEntrySchema = z.object({
  startskog: z.string().nonempty(),
  atgard: z.string().nonempty(),
  tid: z.string().nonempty(),
  skog: z.string().nonempty(),
  svamp: z.string().nonempty(),
});

const forestryTimelineSchema = z.object({
  id: z.string().nonempty(),
  entries: z.array(forestryTimelineEntrySchema),
});

const forestryChartTextVariantSchema = z.object({
  id: z.string().nonempty(),
  description: z.string().nonempty(),
});

const forestryChartTextSchema = z.object({
  id: z.string().nonempty(),
  description: z.string().nonempty(),
  modalDescription: z.string().optional(),
  variants: z.array(forestryChartTextVariantSchema).optional(),
});

const methodSchema = z.object({
  index: z.number().optional(),
  id: z.string().nonempty(),
  title: z.string().nonempty(),
  image: z.string().nonempty(),
  shortdescription: z.string().nonempty(),
  description: z.string().nonempty(),
  descriptionsvamp: z.string().nonempty(),
  type: z.string().optional(),
});

const logoSchema = z.object({
  src: z.string().nonempty(),
  alt: z.string().optional(),
  height: z.number().optional(),
  width: z.number().optional(),
});

const financingSchema = z.object({
  headline: z.string().nonempty(),
  logos: z.array(logoSchema),
  notes: z.array(z.string()),
});

const sectionSchema = z.object({
  headline: z.string().optional(),
  ...baseSchema,
});

export const collections = {
  docs: defineCollection({
    type: "page",
    source: "1.docs/**/*",
    schema: z.object({
      title: z.string().nonempty(),
      description: z.string().nonempty(),
    }),
  }),
  information: defineCollection({
    type: "page",
    source: "4.info/**/*",
    schema: z.object({
      title: z.string().nonempty(),
      description: z.string().nonempty(),
    }),
  }),
  mushroomInfo: defineCollection({
    type: "page",
    source: "6.svamparDocs/**/*",
    schema: z.object({
      title: z.string().nonempty(),
      description: z.string().nonempty(),
      headline: z.string().optional(),
    }),
  }),
  posts: defineCollection({
    type: "page",
    source: "3.blog/**/*",
    schema: z.object({
      title: z.string().nonempty(),
      description: z.string().nonempty(),
      image: z.object({ src: z.string().nonempty() }),
      authors: z.array(
        z.object({
          name: z.string().nonempty(),
          to: z.string().nonempty(),
          avatar: z.object({ src: z.string().nonempty() }),
        }),
      ),
      date: z.string().nonempty(),
      category: z.string().nonempty(),
      badge: z.object({ label: z.string().nonempty() }).optional(),
    }),
  }),
  index: defineCollection({
    source: "0.index.yml",
    type: "page",
    schema: z.object({
      title: z.string().nonempty(),
      description: z.string().nonempty(),
      hero: sectionSchema.extend({
        headline: z.object({
          label: z.string().optional(),
          to: z.string().optional(),
          icon: z.string().optional().editor({ input: "icon" }),
          color: colorEnum.optional(),
        }),
        links: z.array(linkSchema),
      }),
      sections: z.array(
        sectionSchema.extend({
          id: z.string().nonempty(),
          src: z.string().nonempty(),
          orientation: orientationEnum.optional(),
          links: z.array(linkSchema),
          reverse: z.boolean().optional(),
        }),
      ),
      press: pressSectionSchema.optional(),
      timeline: timelineSectionSchema.optional(),
      financing: financingSchema.optional(),
    }),
  }),
  mykorrhizasvampar: defineCollection({
    type: "page",
    source: "1.mykorrhizasvampar.yml",
    schema: z.object({
      title: z.string().nonempty(),
      description: z.string().nonempty(),
      underlag: z.string().nonempty(),
      underlagdescription: z.string().nonempty(),
      hero: sectionSchema.extend({
        headline: z.object({
          label: z.string().optional(),
          to: z.string().optional(),
          icon: z.string().optional().editor({ input: "icon" }),
          color: colorEnum.optional(),
        }),
        links: z.array(linkSchema),
        src: z.string().nonempty(),
        orientation: orientationEnum.optional(),
      }),
      ecologyintro: ecologyIntroSectionSchema,
      gallery: gallerySectionSchema.optional(),
    }),
  }),
  skogsskotsel: defineCollection({
    type: "page",
    source: "2.skogsskotsel.yml",
    schema: z.object({
      title: z.string().nonempty(),
      description: z.string().nonempty(),
      underlag: z.string().nonempty(),
      underlagdescription: z.string().nonempty(),
      hero: sectionSchema.extend({
        headline: z.object({
          label: z.string().optional(),
          to: z.string().optional(),
          icon: z.string().optional().editor({ input: "icon" }),
          color: colorEnum.optional(),
        }),
        links: z.array(linkSchema),
        src: z.string().nonempty(),
        orientation: orientationEnum.optional(),
      }),
      ecologyintro: ecologyIntroSectionSchema.optional(),
      methods: z.array(methodSchema).optional(),
    }),
  }),
  forestryChartTexts: defineCollection({
    type: "data",
    source: "forestry/forestry-chart-texts.yml",
    schema: z.object({
      entries: z.array(forestryChartTextSchema),
    }),
  }),
  matsvampSkogsbruk: defineCollection({
    type: "data",
    source: "forestry/matsvamp-skogsbruk.yml",
    schema: z.object({
      entries: z.array(
        z.object({
          artkategori: z.string().nonempty(),
          frameworks: z.string().nonempty(),
          startskog: z.string().optional(),
          ["ålder"]: z.number(),
          klassning: z.number(),
        }),
      ),
    }),
  }),
  kgMatsvampSkogsbruk: defineCollection({
    type: "data",
    source: "forestry/kg-matsvamp-skogsbruk.yml",
    schema: z.object({
      entries: z.array(
        z.object({
          artkategori: z.string().nonempty(),
          frameworks: z.string().nonempty(),
          startskog: z.string().optional(),
          ["ålder"]: z.number(),
          klassning: z.number(),
        }),
      ),
    }),
  }),
  godaMatsvamparSkogsbruk: defineCollection({
    type: "data",
    source: "forestry/goda-matsvampar-skogsbruk.yml",
    schema: z.object({
      entries: z.array(
        z.object({
          artkategori: z.string().nonempty(),
          frameworks: z.string().nonempty(),
          startskog: z.string().optional(),
          ["ålder"]: z.number(),
          klassning: z.number(),
        }),
      ),
    }),
  }),
  signalRodlistadeSkogsbruk: defineCollection({
    type: "data",
    source: "forestry/signal-rodlistade-skogsbruk.yml",
    schema: z.object({
      entries: z.array(
        z.object({
          artkategori: z.string().nonempty(),
          frameworks: z.string().nonempty(),
          startskog: z.string().optional(),
          ["ålder"]: z.number(),
          klassning: z.number(),
        }),
      ),
    }),
  }),
  athelialesSkogsbruk: defineCollection({
    type: "data",
    source: "forestry/atheliales-skogsbruk.yml",
    schema: z.object({
      entries: z.array(
        z.object({
          artkategori: z.string().nonempty(),
          frameworks: z.string().nonempty(),
          startskog: z.string().optional(),
          ["ålder"]: z.number(),
          klassning: z.number(),
        }),
      ),
    }),
  }),
  boletalesSkogsbruk: defineCollection({
    type: "data",
    source: "forestry/boletales-skogsbruk.yml",
    schema: z.object({
      entries: z.array(
        z.object({
          artkategori: z.string().nonempty(),
          frameworks: z.string().nonempty(),
          startskog: z.string().optional(),
          ["ålder"]: z.number(),
          klassning: z.number(),
        }),
      ),
    }),
  }),
  cantharellalesSkogsbruk: defineCollection({
    type: "data",
    source: "forestry/cantharellales-skogsbruk.yml",
    schema: z.object({
      entries: z.array(
        z.object({
          artkategori: z.string().nonempty(),
          frameworks: z.string().nonempty(),
          startskog: z.string().optional(),
          ["ålder"]: z.number(),
          klassning: z.number(),
        }),
      ),
    }),
  }),
  spindlingarSkogsbruk: defineCollection({
    type: "data",
    source: "forestry/spindlingar-skogsbruk.yml",
    schema: z.object({
      entries: z.array(
        z.object({
          artkategori: z.string().nonempty(),
          frameworks: z.string().nonempty(),
          startskog: z.string().optional(),
          ["ålder"]: z.number(),
          klassning: z.number(),
        }),
      ),
    }),
  }),
  russulalesSkogsbruk: defineCollection({
    type: "data",
    source: "forestry/russulales-skogsbruk.yml",
    schema: z.object({
      entries: z.array(
        z.object({
          artkategori: z.string().nonempty(),
          frameworks: z.string().nonempty(),
          startskog: z.string().optional(),
          ["ålder"]: z.number(),
          klassning: z.number(),
        }),
      ),
    }),
  }),
  thelephoralesSkogsbruk: defineCollection({
    type: "data",
    source: "forestry/thelephorales-skogsbruk.yml",
    schema: z.object({
      entries: z.array(
        z.object({
          artkategori: z.string().nonempty(),
          frameworks: z.string().nonempty(),
          startskog: z.string().optional(),
          ["ålder"]: z.number(),
          klassning: z.number(),
        }),
      ),
    }),
  }),
  ascomycotaSkogsbruk: defineCollection({
    type: "data",
    source: "forestry/ascomycota-skogsbruk.yml",
    schema: z.object({
      entries: z.array(
        z.object({
          artkategori: z.string().nonempty(),
          frameworks: z.string().nonempty(),
          startskog: z.string().optional(),
          ["ålder"]: z.number(),
          klassning: z.number(),
        }),
      ),
    }),
  }),
  skogsbrukSvampar: defineCollection({
    type: "data",
    source: "forestry/skogssbruk_svampar.yml",
    schema: z.object({
      entries: z.array(
        z.object({
          startskog: z.string().nonempty(),
          metod: z.string().nonempty(),
          ["ålder"]: numericStringSchema,
          ["Alla matsvampar"]: numericStringSchema.optional(),
          ["Goda matsvampar"]: numericStringSchema.optional(),
          ["Signal + rödlistade"]: numericStringSchema.optional(),
          Atheliales: numericStringSchema.optional(),
          Boletales: numericStringSchema.optional(),
          Cantharellales: numericStringSchema.optional(),
          Cortinariaceae: numericStringSchema.optional(),
          Russulales: numericStringSchema.optional(),
          Thelephorales: numericStringSchema.optional(),
          Ascomyceter: numericStringSchema.optional(),
        }),
      ),
    }),
  }),
  svampgrupperRelativeSkogsbruk: defineCollection({
    type: "data",
    source: "forestry/svampgrupper-relative-skogsbruk.yml",
    schema: z.object({
      entries: z.array(
        z.object({
          ["ålder"]: numericStringSchema,
          Atheliales: numericStringSchema.optional(),
          Boletales: numericStringSchema.optional(),
          Cantharellales: numericStringSchema.optional(),
          Cortinariaceae: numericStringSchema.optional(),
          Russulales: numericStringSchema.optional(),
          Thelephorales: numericStringSchema.optional(),
          Ascomyceter: numericStringSchema.optional(),
        }),
      ),
    }),
  }),
  totalSvamparSkogsbruk: defineCollection({
    type: "data",
    source: "forestry/total-svampar-skogsbruk.yml",
    schema: z.object({
      entries: z.array(
        z.object({
          artkategori: z.string().nonempty(),
          frameworks: z.string().nonempty(),
          ["ålder"]: z.number(),
          klassning: z.number(),
        }),
      ),
    }),
  }),
  blog: defineCollection({
    source: "3.blog.yml",
    type: "data",
    schema: sectionSchema,
  }),
  forestryTimelines: defineCollection({
    type: "data",
    source: "timelines/**/*.yml",
    schema: forestryTimelineSchema,
  }),
  overlays: defineCollection({
    type: "data",
    source: "overlays/*.yml",
    schema: z.object({
      title: z.string().optional(),
      entries: z.array(z.record(z.any())),
    }),
  }),
};
