import { supabase } from "@/lib/supabase-client";
import { Material } from "@/types/cut-order";

type SupabaseMaterial = {
  id: string;
  nombre: string;
  codigo: string | null;
  activo: boolean | null;
};

export async function fetchMaterials(): Promise<Material[]> {
  const { data, error } = await supabase
    .from("materiales")
    .select("id, nombre, codigo, activo")
    .eq("activo", true)
    .order("nombre", { ascending: true })
    .returns<SupabaseMaterial[]>();

  if (error) {
    throw new Error(`No se pudieron cargar los materiales: ${error.message}`);
  }

  return (data ?? []).map((material) => ({
    id: material.id,
    nombre: material.nombre,
    codigo: material.codigo,
  }));
}
