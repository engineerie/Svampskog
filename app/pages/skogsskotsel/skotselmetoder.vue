<template>
  <UContainer>
    <UPage>
      <!-- 1) Fem-kolumners-grid med skötselmetoder (oförändrat) -->
      <div class="grid grid-cols-5 gap-4 mt-8">
        <div
          v-for="method in methods"
          :key="method.title"
          class="relative group overflow-hidden
                 rounded-xl border border-neutral-100
                 transform transition duration-300 ease-in-out
                 hover:scale-105"
        >
          <NuxtImg
            :src="`/images/${method.image}`"
            width="250"
            height="400"
            format="webp"
            quality="80"
            class="rounded-xl
                   transition-transform duration-300 ease-in-out"
          />

          <div
            class="absolute inset-0 rounded-xl
                   bg-gradient-to-t from-black/40 to-transparent
                   pointer-events-none z-10"
          ></div>

          <div
            class="absolute bottom-0 left-0 right-0
                   px-4 py-2
                   text-white text-2xl font-bold
                   z-20"
          >
            {{ method.title }}
          </div>
        </div>
      </div>
       </UPage>
  </UContainer>

      <USeparator class="mt-12" />
      

      <!-- 2) Fyr-kolumners-layout för annotations.json -->
      <div class="bg-neutral-100 pb-4">
        <UContainer>
          <div class="flex gap-4 pt-4">
            <!-- Kolumn 1 -->
            <div class="flex-1 flex flex-col gap-4">
              <template v-for="note in col1List" :key="note.id">
                <UCollapsible  
                      class="border border-neutral-200 rounded-xl p-4 bg-white
                             cursor-pointer transition-shadow duration-200 ease-in-out
                             hover:shadow-lg"
                    >
                  <!-- Trigger: titel + trunkerad text -->
                   
                      <div class="text-md font-semibold mb-1">
                        {{ note.title }}
                      </div>
                     
                   

                  <!-- Content: hela beskrivningen -->
                  <template #content>
                  
                      <p class="text-sm leading-snug font-medium text-neutral-500 dark:text-neutral-300">
                        {{ note.text }}
                      </p>
                  </template>
                </UCollapsible>
              </template>
            </div>

            <!-- Kolumn 2 -->
            <div class="flex-1 flex flex-col gap-4">
              <template v-for="note in col2List" :key="note.id">
                <UCollapsible class="border border-neutral-200 rounded-xl p-4 bg-white
                             cursor-pointer transition-shadow duration-200 ease-in-out
                             hover:shadow-lg">
       
                   
                      <div class="text-md font-semibold mb-1">
                        {{ note.title }}
                      </div>
                
            
     
                  <template #content>
               
                      <p class="text-sm leading-snug font-medium text-neutral-500 dark:text-neutral-300">
                        {{ note.text }}
                      </p>
                 
                  </template>
                </UCollapsible>
              </template>
            </div>

            <!-- Kolumn 3 -->
            <div class="flex-1 flex flex-col gap-4">
              <template v-for="note in col3List" :key="note.id">
                <UCollapsible  class="border border-neutral-200 rounded-xl p-4 bg-white
                             cursor-pointer transition-shadow duration-200 ease-in-out
                             hover:shadow-lg">
                
                      <div class="text-md font-semibold mb-1">
                        {{ note.title }}
                      </div>
                    
                  <template #content>
                  
                      <p class="text-sm leading-snug font-medium text-neutral-500 dark:text-neutral-300">
                        {{ note.text }}
                      </p>
                   
                  </template>
                </UCollapsible>
              </template>
            </div>

            <!-- Kolumn 4 -->
            <div class="flex-1 flex flex-col gap-4">
              <template v-for="note in col4List" :key="note.id">
                <UCollapsible class="border border-neutral-200 rounded-xl  bg-white
                             cursor-pointer transition-shadow duration-200 ease-in-out
                             hover:shadow-lg pb-4">
               
                      <div class="text-md font-semibold p-4 pb-0">
                        {{ note.title }}
                      </div>
                  
                  <template #content>
                  
                      <p class="text-sm leading-snug font-medium text-neutral-500 dark:text-neutral-300 px-4 pt-0 ">
                        {{ note.text }}
                      </p>
            
                  </template>
                </UCollapsible>
              </template>
            </div>
          </div>
        </UContainer>
      </div>
   
</template>

<script setup>
import annotations from 'public/annotations.json'
import { ref } from 'vue'

definePageMeta({ layout: 'mylayout' })

const methods = [
  {
    title: 'Inga åtgärder',
    image: 'ingen_åtgärd.png',
    description:
      'Beståndet lämnas för fri utveckling tills vidare. Kan t ex vara en frivillig naturvårdsavsättning eller en skog med områdesskydd.'
  },
  {
    title: 'Trakthygge',
    image: 'kalhygge.png',
    description:
      'Går ut på att skapa likåldriga, större bestånd, trakter, med normalt ett trädslag. Hela beståndet behandlas samtidigt.'
  },
  {
    title: 'Luckhuggning',
    image: 'luckhuggning.png',
    description:
      'Innebär att träd avverkas i luckor med 20–50 m storlek vilket motsvarar luckor på ca 500–2 500 m². När ny skog vuxit upp kan luckorna utvidgas eller nya luckor tas upp i beståndet.'
  },
  {
    title: 'Överhållen skärm',
    image: 'skärm.png',
    description:
      'Antalet lämnade skyddande skärmträd är fler än vid en vanlig fröträdsställning och att de sparas längre än vid normalt skärmskogsbruk.'
  },
  {
    title: 'Blädning',
    image: 'blädning.png',
    description:
      'Innebär ofta uttag om 20–30 procent av virkesvolymen med intervall på 15–30 år. Avverkning görs med målet att skapa och bibehålla en fullskiktad skog.'
  }
]

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