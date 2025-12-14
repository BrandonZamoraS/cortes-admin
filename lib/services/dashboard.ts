import { supabase } from "@/lib/supabase-client";

export type DashboardBundle = {
  id: string;
  numeroBulto: number | null;
  cantidadLaminas: number;
  estado: string;
  numBobina: string | null;
  ubicacion: string;
  ordenCorte: string;
  fechaOrden: string;
  materialNombre: string | null;
  materialId: string | null;
};

export type DashboardFilters = {
  ubicacion?: string;
  materialId?: string;
  estado?: string;
  ordenCorte?: string;
  numBobina?: string;
};

export type LocationSummary = {
  ubicacion: string;
  cantidadBultos: number;
  totalLaminas: number;
};

export type MaterialSummary = {
  materialId: string | null;
  materialNombre: string | null;
  cantidadBultos: number;
  totalLaminas: number;
};

type SupabaseDashboardBundle = {
  id: string;
  numero_bulto: number | null;
  cantidad_laminas: number | null;
  estado: string | null;
  num_bobina: string | null;
  ubicacion: { codigo: string | null } | null;
  orden_corte: {
    numero_orden: string;
    fecha: string | null;
    material: { id: string; nombre: string } | null;
  } | null;
};

export async function fetchDashboardBundles(
  filters: DashboardFilters = {}
): Promise<DashboardBundle[]> {
  let query = supabase
    .from("bultos")
    .select(
      `
      id,
      numero_bulto,
      cantidad_laminas,
      estado,
      num_bobina,
      ubicacion:ubicaciones ( codigo ),
      orden_corte:ordenes_corte (
        numero_orden,
        fecha,
        material:materiales ( id, nombre )
      )
    `
    )
    .order("numero_bulto", { ascending: true });

  // Aplicar filtros
  if (filters.estado) {
    query = query.eq("estado", filters.estado);
  }

  if (filters.numBobina) {
    query = query.ilike("num_bobina", `%${filters.numBobina}%`);
  }

  const { data, error } = await query.returns<SupabaseDashboardBundle[]>();

  if (error) {
    throw new Error(`No se pudieron cargar los bultos: ${error.message}`);
  }

  let bundles = (data ?? []).map((bundle): DashboardBundle => ({
    id: bundle.id,
    numeroBulto: bundle.numero_bulto,
    cantidadLaminas: bundle.cantidad_laminas ?? 0,
    estado: bundle.estado ?? "Sin estado",
    numBobina: bundle.num_bobina,
    ubicacion: bundle.ubicacion?.codigo ?? "Sin ubicación",
    ordenCorte: bundle.orden_corte?.numero_orden ?? "Sin orden",
    fechaOrden: bundle.orden_corte?.fecha ?? "",
    materialNombre: bundle.orden_corte?.material?.nombre ?? null,
    materialId: bundle.orden_corte?.material?.id ?? null,
  }));

  // Filtrar por ubicación en JavaScript (porque es una relación)
  if (filters.ubicacion) {
    bundles = bundles.filter(
      (b) => b.ubicacion.toLowerCase() === filters.ubicacion!.toLowerCase()
    );
  }

  // Filtrar por material en JavaScript (porque es una relación anidada)
  if (filters.materialId) {
    bundles = bundles.filter((b) => b.materialId === filters.materialId);
  }

  // Filtrar por orden de corte en JavaScript
  if (filters.ordenCorte) {
    bundles = bundles.filter((b) =>
      b.ordenCorte.toLowerCase().includes(filters.ordenCorte!.toLowerCase())
    );
  }

  return bundles;
}

export function getLocationSummary(bundles: DashboardBundle[]): LocationSummary[] {
  const map = new Map<string, LocationSummary>();

  bundles.forEach((bundle) => {
    const existing = map.get(bundle.ubicacion);
    if (existing) {
      existing.cantidadBultos += 1;
      existing.totalLaminas += bundle.cantidadLaminas;
    } else {
      map.set(bundle.ubicacion, {
        ubicacion: bundle.ubicacion,
        cantidadBultos: 1,
        totalLaminas: bundle.cantidadLaminas,
      });
    }
  });

  return Array.from(map.values()).sort((a, b) =>
    a.ubicacion.localeCompare(b.ubicacion)
  );
}

export function getMaterialSummary(bundles: DashboardBundle[]): MaterialSummary[] {
  const map = new Map<string, MaterialSummary>();

  bundles.forEach((bundle) => {
    const key = bundle.materialId ?? "sin-material";
    const existing = map.get(key);
    if (existing) {
      existing.cantidadBultos += 1;
      existing.totalLaminas += bundle.cantidadLaminas;
    } else {
      map.set(key, {
        materialId: bundle.materialId,
        materialNombre: bundle.materialNombre ?? "Sin material",
        cantidadBultos: 1,
        totalLaminas: bundle.cantidadLaminas,
      });
    }
  });

  return Array.from(map.values()).sort((a, b) =>
    (a.materialNombre ?? "").localeCompare(b.materialNombre ?? "")
  );
}
