<script setup lang="ts">
import { computed } from 'vue'
definePageMeta({
  layout: 'svamp-kunskap',
})


import type { ContentNavigationItem } from '@nuxt/content'

const navigation = inject<Ref<ContentNavigationItem[]>>('blognavigation')

const route = useRoute()

const { data: post } = await useAsyncData(route.path, () => queryCollection('posts').path(route.path).first())
if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Post not found', fatal: true })
}

const { data: surround } = await useAsyncData(`${route.path}-surround`, () => {
  return queryCollectionItemSurroundings('posts', route.path, {
    fields: ['description']
  })
})

const postBadge = computed(() => {
  const overrides = post.value?.badge ? { ...post.value.badge } : {}
  const label = post.value?.category ?? overrides.label
  if (!label) {
    return null
  }
  return {
    ...overrides,
    label,
  }
})

const title = post.value.title
const description = post.value.description

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description
})

if (post.value.image?.src) {
  defineOgImage({
    url: post.value.image.src
  })
} else {
  defineOgImageComponent('Saas', {
    headline: 'Svampkunskap'
  })
}
</script>

<template>
  <UContainer v-if="post">
    <UPage>
      <template #left>
        <UPageAside />
      </template>
      <template #right>
        <UPageAside />

      </template>
      <UPageHero :title="post.title"
        :ui="{ title: 'text-4xl sm:text-6xl text-pretty tracking-tight', wrapper: 'text-left', container: 'lg:pb-20 pb-12 lg:pt-28 px-0 sm:px-0 md:px-0 lg:px-0' }">
        <NuxtImg :src="post.image.src" class="w-full rounded-lg" />
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
      </UPageHero>
      <USeparator class="lg:pb-8 " />
    </UPage>


    <UPage>

      <UPageBody>
        <ContentRenderer v-if="post" :value="post" />

        <USeparator v-if="surround?.length" />

        <UContentSurround :surround="surround" />
      </UPageBody>

      <template v-if="post?.body?.toc?.links?.length" #right>
        <UContentToc :links="post.body.toc.links" title="På den här sidan" />
      </template>
      <template #left>
        <UPageAside>

          <UContentNavigation :navigation="navigation" variant="pill" />
        </UPageAside>
      </template>
    </UPage>
  </UContainer>
</template>
