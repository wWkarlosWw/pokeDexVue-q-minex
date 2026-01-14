<script setup lang="ts">
const { getListPokemon, updatePokemon } = usePokemFetch();

const initialValues = ref<PokemonFormSchema | null>(null);

const selectedPokemon = ref<Pokemon | null>(null);

const { isOpen, open, close } = useModalStore();

const toast = useToast();

const isSaving = ref(false);

const { limit, page, offset } = UsePaginLimits();

const { data: pokemons, pending } = await useAsyncData(
  `pokemons-page-${page.value}-${limit}`,
  async () => getListPokemon(offset.value, limit),
  { watch: [page], server: true }
);

const editPokemon = (id: number) => {
  const pokemon =
    pokemons.value?.result.find((pokemon) => pokemon.id === id) || null;
  if (pokemon == null) return;
  selectedPokemon.value = pokemon;
  initialValues.value = {
    name: pokemon.name,
    tipo: pokemon.types!,
  };

  open();
};

const handleOnSubmit = async (id: number, data: PokemonFormSchema) => {
  try {
    isSaving.value = true;
    const response = await updatePokemon(id, data);

    if (response.success) {
      toast.add({
        title: "Pokémon Actualizado",
        description: `Los cambios para ${data.name} se han guardado con éxito`,
        color: "success",
      });
       
       close();
    }
  } catch (error) {
    console.error("Error al actualizar el Pokémon:", error);
    toast.add({
      title: "Error",
      description: "No se pudieron guardar los cambios. Inténtalo de nuevo.",
      color: "error",
    });
  }finally{
    isSaving.value = false;
  }
};
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

      <ClientOnly>
        <TablePokemon
          v-model:page="page"
          :data="pokemons?.result ?? []"
          :total="pokemons?.total ?? 10"
          :pending="pending"
          :limit="limit"
          :offset="offset"
          @edit="editPokemon"
        />
      </ClientOnly>
    </UMain>

    <UModal v-model:open="isOpen" title="Editar Pokémon">
      <template #body>
        <EditarPokemons
          :initial-values="initialValues!"
          :selected-pokemon="selectedPokemon!"
          :loading="isSaving"
          @save="handleOnSubmit"
        />
      </template>
    </UModal>
  </div>
</template>
