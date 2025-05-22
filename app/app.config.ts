export default defineAppConfig({
  ui: {
    badge: {
      compoundVariants: [
        {
          color: 'time',
          variant: 'subtle',
          class: 'bg-time-50 text-(--ui-time) dark:bg-time-950/80 ring ring-inset ring-(--ui-time)/25'
        },
        {
          color: 'signal',
          variant: 'subtle',
          class: 'bg-signal-50 text-(--ui-signal) dark:bg-signal-950/80 ring ring-inset ring-(--ui-signal)/25'
        },
        {
          color: 'error',
          variant: 'subtle',
          class: 'bg-error-50 text-(--ui-error) dark:bg-error-950/80 ring ring-inset ring-(--ui-error)/25'
        },
        {
          color: 'warning',
          variant: 'subtle',
          class: 'bg-warning-50 dark:bg-warning-950/80 text-(--ui-warning) ring ring-inset ring-(--ui-warning)/25'
        },
        {
          color: 'poison',
          variant: 'subtle',
          class: 'bg-poison-50 text-(--ui-poison) dark:bg-poison-950/80 ring ring-inset ring-(--ui-poison)/25'
        },
        {
          color: 'kalkmark',
          variant: 'subtle',
          class: 'bg-kalkmark-50 text-(--ui-kalkmark) dark:bg-kalkmark-950/80 ring ring-inset ring-(--ui-kalkmark)/25'
        },
        {
          color: 'vanligmark',
          variant: 'subtle',
          class: 'bg-vanligmark-50 text-(--ui-vanligmark) dark:bg-vanligmark-950/80 ring ring-inset ring-(--ui-vanligmark)/25'
        },
      ],
    },
    colors: {
      primary: "green",
      neutral: "neutral",
      secondary: "violet",
      tertiary: "amber",
      poison: "lime",
      signal: "teal",
      kalkmark: "slate",
      vanligmark: "emerald",
      time: "orange",
    },

  },
  uiPro: {

    pageHero: {
      slots: {
        links: ' flex'
      },
    }, 
  }
});

