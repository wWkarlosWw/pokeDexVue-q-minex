import z from "zod";

export const pokemonFormSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  tipo: z
    .array(z.string())
    .min(1, "El minimo es 1 tipo")
    .max(2, "El maximo de clases es de 2 tipos"),
});
