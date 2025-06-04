<template>
  <UPage>
    <!-- <UPageHeader
       headline="Svampar"
    title="Svampar i skogsmiljöer"
    description="Här kan du söka på svenska skogsmiljöer för att se vilka arter som kan finnas i marken baserat på DNA-analyser av svampmycel i jordprover samt vår samlade kunskap om var olika arters fruktkroppar förekommer.
"
  /> -->

    <!-- <UPageCTA

    description="Här kan du söka på svenska skogsmiljöer för att se vilka arter som kan finnas i marken baserat på DNA-analyser av svampmycel i jordprover samt vår samlade kunskap om var olika arters fruktkroppar förekommer.
"

orientation="horizontal"
 variant="naked"
  >
   
  </UPageCTA> -->

<template #left><div></div></template>
<template #right><div></div></template>

    <UCard class="mt-8 text-lg text-neutral-600 dark:text-neutral-400" variant="soft">
           <ul class="space-y-4">
             <li class="">
               Välj skogsmiljö genom att ange

               <span class="font-semibold text-neutral-700 dark:text-neutral-200">Var i Sverige </span>
               (norr och söder om breddgrad 60 ca Uppsala),
<span class="font-semibold text-neutral-700 dark:text-neutral-200">Skogstyp</span>
                (vilka träd som dominerar),

               <span class="font-semibold text-neutral-700 dark:text-neutral-200">Skogsålder</span>
                (trädens ålder) och

               <span class="font-semibold text-neutral-700 dark:text-neutral-200">Fältskikt</span>
                (vilken vegetation som växer på marken).
             </li>
             <li>
               Klicka på respektive kategori för att göra dina val, eller
               använd knappen
               <UBadge label="Kombinationsvy" icon="mdi:chevron-down" trailing color="neutral" variant="soft" size="lg"/>
               <!-- <div
                 class="inline-flex mx-1 items-center rounded-full ring-1 ring-neutral-200 w-fit text-sm py-1 pl-4 pr-3 gap-1 bg-neutral-50 text-neutral-950"
               >
                 <span>Visa kombinationsvy</span>
                 <Icon name="mdi:chevron-down" class="size-5" />
               </div> -->
               för att se alla alternativ som radioknappar.
          
             </li>
             <li class="">
               Klicka på
               <UBadge label="Markinventeringsdata" icon="mdi:lock" trailing color="secondary" variant="soft" size="lg"/>

              
               för att begränsa urvalet till miljöer där det finns data från
               markinventeringen.
        
             </li>
           </ul>
          </UCard>
  </UPage>
</template>
