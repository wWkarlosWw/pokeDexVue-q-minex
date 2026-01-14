import type z from "zod";
import type { pokemonFormSchema } from "../schema/pokemon";

export interface Pokemon {
  id: number;
  name: string;
  image: string;
  types: string[];
}

export type PokemonFormSchema = z.output<typeof pokemonFormSchema>;
