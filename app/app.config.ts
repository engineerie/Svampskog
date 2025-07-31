export default defineAppConfig({
  ui: {
    
    // table: {
    //   slots: {
    //     root: 'relative overflow-auto',
    //     base: 'min-w-full overflow-clip',
    //     caption: 'sr-only',
    //     thead: 'relative [&>tr]:after:absolute [&>tr]:after:inset-x-0 [&>tr]:after:bottom-0 [&>tr]:after:h-px [&>tr]:after:bg-(--ui-border-accented)',
    //     tbody: ' [&>tr]:data-[selectable=true]:hover:bg-elevated/50 [&>tr]:data-[selectable=true]:focus-visible:outline-primary',
    //     tr: 'data-[selected=true]:bg-elevated/50',
    //     th: 'px-4 py-3.5 text-sm text-highlighted text-left rtl:text-right font-semibold [&:has([role=checkbox])]:pe-0',
    //     td: 'p-4 text-sm text-muted whitespace-nowrap [&:has([role=checkbox])]:pe-0',
    //     empty: 'py-6 text-center text-sm text-muted',
    //     loading: 'py-6 text-center'
    //   },
    // },
  
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
pageHeader: {
  slots: {
    title: 'font-semibold'
  }
},
    pageHero: {
      slots: {
        title: 'font-semibold',
        links: ' flex'
      },
    }, 
    pageSection: {
      slots: {
        container: 'flex flex-col-reverse sm:flex-col lg:grid py-16 sm:py-24 lg:py-32 gap-8 sm:gap-16',
        title: 'font-semibold'
      }
    },
    blogPost: {
      variants: {
        to: {
          true: {
            root: 'transition hover:ring-1.5 hover:ring-accented hover:ring-neutral-300',
            image: 'transform transition-transform duration-200 group-hover/blog-post:scale-100',
          }
        }
      }
    }
  }
});
