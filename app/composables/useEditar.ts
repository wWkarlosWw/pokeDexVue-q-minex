export function useEditar() {
  const loading = ref(false);
  const toast = useToast();

  const updatePokemon = async (
    id: number,
    name: string,
    typesString: string
  ) => {
    loading.value = true;

    const typesArray = typesString
      .split(",")
      .map((t) => t.trim().toLowerCase());
    try {
      const response = await $fetch(`(ulr)`, {
        method: "PUT",
        body: {
          name: name,
          types: typesArray,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer tu-token-de-seguridad",
        },
      });

      toast.add({
        title: "Actualización exitosa",
        description: "Los datos se han guardado en el servidor.",
        color: "success",
      });

      return { success: true, data: response };
    } catch (error: any) {
      toast.add({
        title: "Error de servidor",
        description: error.data?.message || "No se pudo conectar con la API",
        color: "error",
      });
      return { success: false };
    } finally {
      loading.value = false;
    }
  };

  return { updatePokemon, loading };
}
