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

const carouselItemSchema = z.object({
  title: z.string().nonempty(),
  description: z.string().nonempty(),
  img: z.string().optional(),
  specialBento: z.boolean().optional(),
  bentoImgs: z.array(z.string()).optional(),
  specialGrid: z.boolean().optional(),
  gridTop: z.string().optional(),
  gridRest: z.string().optional(),
  gridCols: z.number().optional(),
  gridRows: z.number().optional(),
  noBorder: z.boolean().optional(),
});

const carouselSectionSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  items: z.array(carouselItemSchema),
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
      badge: z.object({ label: z.string().nonempty() }),
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
      carousel: carouselSectionSchema.optional(),
      gallery: gallerySectionSchema.optional(),
    }),
  }),
  svamparSkogsbruk: defineCollection({
    type: "data",
    source: "forestry/svampar-skogsbruk.yml",
    schema: z.object({
      entries: z.array(z.object({
        artkategori: z.string().nonempty(),
        frameworks: z.string().nonempty(),
        startskog: z.string().optional(),
        ['ålder']: z.number(),
        klassning: z.number(),
      })),
    }),
  }),
  totalSvamparSkogsbruk: defineCollection({
    type: "data",
    source: "forestry/total-svampar-skogsbruk.yml",
    schema: z.object({
      entries: z.array(z.object({
        artkategori: z.string().nonempty(),
        frameworks: z.string().nonempty(),
        ['ålder']: z.number(),
        klassning: z.number(),
      })),
    }),
  }),
  skogsskotsel: defineCollection({
    type: "page",
    source: "2.skogsskotsel.yml",
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
        src: z.string().nonempty(),
        orientation: orientationEnum.optional(),
      }),
      carousel: carouselSectionSchema.optional(),
      methods: z.array(methodSchema).optional(),
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
};
