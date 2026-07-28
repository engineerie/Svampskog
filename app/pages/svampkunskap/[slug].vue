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
      <UPageHero :title="post.title"
        :ui="{ title: 'text-4xl sm:text-6xl text-pretty tracking-tight font-medium', wrapper: 'text-center', container: 'lg:pb-14 pb-12 lg:pt-28 px-0 sm:px-0 md:px-0 lg:px-0 sm:gap-y-14' }">

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
      </UPageHero>
      <!-- <USeparator class="lg:pb-8 " /> -->
    </UPage>


    <UPage>

      <UPageBody>
        <ContentRenderer v-if="post" :value="post" />

        <USeparator v-if="surround?.length" />

        <UContentSurround :surround="surround" />
      </UPageBody>

      <template v-if="post?.body?.toc?.links?.length" #right>
        <UContentToc :links="post.body.toc.links" title="På den här sidan" highlight highlight-variant="circuit" />
      </template>
      <template #left>
        <UPageAside>

          <UContentNavigation :navigation="navigation" variant="pill" />
        </UPageAside>
      </template>
    </UPage>
  </UContainer>
</template>
