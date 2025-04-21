<script setup lang="ts">
const columns = [{
  label: 'Svampskog',
  children: [{
    label: 'Mykorrhizasvamp'
  }, {
    label: 'Skogsskötsel'
  }, {
    label: 'Svampkunskap'
  }]
}, {
  label: 'Dokumentation',
  children: [{
    label: 'Guide'
  }, {
    label: 'Definitioner'
  }, {
    label: 'Källor'
  }]
}, {
  label: 'Om projektet',
  children: [{
    label: 'Bakgrund & syfte'
  }, {
    label: 'Blog'
  }, {
    label: 'Kommande'
  }, {
    label: 'Kontakt'
  }]
}]

const toast = useToast()

const email = ref('')
const loading = ref(false)

function onSubmit() {
  loading.value = true

  toast.add({
    title: 'Subscribed!',
    description: 'You\'ve been subscribed to our newsletter.'
  })
}
</script>

<template>
  <USeparator

    class="h-px mt-12"
  />
  <UFooter :ui="{ top: 'border-b border-[var(--ui-border)]' }">
    <!-- <template #top>
      <UContainer>
        <UFooterColumns :columns="columns">
          <template #right>
            <form @submit.prevent="onSubmit">
              <UFormField
                name="email"
                label="Subscribe to our newsletter"
                size="lg"
              >
                <UInput
                  v-model="email"
                  type="email"
                  class="w-full"
                  placeholder="Enter your email"
                >
                  <template #trailing>
                    <UButton
                      type="submit"
                      size="xs"
                      color="neutral"
                      label="Subscribe"
                    />
                  </template>
                </UInput>
              </UFormField>
            </form>
          </template>
        </UFooterColumns>
      </UContainer>
    </template> -->

    <template #left>
      <p class="text-(--ui-text-muted) text-sm">
        Copyright © {{ new Date().getFullYear() }}. All rights reserved.
      </p>
    </template>

    <template #right>
      <!-- <UColorModeButton /> -->

      <!-- <UButton
        to="https://github.com/nuxt-ui-pro/saas"
        target="_blank"
        icon="i-simple-icons-github"
        aria-label="GitHub"
        color="neutral"
        variant="ghost"
      /> -->
    </template>
  </UFooter>
</template>
