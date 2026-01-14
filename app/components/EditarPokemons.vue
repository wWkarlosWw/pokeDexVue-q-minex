<script setup lang="ts">
import { pokemonFormSchema } from "#shared/schema/pokemon";
import type { FormSubmitEvent } from "@nuxt/ui";

const form = useTemplateRef("form");

const props = defineProps<{
  initialValues: PokemonFormSchema;
  selectedPokemon: Pokemon;
  loading: boolean;
}>();

const emit = defineEmits<{
  (e: "save", id: number, data: PokemonFormSchema): void;
}>();

const state = reactive<PokemonFormSchema>({
  name: props.initialValues.name,
  tipo: props.selectedPokemon.types,
});

async function onSubmit(event: FormSubmitEvent<PokemonFormSchema>) {
  emit("save", props.selectedPokemon.id, event.data);
}

const { data: allTypesData } = await useAsyncData("poke-types", () =>
  $fetch<{ results: { name: string }[] }>("https://pokeapi.co/api/v2/type/")
);

const typeOptions = computed(
  () => allTypesData.value?.results.map((t) => t.name) || []
);
</script>

<template>
  <div
    class="flex flex-col md:flex-row items-center md:items-start gap-8 p-2 personal"
  >
    <UForm
      ref="form"
      :schema="pokemonFormSchema"
      :state="state"
      class="flex-1 space-y-4 w-full"
      @submit="onSubmit"
      #default="{ loading: loadingForm }"
      :disabled="loading"
    >
      <UFormField label="Nombre" name="name" class="w-full">
        <UInput
          v-model="state.name"
          placeholder="Nombre del pokemon"
          class="capitalize"
        />
      </UFormField>

      <UFormField label="Tipos" name="tipo">
        <USelect
          v-model="state.tipo"
          multiple
          :items="typeOptions"
          placeholder="Selecciona los tipos"
          class="w-full capitalize"
          icon="i-lucide-tags"
        />
      </UFormField>

      <div class="flex justify-end pt-4">
        <UButton
          type="submit"
          color="primary"
          :disabled="loading || !form?.dirty"
          :loading="loading || loadingForm"
        >
          Guardar
        </UButton>
      </div>
    </UForm>

    <div
      class="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700"
    >
      <img
        :src="props.selectedPokemon.image"
        :alt="props.selectedPokemon.name"
        class="w-40 h-40 object-contain drop-shadow-xl"
      />

      <UBadge variant="subtle" color="neutral" class="mt-2">
        ID: #{{ props.selectedPokemon.id }}
      </UBadge>
    </div>
  </div>
</template>
