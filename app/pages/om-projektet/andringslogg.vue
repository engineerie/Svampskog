<script setup lang="ts">
type ChangelogVersion = {
  id?: string
  path?: string
  title: string
  description: string
  body?: Record<string, any>
  date?: string
  image?: string | {
    src: string
    alt?: string
  }
  badge?: string | {
    label: string
    color?: string
    variant?: 'solid' | 'outline' | 'subtle' | 'soft' | 'ghost' | 'link'
  }
}

definePageMeta({
  layout: 'docs'
})

const { data: versions } = await useAsyncData<ChangelogVersion[]>('om-projektet-andringslogg', async () => {
  const docs = await queryCollection('information').all()

  return docs
    .filter(doc => String(doc.path || '').startsWith('/om-projektet/andringslogg/'))
    .map(doc => ({
      id: doc.id,
      path: doc.path,
      title: doc.title,
      description: doc.description,
      body: doc.body,
      date: 'date' in doc ? doc.date : undefined,
      image: 'image' in doc ? doc.image : undefined,
      badge: 'badge' in doc ? doc.badge : undefined
    }))
    .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')))
})

useSeoMeta({
  title: 'Ändringslogg',
  ogTitle: 'Ändringslogg',
  description: 'Senaste uppdateringarna i Svampskog.',
  ogDescription: 'Senaste uppdateringarna i Svampskog.'
})

defineOgImageComponent('Saas')
</script>

<template>
  <UPageHeader title="Ändringslogg" :ui="{ root: 'border-none', title: 'text-4xl sm:text-5xl' }" />
  <UChangelogVersions as="main" :indicator-motion="false" :ui="{
    root: 'mt-8 sm:mt-12 lg:mt-18 mb-3 pb-8',
  }">
    <UChangelogVersion v-for="(version, index) in versions" :key="version.id || version.path" :image="version.image"
      :title="version.title" :date="version.date" :ui="{
        imageWrapper: 'ring ring-muted',
        image: 'opacity-50',
        root: 'flex items-start',
        container: 'w-full max-w-lg lg:ml-40 mr-auto',
        header: 'border-none pb-4 ',
        title: 'text-3xl',
        dotInner: index === 0 ? 'bg-primary' : 'bg-neutral-400',
        // date: 'text-xs/9 text-highlighted font-mono',
        indicator: 'sticky top-(--ui-header-height) flex -mt-12 pt-12 hidden lg:flex'
      }">
      <template #body>
        <ContentRenderer v-if="version.body" :value="version" />
      </template>
    </UChangelogVersion>
  </UChangelogVersions>
</template>
