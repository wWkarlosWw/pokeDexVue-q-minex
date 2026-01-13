<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent } from "@nuxt/ui";

const props = defineProps<{
  pokemon: Pokemon;
}>();

const schema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  tipo: z.string().min(1, "El tipo es obligatorio"),
});

type Schema = z.output<typeof schema>;

const state = reactive<Schema>({
  name: props.pokemon.name,
  tipo: props.pokemon.types.join(", "),
});

const toast = useToast();
async function onSubmit(event: FormSubmitEvent<Schema>) {
  toast.add({
    title: "¡Pokémon Actualizado!",
    description: `Los cambios para ${event.data.name} se han guardado.`,
    color: "success",
  });
  console.log("Nuevos datos:", event.data);
}
</script>

<template>
  <div class="flex flex-col md:flex-row items-center md:items-start gap-8 p-2">
    <UForm
      :schema="schema"
      :state="state"
      class="flex-1 space-y-4 w-full"
      @submit="onSubmit"
    >
      <UFormField label="Nombre" name="name">
        <UInput
          v-model="state.name"
          placeholder="Nombre del pokemon"
          class="capitalize"
        />
      </UFormField>

      <UFormField label="Tipos" name="tipo">
        <UInput v-model="state.tipo" placeholder="Ej: grass, poison" />
      </UFormField>

      <div class="flex justify-end pt-4">
        <UButton type="submit" color="primary"> Guardar </UButton>
      </div>
    </UForm>

    <div
      class="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700"
    >
      <img
        :src="props.pokemon.image"
        :alt="props.pokemon.name"
        class="w-40 h-40 object-contain drop-shadow-xl"
      />

      <UBadge variant="subtle" color="neutral" class="mt-2">
        ID: #{{ props.pokemon.id }}
      </UBadge>
    </div>
  </div>
</template>
