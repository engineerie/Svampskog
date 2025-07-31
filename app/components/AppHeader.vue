<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'

const navigation = inject<Ref<ContentNavigationItem[]>>('svamparnavigation')
const route = useRoute()

const items = computed(() => [
  // {
  //   label: 'Svampskog',
  //   children: [
  {
    label: 'Svampar',
    description: 'Vilka arter finns i olika skogar.',
    icon: 'i-lineicons-mushroom-1',
    to: '/mykorrhizasvampar',
    active: route.path.startsWith('/mykorrhizasvampar'),
      children: [
      {
        label: 'Sök på miljö',
        description: 'Se vilka arter som kan finnas i olika skogar.',
        icon: 'i-lineicons-mushroom-1',
        to: '/mykorrhizasvampar/start',
      },
      {
        label: 'Dokumentation',
        description: 'Manual och underlag.',
        icon: 'i-heroicons-clipboard-document-list',
        to: '/svampardocs'
      },
    ]
  },
  {
    label: 'Skogsskötsel',
    description: 'Hur skogsskötsel påverkar svampar.',
    icon: 'i-hugeicons-tree-06',
    to: '/skogsskotsel',
    active: route.path.startsWith('/skogsskotsel'),

    children: [
      {
        label: 'Skötselmetoder',
        description: 'Läs om olika skogsskötsel.',
        icon: 'mdi:saw-blade',
        to: '/skogsskotsel/skotselmetoder'
      },
      // {
      //   label: 'Interaktiv modell',
      //   description: 'Se hur skogsskötsel påverkar i en modell.',
      //   icon: 'i-material-symbols-interactive-space-outline-rounded',
      //   to: '/skogsskotsel/modell'
      // },
      // {
      //   label: 'Diagram och staplar',
      //   description: 'Utforska data för svampar och skogsbruk',
      //   icon: 'i-carbon-chart-line-smooth',
      //   to: '/skogsskotsel/diagram'
      // },
      {
        label: 'Dokumentation',
        description: 'Manual och underlag.',
        icon: 'i-heroicons-clipboard-document-list',
        to: '/skogsskotsel/dokumentation'
      },
    ]
  },
  // {
  //   label: 'Svampkunskap',
  //   description: 'Läs om hur svampar lever i marken.',
  //   icon: 'i-heroicons-book-open',

  // },
  //   ]
  // },
  // {
  //   label: 'Dokumentation',
  //   description: 'Hur du bäst använder appen.',
  //   to: '/docs',
  //   children: [
  //     {
  //       label: 'Guide',
  //       description: 'Hur du bäst använder appen.',
  //       icon: 'i-lineicons-direction',
  //       to: '/docs'
  //     },
  //     {
  //       label: 'Definitioner',
  //       description: 'Hur olika kategorier definieras.',
  //       icon: 'i-heroicons-clipboard-document-list',
  //       to: '/docs'
  //     },
  //     {
  //       label: 'Källor',
  //       description: 'Var informationen kommer ifrån.',
  //       icon: 'i-heroicons-archive-box',
  //       to: '/docs'
  //     }
  //   ]
  // },
  {
    label: 'Om projektet',
    description: 'Information om bakgrund och syfte.',
    to: '/info',
    active: route.path.startsWith('/info'),
    children: [
      {
        label: 'Bakgrund & Syfte',
        description: 'Varför svampskog har utvecklats.',
        icon: 'i-heroicons-information-circle',
        to: '/info',
      },
      // {
      //   label: 'Nyheter',
      //   description: 'Pressklipp och senaste uppdateringarna.',
      //   icon: 'i-heroicons-newspaper',
      //   to: '/blog'
      // },
      // {
      //   label: 'Kommande',
      //   description: 'Uppdateringar som planeras.',
      //   icon: 'i-lsicon-path-filled',
      //   to: '/info/kommande'
      // },
      {
        label: 'Kontakt',
        description: 'För frågor eller förslag.',
        icon: 'i-heroicons-chat-bubble-left-ellipsis',
        to: '/kontakt',
      }
    ]
  }
])
</script>

<template>
  <UHeader mode="modal" class="bg-white dark:bg-black">
    <template #left>
      <!-- <NuxtLink to="https://www.slu.se/" target="blank"> -->
        <!-- </NuxtLink> -->
      
      

      <NuxtLink to="/" class="text-2xl font-semibold flex items-center ">
        <UColorModeImage light="/images/slu_logo_webb.png" dark="/images/slu_logo_white_webb.png" :width="50" :height="50"
        class="size-8 mr-3" />
        <h1 class="text-2xl font-light">|&nbsp; Svampskog</h1>
        <!-- <UBadge size="xl" color="neutral" variant="solid">Svampskog</UBadge> -->
        <!-- <span class=" ml-2">Svamp</span>
        skog -->
      </NuxtLink>

    </template>

    <UNavigationMenu :items="items" variant="pill" />

    <template #right>
      <UColorModeButton />
      <!-- <UButton label="Sign in" color="neutral" variant="ghost" to="/login" />
      <UButton label="Sign up" color="neutral" trailing-icon="i-lucide-arrow-right" class="hidden lg:flex"
        to="/signup" /> -->
      <!-- <UContentSearchButton label="Sök..." variant="outline" class="w-48"></UContentSearchButton> -->
    </template>

    <template #body>
      <UNavigationMenu :items="items" orientation="vertical" class="-mx-2.5" />
     <USeparator class="my-2" label="Svampar dokumentation" type="dashed"/>
      <UContentNavigation :navigation="navigation" highlight />
 
      <!-- <USeparator class="my-6" /> -->
      <!-- 
      <UButton label="Sign in" color="neutral" variant="subtle" to="/login" block class="mb-3" />
      <UButton label="Sign up" color="neutral" to="/signup" block /> -->
    </template>
  </UHeader>
</template>
