<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const route = useRoute()

const { data: page } = await useAsyncData('svampkunskap', () => queryCollection('blog').first())
const { data: posts } = await useAsyncData(route.path, () => queryCollection('posts').all())

const selectedCategory = ref('all')

const normalizedPosts = computed(() => {
  return (posts.value ?? []).map((post) => {
    const category = post.category || post.badge?.label || 'Övrigt'
    return {
      ...post,
      category,
      badge: {
        ...(post.badge ?? {}),
        label: category
      }
    }
  })
})

const categories = computed(() => {
  const unique = new Set<string>()
  normalizedPosts.value.forEach((post) => {
    if (post.category) unique.add(post.category)
  })
  return Array.from(unique)
})

const categoryFilters = computed(() => ['all', ...categories.value])

watch(categories, (list) => {
  if (selectedCategory.value !== 'all' && !list.includes(selectedCategory.value)) {
    selectedCategory.value = 'all'
  }
})

const filteredPosts = computed(() => {
  if (selectedCategory.value === 'all') {
    return normalizedPosts.value
  }
  return normalizedPosts.value.filter((post) => post.category === selectedCategory.value)
})

useSeoMeta({
  title: page.value?.title,
  ogTitle: page.value?.title,
  description: page.value?.description,
  ogDescription: page.value?.description
})

defineOgImageComponent('Saas')
</script>

<template>
  <div class="bg-neutral-50 h-full">
    <UContainer>
      <UPageHeader :ui="{ root: 'border-b-0', container: 'lg:pt-12', title: 'sm:text-6xl', headline: 'text-neutral' }"
        v-bind="page" />

      <!-- <div v-if="categories.length" class="mb-12 mt-4 flex flex-wrap gap-2">
        <UButton v-for="category in categoryFilters" :key="category" :label="category === 'all' ? 'Alla' : category"
          color="neutral" :variant="selectedCategory === category ? 'soft' : 'ghost'"
          :aria-pressed="selectedCategory === category" class="rounded-lg" @click="selectedCategory = category" />
      </div> -->

      <UPageBody>
        <UBlogPosts v-if="filteredPosts.length">
          <Motion v-for="(post, index) in filteredPosts" :key="post._path || index" class="relative" :initial="{
            scale: 1,
            transform: 'translateY(20px)',
            opacity: 0,
          }" :animate="{
              scale: 1,
              transform: 'translateY(0px)',
              opacity: 1,
            }" :transition="{
              duration: 0.2,
              delay: 0.2 + 0.1 * index
            }">
            <UBlogPost :title="post.title" :to="post.path" :description="post.description" :image="post.image"
              :class="[]" variant="naked" :ui="{
                description: 'line-clamp-2', header: 'rounded-xl border border-1 border-muted/50 shadow-none', root: 'rounded-md', body: 'px-0 sm:px-2'
              }" />
          </Motion>
        </UBlogPosts>
        <div v-else class="py-12 text-center text-muted-500">
          Inga artiklar matchar kategorin just nu.
        </div>
      </UPageBody>
    </UContainer>
  </div>

</template>
