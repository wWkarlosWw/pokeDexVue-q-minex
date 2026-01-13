<script setup lang="ts">
const { getListPokemon } = usePokemFetch();

const { limit, page, offset } = UsePaginLimits();

const { data: pokemons, pending } = await useAsyncData(
  `pokemons-page-${page.value}-${limit}`,
  async () => getListPokemon(offset.value, limit),
  { watch: [page], server: true }
);
</script>

<template>
  <div>
    <UMain>
      <div class="flex justify-around items-center mb-6 mt-10">
        <h1 class="text-2xl font-bold">Pokedex</h1>
        <div class="flex gap-2">
          <UPagination
            v-model:page="page"
            :items-per-page="limit"
            :total="pokemons?.total"
          />
        </div>
      </div>

      <TablePokemon
        v-model:page="page"
        :data="pokemons?.result ?? []"
        :total="pokemons?.total ?? 10"
        :pending="pending"
        :limit="limit"
        :offset="offset"
      />
    </UMain>
  </div>
</template>
