<template>
    <section class="pt-12 pb-18">
        <UContainer>
            <slot name="headline" />
            <div class="grid grid-cols-2 place-items-center sm:flex gap-6 sm:justify-between">
                <slot name="logos" />
            </div>
        </UContainer>
        <ul class="mt-28 text-sm sm:text-md sm:text-center mx-auto max-w-5xl px-6">
            <slot name="details" />
        </ul>
    </section>
</template>
