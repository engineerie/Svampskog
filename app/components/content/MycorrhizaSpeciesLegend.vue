<template>
  <div
    class="not-prose mb-3 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-lg  px-4 py-3 text-sm text-neutral-700  "
    role="list" aria-label="Teckenförklaring för mykorrhizaarter">
    <div class="flex items-center gap-2" role="listitem">
      <span class="legend-icon-stack" aria-hidden="true">
        <span v-for="index in 3" :key="index" class="legend-icon-wrap">
          <UIcon name="i-fluent-shape-organic-16-filled" class="legend-icon legend-icon--common" />
        </span>
      </span>
      <span>Vanliga arter</span>
    </div>

    <div class="flex items-center gap-2" role="listitem">
      <span class="legend-icon-stack" aria-hidden="true">
        <span class="legend-icon-wrap">
          <UIcon name="i-fluent-shape-organic-16-filled" class="legend-icon legend-icon--pink" />
        </span>
        <span class="legend-icon-wrap">
          <UIcon name="i-fluent-shape-organic-16-filled" class="legend-icon legend-icon--blue" />
        </span>
        <span class="legend-icon-wrap">
          <UIcon name="i-fluent-shape-organic-16-filled" class="legend-icon legend-icon--green" />
        </span>
        <span class="legend-icon-wrap">
          <UIcon name="i-fluent-shape-organic-16-filled" class="legend-icon legend-icon--beige" />
        </span>
      </span>
      <span>Mindre vanliga arter</span>
    </div>

    <div class="flex items-center gap-2" role="listitem">
      <span class="legend-icon-wrap" aria-hidden="true">
        <UIcon name="i-fluent-shape-organic-16-filled" class="legend-icon legend-icon--rare" />
      </span>
      <span>Sällsynt art</span>
    </div>
  </div>
</template>

<style scoped>
.legend-icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
}

.legend-icon-wrap {
  display: inline-flex;
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
  filter:
    drop-shadow(0 1px 2px rgb(0 0 0 / 24%)) drop-shadow(0 2px 4px rgb(0 0 0 / 12%));
}

.legend-icon--common {
  color: #c6c6c6;
}

.legend-icon--pink {
  color: #e398e7;
}

.legend-icon--blue {
  color: #9fd3e8;
}

.legend-icon--green {
  color: #b3df7d;
}

.legend-icon--beige {
  color: #ebc9a2;
}

.legend-icon--rare {
  color: #000;
}

.legend-icon-stack {
  display: flex;
  flex-shrink: 0;
}

.legend-icon-stack .legend-icon-wrap+.legend-icon-wrap {
  margin-left: -0.75rem;
}
</style>
