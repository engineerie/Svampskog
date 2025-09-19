<script setup lang="ts">
const route = useRoute()

const { data: page } = await useAsyncData('blog', () => queryCollection('blog').first())
const { data: posts } = await useAsyncData(route.path, () => queryCollection('posts').all())

useSeoMeta({
  title: page.value?.title,
  ogTitle: page.value?.title,
  description: page.value?.description,
  ogDescription: page.value?.description
})

defineOgImageComponent('Saas')
</script>

<template>
  <div class="bg-neutral-50">
    <UContainer>
      <UPageHero :ui="{ container: 'lg:py-24', title: 'sm:text-6xl', headline: 'text-neutral' }" v-bind="page"
        class="py-[50px]" />


      <UPageBody>
        <UBlogPosts>
          <UBlogPost v-for="(post, index) in posts" :key="index" :to="post.path" :title="post.title"
            :description="post.description" :badge="post.badge" :class="[]" variant="outline" :ui="{
              description: 'line-clamp-2'
            }" />
        </UBlogPosts>
      </UPageBody>
    </UContainer>
  </div>

</template>
