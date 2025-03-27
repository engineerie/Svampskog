export default defineAppConfig({
  ui: {
    badge: {
      compoundVariants: [
        {
          color: 'signal',
          variant: 'subtle',
          class: 'bg-signal-50 text-(--ui-signal) ring ring-inset ring-(--ui-signal)/25'
        },
        {
          color: 'error',
          variant: 'subtle',
          class: 'bg-error-50 text-(--ui-error) ring ring-inset ring-(--ui-error)/25'
        },
        {
          color: 'warning',
          variant: 'subtle',
          class: 'bg-warning-50 text-(--ui-warning) ring ring-inset ring-(--ui-warning)/25'
        },
        {
          color: 'poison',
          variant: 'subtle',
          class: 'bg-poison-50 text-(--ui-poison) ring ring-inset ring-(--ui-poison)/25'
        },
        {
          color: 'kalkmark',
          variant: 'subtle',
          class: 'bg-kalkmark-50 text-(--ui-kalkmark) ring ring-inset ring-(--ui-kalkmark)/25'
        },
        {
          color: 'vanligmark',
          variant: 'subtle',
          class: 'bg-vanligmark-50 text-(--ui-vanligmark) ring ring-inset ring-(--ui-vanligmark)/25'
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

