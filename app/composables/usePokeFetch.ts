interface PokeResponse {
  count: number;
  results: {
    name: string;
    url: string;
  }[];
}

interface PokeApiDetail {
  id: number;
  name: string;
  sprites: {
    other: {
      "official-artwork": {
        front_default: string;
      };
    };
  };
  types: {
    type: {
      name: string;
    };
  }[];
}

export function usePokemFetch() {
  const getListPokemon = async (
    offset: number,
    limit: number
  ): Promise<{ result: Pokemon[]; total: number }> => {
    const listResponse = await $fetch<PokeResponse>(
      `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
    );

    const detailedPromises = listResponse.results.map((p) =>
      $fetch<PokeApiDetail>(p.url)
    );
    const detailedResponses = await Promise.all(detailedPromises);

    const pokemons: Pokemon[] = detailedResponses.map((p) => ({
      id: p.id,
      name: p.name,
      image: p.sprites.other["official-artwork"].front_default,
      types: p.types.map((t) => t.type.name),
    }));

    return {
      result: pokemons,
      total: listResponse.count,
    };
    // quitar any
  };

  return { getListPokemon };
}
