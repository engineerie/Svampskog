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
  icon: z.string().optional(),
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

const featureItemSchema = z.object({
  ...baseSchema,
  icon: z.string().nonempty(),
});

const badgeSchema = z.object({
  label: z.string().nonempty(),
  color: colorEnum.optional(),
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
  icon: z.string().optional(),
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
  features: z.array(featureItemSchema),
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
    type: "data",
    schema: z.object({
      title: z.string().nonempty(),
      description: z.string().nonempty(),
      hero: sectionSchema.extend({
        headline: z.object({
          label: z.string().optional(),
          to: z.string().optional(),
          icon: z.string().optional(),
          color: colorEnum.optional(),
        }),
        links: z.array(linkSchema),
      }),
      sections: z.array(
        sectionSchema.extend({
          id: z.string().nonempty(),
          src: z.string().nonempty(),
          orientation: orientationEnum.optional(),
          features: z.array(featureItemSchema),
          links: z.array(linkSchema),
          reverse: z.boolean().optional(),
        }),
      ),
      press: pressSectionSchema.optional(),
      timeline: timelineSectionSchema.optional(),
      financing: financingSchema.optional(),
    }),
  }),
  blog: defineCollection({
    source: "3.blog.yml",
    type: "data",
    schema: sectionSchema,
  }),
};
