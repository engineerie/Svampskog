<script setup lang="ts">

const route = useRoute()

const items = computed(() => [
  {
    label: 'Svampar',
    description: 'Vilka arter finns i olika skogar.',
    to: '/mykorrhizasvampar',
    active: route.path.startsWith('/mykorrhizasvampar'),
  },
  {
    label: 'Skogsskötsel',
    description: 'Hur skogsskötsel påverkar svampar.',
    to: '/skogsskotsel',
    active: route.path.startsWith('/skogsskotsel'),
  },
  // {
  //   label: 'Om projektet',
  //   description: 'Information om bakgrund och syfte.',
  //   to: '/info',
  //   active: route.path.startsWith('/info'),
  //   children: [
  //   ]
  // },
  // {
  //   label: 'Dokumentation',
  //   description: 'Manual och underlag.',
  //   to: '/svampardocs'
  // },
])

const itemsright = computed(() => [
  {
    label: 'Om projektet',
    description: 'Information om bakgrund och syfte.',
    to: '/info',
    active: route.path.startsWith('/info'),
    children: [
    ]
  }
])

</script>

<template>
  <UHeader mode="modal" class="bg-white border-muted" :toggle="{
    size: 'xl',
  }">
    <template #left>
      <NuxtLink to="/" class="text-2xl font-semibold flex items-center ">
        <NuxtImg src="/images/logo/slu_logo_webb.png" :width="50" :height="50" class="size-8 mr-3" />
        <h1 class="text-2xl font-light">|&nbsp; Svampskog</h1>
      </NuxtLink>
    </template>

    <UNavigationMenu :items="items" variant="link" color="primary"
      :ui="{ link: 'text-md hover:bg-neutral-50 rounded', item: 'mx-0.5' }" class="hidden lg:flex " />

    <template #right>
      <UNavigationMenu :items="itemsright" variant="pill" color="neutral"
        :ui="{ link: 'text-md hover:bg-neutral-50 rounded', item: 'mx-0.5' }" class="hidden lg:flex " />
    </template>

    <template #body>
      <UNavigationMenu :items="items" orientation="vertical" color="neutral" variant="pill"
        :ui="{ link: 'text-3xl/10' }" />
    </template>
  </UHeader>
</template>
