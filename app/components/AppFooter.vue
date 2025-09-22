<template>
  <USeparator />
  <UFooter :ui="{ top: 'border-b border-[var(--ui-border)]' }">
    <template #left>
      <p class="text-(--ui-text-muted) text-sm">
        Copyright © {{ new Date().getFullYear() }}.
      </p>
    </template>
  </UFooter>
</template>
