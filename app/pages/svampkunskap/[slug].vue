<script setup lang="ts">
import { computed } from 'vue'
definePageMeta({
  layout: 'svamp-kunskap',
})


import type { ContentNavigationItem } from '@nuxt/content'

const navigation = inject<Ref<ContentNavigationItem[]>>('blognavigation')

const route = useRoute()
const contentPath = route.path.replace(/\/+$/, '') || '/'

const { data: post } = await useAsyncData(
  `svampkunskap-post:${contentPath}`,
  () => queryCollection('posts').path(contentPath).first()
)
if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Post not found', fatal: true })
}

const { data: surround } = await useAsyncData(`svampkunskap-surround:${contentPath}`, () => {
  return queryCollectionItemSurroundings('posts', contentPath, {
    fields: ['description']
  })
})

const postBadge = computed(() => {
  const label = post.value?.category ?? (post.value?.badge as { label?: string } | undefined)?.label
  if (!label) {
    return null
  }
  return {
    label,
  }
})

const title = post.value.title
const description = post.value.description

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description,
  ogImage: post.value.image?.src
})

if (!post.value.image?.src) {
  defineOgImage('Saas', {
    title,
    description
  })
}
</script>

<template>
  <UContainer v-if="post">
    <UPage :ui="{ left: 'lg:col-span-1', right: 'lg:col-span-1', center: 'lg:col-span-8' }">
      <template #left>
        <div></div>
      </template>
      <template #right>
        <div></div>
      </template>

      <!-- <USeparator class="lg:pb-8 " /> -->
    </UPage>


    <UPage>

      <UPageBody>
        <UPageHeader :title="post.title"
          :ui="{ title: 'text-4xl sm:text-6xl text-pretty tracking-tight font-medium text-center ', wrapper: 'lg:flex-col', root: 'border-none mb-4' }">

          <!-- <div class="w-full rounded-lg bg-muted/50 ring-muted/50 ring flex item-center justify-center h-fit">
          <NuxtImg :src="post.image.src" class="h-100 w-full" />
        </div> -->
          <template #headline>
            <UBadge v-if="postBadge" v-bind="postBadge" color="neutral" variant="subtle" size="lg" />
            <!-- <span class="text-(--ui-text-muted)">&middot;</span> -->
            <!-- <time class="text-(--ui-text-muted)">{{ new Date(post.date).toLocaleDateString('en', { year: 'numeric', month: 'short', day: 'numeric' }) }}</time> -->
          </template>

          <!-- <div class="flex flex-wrap items-center gap-3 mt-4">
        <UButton
          v-for="(author, index) in post.authors"
          :key="index"
          :to="author.to"
          color="neutral"
          variant="subtle"
          target="_blank"
          size="sm"
        >
          <UAvatar
            v-bind="author.avatar"
            alt="Author avatar"
            size="2xs"
          />

          {{ author.name }}
        </UButton>
      </div> -->
        </UPageHeader>
        <ContentRenderer v-if="post" :value="post" />

        <USeparator v-if="surround?.length" />

        <UContentSurround :surround="surround" />
      </UPageBody>

      <template v-if="post?.body?.toc?.links?.length" #right>
        <UContentToc :links="post.body.toc.links" title="På den här sidan" highlight highlight-variant="circuit" />
      </template>
      <template #left>
        <UPageAside>
          <UButton to="/svampkunskap" label="Tillbaka till index" class="mb-4 w-full" size="md" color="neutral"
            variant="soft" icon="i-heroicons-arrow-left" />
          <UContentNavigation :navigation="navigation" variant="link" />
        </UPageAside>
      </template>
    </UPage>
  </UContainer>
</template>
