<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";

defineProps<{
  data: Pokemon[];
  total: number;
  pending: boolean;
}>();

const columns: TableColumn<Pokemon>[] = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "name", header: "Pokémon" },
  { accessorKey: "types", header: "Tipo" },
  { id: "action", header: "" },
];

const emit = defineEmits<{ (e: "edit", id: number): void }>();
</script>

<template>
  <div class="p-6">
    <UContainer>
      <UTable :data="data" :columns="columns" :loading="pending" class="w-50%">
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
        <template #action-cell="{ row }">
          <ClientOnly>
            <UButton
              label="Editar"
              color="neutral"
              variant="subtle"
              icon="i-lucide-edit"
              @click="emit('edit', row.original.id)"
            />
          </ClientOnly>
        </template>
      </UTable>
    </UContainer>
  </div>
</template>
