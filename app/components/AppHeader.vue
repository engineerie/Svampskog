<script setup lang="ts">
const route = useRoute()

const items = computed(() => [
  // {
  //   label: 'Svampskog',
  //   children: [
      {
        label: 'Svampar',
        description: 'Vilka arter finns i olika skogar.',
        icon: 'i-lineicons-mushroom-1',
        to: '/mykorrhizasvampar/start',
        // active: route.path.startsWith('/mykorrhizasvampar'),
      },
      {
        label: 'Skogsskötsel',
        description: 'Hur skogsskötsel påverkar svampar.',
        icon: 'i-hugeicons-tree-06',
      },
      // {
      //   label: 'Svampkunskap',
      //   description: 'Läs om hur svampar lever i marken.',
      //   icon: 'i-heroicons-book-open',

      // },
  //   ]
  // },
  {
    label: 'Dokumentation',
    description: 'Hur du bäst använder appen.',
    to: '/docs',
    // children: [
    //   {
    //     label: 'Guide',
    //     description: 'Hur du bäst använder appen.',
    //     icon: 'i-lineicons-direction',
    //     to: '/docs'
    //   },
    //   {
    //     label: 'Definitioner',
    //     description: 'Hur olika kategorier definieras.',
    //     icon: 'i-heroicons-clipboard-document-list',
    //     to: '/docs'
    //   },
    //   {
    //     label: 'Källor',
    //     description: 'Var informationen kommer ifrån.',
    //     icon: 'i-heroicons-archive-box',
    //     to: '/docs'
    //   }
    // ]
  },
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
      {
        label: 'Nyheter',
        description: 'Pressklipp och senaste uppdateringarna.',
        icon: 'i-heroicons-newspaper',
        to: '/blog'
      },
      {
        label: 'Kommande',
        description: 'Uppdateringar som planeras.',
        icon: 'i-lsicon-path-filled',
        to: '/info/kommande'
      },
      {
        label: 'Kontakt',
        description: 'Hör av dig med frågor eller förslag.',
        icon: 'i-heroicons-chat-bubble-left-ellipsis'
      }
    ]
  }
])
</script>

<template>
  <UHeader mode="drawer">
    <template #left>
      <NuxtLink to="/" class="text-2xl font-bold flex items-center ">
        <span class="text-primary-500 ml-3">Svamp</span>
        skog

 
      </NuxtLink>
   
    </template>

    <UNavigationMenu :items="items" variant="link" />

    <template #right>
      <UColorModeButton />
      <!-- <UButton label="Sign in" color="neutral" variant="ghost" to="/login" />
      <UButton label="Sign up" color="neutral" trailing-icon="i-lucide-arrow-right" class="hidden lg:flex"
        to="/signup" /> -->
      <!-- <UContentSearchButton label="Sök..." variant="outline" class="w-48"></UContentSearchButton> -->
    </template>

    <template #body>
      <UNavigationMenu :items="items" orientation="vertical" class="-mx-2.5" />

      <USeparator class="my-6" />

      <UButton label="Sign in" color="neutral" variant="subtle" to="/login" block class="mb-3" />
      <UButton label="Sign up" color="neutral" to="/signup" block />
    </template>
  </UHeader>
</template>
