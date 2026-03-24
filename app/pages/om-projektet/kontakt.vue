<template>
    <UContainer>
        <UPage>
            <UPageHeader title="Kontakt" description="Har du upptäckt något som kan bli bättre, eller vill du dela en kommentar? Skicka gärna ett
                        meddelande här." :ui="{ root: 'border-none', title: 'sm:text-5xl' }" />

            <template #right>
                <div />
            </template>

            <div class="mb-12 ">
                <form name="kontakt-feedback" method="POST" data-netlify="true" netlify-honeypot="bot-field"
                    enctype="multipart/form-data" hidden>
                    <input type="hidden" name="form-name" value="kontakt-feedback">
                    <input type="text" name="bot-field">
                    <input type="text" name="name">
                    <input type="email" name="email">
                    <textarea name="message"></textarea>
                    <input type="file" name="attachment" accept="image/*">
                </form>

                <UAlert v-if="submitStatus === 'success'" color="success" variant="subtle"
                    title="Tack, din feedback har skickats."
                    description="Vi har tagit emot ditt meddelande och återkommer vid behov." class="mb-6" />

                <UAlert v-else-if="submitStatus === 'error'" color="error" variant="subtle"
                    title="Det gick inte att skicka formuläret."
                    description="Försök igen om en stund, eller kontakta oss direkt via e-post." class="mb-6" />

                <UForm :state="feedbackForm" class="space-y-6  py-6  sm:py-8" @submit="onSubmit">
                    <div class="grid gap-5 md:grid-cols-2">
                        <UFormField label="Namn" name="name" required>
                            <UInput v-model="feedbackForm.name" size="lg" placeholder="Ditt namn" class="w-full"
                                :ui="{ base: 'ring-muted/50' }" />
                        </UFormField>

                        <UFormField label="E-post" name="email" required>
                            <UInput v-model="feedbackForm.email" type="email" size="lg" placeholder="namn@epost.se"
                                class="w-full" :ui="{ base: 'ring-muted/50' }" />
                        </UFormField>
                    </div>

                    <UFormField label="Meddelande" name="message" required>
                        <UTextarea v-model="feedbackForm.message" :rows="6" size="lg" autoresize
                            placeholder="Skriv din feedback här" class="w-full" :ui="{ base: 'ring-muted/50' }" />
                    </UFormField>

                    <UFormField label="Bild" name="attachment"
                        description="Lägg gärna till en skärmbild om den hjälper att förklara problemet eller idén. Ladda inte upp bilder som innehåller personuppgifter eller annan känslig information.">
                        <UFileUpload v-model="feedbackForm.attachment" accept="image/*" size="lg" color="neutral"
                            highlight label="Dra och släpp en bild här" description="eller klicka för att välja en fil"
                            :ui="{
                                base: 'rounded-xl border-muted/50 bg-muted/20',
                                wrapper: 'py-4',
                                label: 'text-base font-medium text-highlighted',
                                description: 'text-sm text-neutral-500'
                            }" />
                    </UFormField>

                    <div class="flex justify-start">
                        <UButton type="submit" size="lg" color="neutral" :loading="isSubmitting"
                            :disabled="isSubmitting">
                            Skicka feedback
                        </UButton>
                    </div>
                </UForm>
            </div>

            <div class="mb-6 space-y-2">
                <h2 class="text-2xl font-semibold text-highlighted">
                    Direktkontakt
                </h2>
                <p class="max-w-3xl text-neutral-500 text-lg/8">
                    Om du vill diskutera något utöver feedback på Svampskog.se, har frågor om projektet eller vill komma
                    i kontakt
                    kring andra samarbeten, är du varmt välkommen att höra av dig direkt till oss.
                </p>
            </div>

            <div class="grid gap-10 md:grid-cols-2 mb-12">
                <div class="overflow-hidden rounded-lg border border-muted/50 bg-white shadow-sm">
                    <NuxtImg src="/images/kontakt/anders_kontakt.jpg" alt="Anders Dahlberg"
                        class="aspect-[4/3] w-full object-cover" />

                    <div class="space-y-4 p-6 text-lg/8">
                        <div class="space-y-2">
                            <h2 class="text-2xl font-semibold text-highlighted">
                                Anders Dahlberg
                            </h2>
                            <p class="text-neutral-500">
                                Ansvarig för projektet och för informationsinnehåll
                            </p>
                        </div>

                        <div class="text-neutral-500">
                            Institutionen för skoglig mykologi och växtpatologi<br>
                            Sveriges lantbruksuniversitet<br>
                            Box 7026<br>
                            750 07 Uppsala
                        </div>

                        <div class="text-neutral-500">
                            E-post:
                            <NuxtLink class="text-primary-500" :to="'mailto:anders.dahlberg@slu.se'">
                                anders.dahlberg@slu.se
                            </NuxtLink>
                        </div>
                    </div>
                </div>

                <div class="overflow-hidden rounded-lg border border-muted/50 bg-white shadow-sm">
                    <NuxtImg src="/images/kontakt/jacob_kontakt.jpg" alt="Jacob Bertilsson"
                        class="aspect-[4/3] w-full object-cover" />

                    <div class="space-y-4 p-6 text-lg/8">
                        <div class="space-y-2">
                            <h2 class="text-2xl font-semibold text-highlighted">
                                Jacob Bertilsson
                            </h2>
                            <p class="text-neutral-500">
                                Webb och konceptutveckling
                            </p>
                        </div>

                        <div class="text-neutral-500">
                            E-post:
                            <NuxtLink class="text-primary-500" :to="'mailto:jacob.bertilsson@gmail.com'">
                                jacob.bertilsson@gmail.com
                            </NuxtLink>
                        </div>
                    </div>
                </div>
            </div>
        </UPage>
    </UContainer>
</template>

<script setup>
const feedbackForm = reactive({
    name: '',
    email: '',
    message: '',
    attachment: null
})

const isSubmitting = ref(false)
const submitStatus = ref('idle')

async function onSubmit() {
    isSubmitting.value = true
    submitStatus.value = 'idle'

    try {
        const formData = new FormData()
        formData.append('form-name', 'kontakt-feedback')
        formData.append('bot-field', '')
        formData.append('name', feedbackForm.name)
        formData.append('email', feedbackForm.email)
        formData.append('message', feedbackForm.message)

        if (feedbackForm.attachment) {
            formData.append('attachment', feedbackForm.attachment)
        }

        const response = await fetch('/', {
            method: 'POST',
            body: formData
        })

        if (!response.ok) {
            throw new Error('Form submission failed')
        }

        feedbackForm.name = ''
        feedbackForm.email = ''
        feedbackForm.message = ''
        feedbackForm.attachment = null
        submitStatus.value = 'success'
    } catch {
        submitStatus.value = 'error'
    } finally {
        isSubmitting.value = false
    }
}

definePageMeta({
    layout: 'docs'
})
</script>
