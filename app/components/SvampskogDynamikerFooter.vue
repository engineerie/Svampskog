<template>
     
        <UContainer>
                              <h1 class="text-3xl font-semibold leading-loose">Dynamiker</h1>

          <div class="flex gap-4 pt-2">
            <!-- Kolumn 1 -->
            <div class="flex-1 flex flex-col gap-4">
              <template v-for="note in col1List" :key="note.id">
                 <UCollapsible class="border border-neutral-200 dark:border-neutral-700 rounded-xl  bg-white dark:bg-neutral-900
                              " >
                  <UButton
                    class="group p-4 pb-4 cursor-pointer"
                    :label="note.title"
                    color="neutral"
                    variant="naked"
                    trailing-icon="i-lucide-chevron-down"
                    size="xl"
                    :ui="{
                      trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200'
                    }"
                    block
                  />
                  <!-- Content: hela beskrivningen -->
                  <template #content>
                      <p class="text-md  font-medium text-neutral-500 dark:text-neutral-300 px-4 pt-0 pb-4">
                        {{ note.text }}
                      </p>
                  </template>
                </UCollapsible>
              </template>
            </div>

            <!-- Kolumn 2 -->
            <div class="flex-1 flex flex-col gap-4">
              <template v-for="note in col2List" :key="note.id">
                  <UCollapsible class="border border-neutral-200 dark:border-neutral-700 rounded-xl  bg-white dark:bg-neutral-900
                              " >
                  <UButton
                    class="group p-4 pb-4 cursor-pointer"
                    :label="note.title"
                    color="neutral"
                    variant="naked"
                    trailing-icon="i-lucide-chevron-down"
                    size="xl"
                    :ui="{
                      trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200'
                    }"
                    block
                  />
                  <template #content>
               
                      <p class="text-md  font-medium text-neutral-500 dark:text-neutral-300 px-4 pt-0 pb-4">
                        {{ note.text }}
                      </p>
                 
                  </template>
                </UCollapsible>
              </template>
            </div>

            <!-- Kolumn 3 -->
            <div class="flex-1 flex flex-col gap-4">
              <template v-for="note in col3List" :key="note.id">
                  <UCollapsible class="border border-neutral-200 dark:border-neutral-700 rounded-xl  bg-white dark:bg-neutral-900
                              " >
                  <UButton
                    class="group p-4 pb-4 cursor-pointer"
                    :label="note.title"
                    color="neutral"
                    variant="naked"
                    trailing-icon="i-lucide-chevron-down"
                    size="xl"
                    :ui="{
                      trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200'
                    }"
                    block
                  />
                  <template #content>
                  
                      <p class="text-md  font-medium text-neutral-500 dark:text-neutral-300 px-4 pt-0 pb-4">
                        {{ note.text }}
                      </p>
                   
                  </template>
                </UCollapsible>
              </template>
            </div>

            <!-- Kolumn 4 -->
            <div class="flex-1 flex flex-col gap-4">
              <template v-for="note in col4List" :key="note.id">
                <UCollapsible class="border border-neutral-200 dark:border-neutral-700 rounded-xl  bg-white dark:bg-neutral-900
                              " >
               
                             <UButton
      class="group p-4 pb-4 cursor-pointer"
      :label="note.title"
      color="neutral"
      variant="naked"
      trailing-icon="i-lucide-chevron-down"
      size="xl"
      :ui="{
        trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200'
      }"
      block
    />
                     
                  
                  <template #content>
                  
                      <p class="text-md  font-medium text-neutral-500 dark:text-neutral-300 px-4 pt-0 pb-4 ">
                        {{ note.text }}
                      </p>
            
                  </template>
                </UCollapsible>
              </template>
            </div>
          </div>
        </UContainer>
    
</template>

<script setup>
import annotations from 'public/annotations.json'

const annotationsList = annotations.annotations

// Dela upp i fyra kolumner
const col1List = []
const col2List = []
const col3List = []
const col4List = []

annotationsList.forEach((note, idx) => {
  const mod = idx % 4
  if (mod === 0) col1List.push(note)
  else if (mod === 1) col2List.push(note)
  else if (mod === 2) col3List.push(note)
  else col4List.push(note)
})

</script>