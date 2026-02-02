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
  description: z.string().optional(),
  descriptionParagraphs: z.array(z.string()).optional(),
  descriptionsvamp: z.string().optional(),
  descriptionsvampParagraphs: z.array(z.string()).optional(),
  descriptionmatsvampParagraphs: z.array(z.string()).optional(),
  descriptionnaturvårdssvampParagraphs: z.array(z.string()).optional(),
  type: z.string().optional(),
  icon: z.string().optional(),
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

const overlayTextSchema = z.object({
  key: z.string().nonempty(),
  title: z.string().nonempty(),
  description: z.string().nonempty(),
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
        mykorrhiza: z
          .object({
            title: z.string().nonempty(),
            body: z.string().nonempty(),
          })
          .optional(),
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
      underlagbild: z.string().nonempty(),
      underlagSections: z
        .array(
          z.object({
            title: z.string().optional(),
            paragraphs: z.array(z.string()).optional(),
            content: z.string().optional(),
          }),
        )
        .optional(),
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
      underlagbild: z.string().nonempty(),
      underlagSections: z
        .array(
          z.object({
            title: z.string().optional(),
            paragraphs: z.array(z.string()).optional(),
            content: z.string().optional(),
          }),
        )
        .optional(),
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
    }),
  }),
  skotselmetoder: defineCollection({
    type: "data",
    source: "skogsskotsel/skotselmetoder.yml",
    schema: z.object({
      methods: z.array(methodSchema),
    }),
  }),
  forestryFrameworks: defineCollection({
    type: "page",
    source: "skogsskotsel/frameworks/**/*",
    schema: z.object({
      title: z.string().nonempty(),
      description: z.string().nonempty(),
      frameworkId: z.string().nonempty(),
      image: z.string().nonempty(),
      shortdescription: z.string().optional(),
      type: z.string().optional(),
      heroTitle: z.string().optional(),
      heroDescription: z.string().optional(),
    }),
  }),
  forestryChartTexts: defineCollection({
    type: "data",
    source: "diagram/forestry-chart-texts.yml",
    schema: z.object({
      entries: z.array(forestryChartTextSchema),
    }),
  }),
  matsvampSkogsbruk: defineCollection({
    type: "data",
    source: "diagram/matsvamp-skogsbruk.yml",
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
    source: "diagram/kg-matsvamp-skogsbruk.yml",
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
    source: "diagram/goda-matsvampar-skogsbruk.yml",
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
    source: "diagram/signal-rodlistade-skogsbruk.yml",
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
    source: "diagram/atheliales-skogsbruk.yml",
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
    source: "diagram/boletales-skogsbruk.yml",
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
    source: "diagram/cantharellales-skogsbruk.yml",
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
    source: "diagram/spindlingar-skogsbruk.yml",
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
    source: "diagram/russulales-skogsbruk.yml",
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
    source: "diagram/thelephorales-skogsbruk.yml",
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
    source: "diagram/ascomycota-skogsbruk.yml",
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
    source: "diagram/skogssbruk_svampar.yml",
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
    source: "diagram/svampgrupper-relative-skogsbruk.yml",
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
    source: "diagram/total-svampar-skogsbruk.yml",
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
    source: "skogsskotsel/tidslinjer.yml",
    schema: forestryTimelineSchema,
  }),
  overlayTexts: defineCollection({
    type: "date",
    source: "skogsskotsel/overlays/texts/*.md",
    schema: z
      .object({
        key: z.string().nonempty(),
        title: z.string().nonempty(),
        description: z.string().nonempty(),
        images: z.array(z.string()).optional(),
        imageDescriptions: z.array(z.string()).optional(),
        image: z.string().optional(),
      })
      // Keep markdown body and other metadata even though the schema only covers frontmatter
      .passthrough(),
  }),
  overlays: defineCollection({
    type: "data",
    source: "skogsskotsel/overlays/points/*.yml",
    schema: z.object({
      title: z.string().optional(),
      entries: z.array(z.record(z.any())),
    }),
  }),
};
