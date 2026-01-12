<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";

interface Pokemon {
  id: number;
  name: string;
  image: string;
  types: string[];
}

const limit = 10;
const page = ref(1);
const offset = computed(() => (page.value - 1) * limit);

const { data: pokemons, pending } = await useAsyncData(
  `pokemons-page-${page.value}`,
  async () => {
    const listResponse: any = await $fetch(
      `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset.value}`
    );

    const detailedPromises = listResponse.results.map((p: any) =>
      $fetch(p.url)
    );
    const detailedResponses: any[] = await Promise.all(detailedPromises);

    return detailedResponses.map((p) => ({
      id: p.id,
      name: p.name,
      image: p.sprites.other["official-artwork"].front_default,
      types: p.types.map((t: any) => t.type.name),
    }));
  },
  { watch: [page] }
);

const columns: TableColumn<Pokemon>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "name", header: "Pokémon" },
  { accessorKey: "types", header: "Tipo" },
];
</script>

<template>
  <div class="p-6">
    <div class="flex justify-around items-center mb-6">
      <h1 class="text-2xl font-bold">Pokedex</h1>
      <div class="flex gap-2">
        <UButton
          icon="i-heroicons-chevron-left"
          :disabled="page === 1 || pending"
          @click="page--"
        />
        <span class="flex items-center text-sm font-medium"
          >Página {{ page }}</span
        >
        <UButton
          icon="i-heroicons-chevron-right"
          :disabled="pending"
          @click="page++"
        />
      </div>
    </div>
    <UContainer>
      <UTable
        :data="pokemons || []"
        :columns="columns"
        :loading="pending"
        class="w-50%"
      >
        <template #name-cell="{ row }">
          <div class="flex items-center gap-3">
            <UAvatar :src="row.original.image" size="lg" />
            <span class="capitalize font-bold">{{ row.original.name }}</span>
          </div>
        </template>

        <template #types-cell="{ row }">
          <div class="flex gap-1">
            <UBadge
              v-for="type in row.original.types"
              :key="type"
              variant="subtle"
              size="xl"
              class="capitalize"
            >
              {{ type }}
            </UBadge>
          </div>
        </template>
      </UTable>
    </UContainer>
  </div>
</template>
