"use client";

import { useEffect, useMemo, useState } from "react";
import {
  fetchDashboardBundles,
  getLocationSummary,
  getMaterialSummary,
  type DashboardBundle,
  type DashboardFilters,
  type LocationSummary,
  type MaterialSummary,
} from "@/lib/services/dashboard";
import { fetchLocations, type Location } from "@/lib/services/locations";
import { fetchMaterials } from "@/lib/services/materials";
import { Material } from "@/types/cut-order";

const STATUS_COLORS: Record<string, string> = {
  disponible: "bg-emerald-400",
  asignado: "bg-amber-400",
  usado: "bg-rose-500",
};

const STATUS_LABELS: Record<string, string> = {
  disponible: "Disponible",
  asignado: "Asignado",
  usado: "Utilizado",
};

type ViewMode = "tabla";

export function BundleDashboard() {
  const [bundles, setBundles] = useState<DashboardBundle[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filtros
  const [filterUbicacion, setFilterUbicacion] = useState("");
  const [filterMaterial, setFilterMaterial] = useState("");
  const [filterEstado, setFilterEstado] = useState("");
  const [filterOrden, setFilterOrden] = useState("");

  // Material Combobox State
  const [materialSearch, setMaterialSearch] = useState("");
  const [isMaterialDropdownOpen, setIsMaterialDropdownOpen] = useState(false);

  // Sync material search with filter
  useEffect(() => {
    if (filterMaterial) {
      const mat = materials.find((m) => m.id === filterMaterial);
      if (mat) {
        setMaterialSearch(mat.nombre);
      }
    } else {
      setMaterialSearch("");
    }
  }, [filterMaterial, materials]);

  const handleMaterialBlur = () => {
    setTimeout(() => {
      setIsMaterialDropdownOpen(false);
      if (filterMaterial) {
        const mat = materials.find((m) => m.id === filterMaterial);
        if (mat) setMaterialSearch(mat.nombre);
      } else {
        setMaterialSearch("");
      }
    }, 200);
  };

  const filteredMaterials = useMemo(() => {
    if (!materialSearch) return materials;
    const lower = materialSearch.toLowerCase();
    return materials.filter(
      (m) =>
        m.nombre.toLowerCase().includes(lower) ||
        (m.codigo && m.codigo.toLowerCase().includes(lower))
    );
  }, [materials, materialSearch]);

  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        const [bundlesData, locationsData, materialsData] = await Promise.all([
          fetchDashboardBundles(),
          fetchLocations(),
          fetchMaterials(),
        ]);
        setBundles(bundlesData);
        setLocations(locationsData);
        setMaterials(materialsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar datos");
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, []);

  // Aplicar filtros
  const filteredBundles = useMemo(() => {
    return bundles.filter((bundle) => {
      if (filterUbicacion && bundle.ubicacion !== filterUbicacion) return false;
      if (filterMaterial && String(bundle.materialId) !== String(filterMaterial)) return false;
      if (filterEstado && bundle.estado !== filterEstado) return false;
      if (
        filterOrden &&
        !bundle.ordenCorte.toLowerCase().includes(filterOrden.toLowerCase())
      )
        return false;
      return true;
    });
  }, [bundles, filterUbicacion, filterMaterial, filterEstado, filterOrden]);

  // Resúmenes
  const locationSummary = useMemo(
    () => getLocationSummary(filteredBundles),
    [filteredBundles]
  );
  const materialSummary = useMemo(
    () => getMaterialSummary(filteredBundles),
    [filteredBundles]
  );

  // Totales
  const totals = useMemo(() => {
    return {
      bultos: filteredBundles.length,
      laminas: filteredBundles.reduce((acc, b) => acc + b.cantidadLaminas, 0),
    };
  }, [filteredBundles]);

  const clearFilters = () => {
    setFilterUbicacion("");
    setFilterMaterial("");
    setFilterEstado("");
    setFilterOrden("");
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-[var(--primary)]">Cargando dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-rose-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden p-6">
      {/* Filtros */}
      <div className="rounded-md border border-[var(--primary-muted)] bg-[var(--primary-soft)] p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--primary)]">
            Filtros
          </h3>
          <button
            onClick={clearFilters}
            className="rounded-md border border-[var(--primary-muted)] bg-white px-4 py-2 text-sm font-medium text-[var(--primary-dark)] shadow-sm transition hover:bg-[var(--primary-soft)] hover:border-[var(--primary)]"
          >
            Limpiar filtros
          </button>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <div>
            <label className="text-xs font-medium text-[var(--primary)]">
              Ubicación
            </label>
            <select
              value={filterUbicacion}
              onChange={(e) => setFilterUbicacion(e.target.value)}
              className="mt-1 w-full rounded-md border border-[var(--primary-muted)] bg-white px-3 py-1.5 text-sm text-[var(--primary-dark)] focus:border-[var(--primary)] focus:outline-none"
            >
              <option value="">Todas</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.codigo}>
                  {loc.codigo}
                </option>
              ))}
            </select>
          </div>
          <div className="relative">
            <label className="text-xs font-medium text-[var(--primary)]">
              Material
            </label>
            <input
              type="text"
              value={materialSearch}
              onChange={(e) => {
                setMaterialSearch(e.target.value);
                setIsMaterialDropdownOpen(true);
                if (e.target.value === "") setFilterMaterial("");
              }}
              onFocus={() => setIsMaterialDropdownOpen(true)}
              onBlur={handleMaterialBlur}
              placeholder="Buscar material..."
              className="mt-1 w-full rounded-md border border-[var(--primary-muted)] bg-white px-3 py-1.5 text-sm text-[var(--primary-dark)] focus:border-[var(--primary)] focus:outline-none"
            />
            {isMaterialDropdownOpen && (
              <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-[var(--primary-muted)] bg-white shadow-lg">
                {filteredMaterials.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-gray-500">
                    No se encontraron materiales
                  </div>
                ) : (
                  filteredMaterials.map((mat) => (
                    <button
                      key={mat.id}
                      onClick={() => {
                        setFilterMaterial(mat.id);
                        setMaterialSearch(mat.nombre);
                        setIsMaterialDropdownOpen(false);
                      }}
                      className="w-full border-b border-gray-50 px-3 py-2 text-left text-sm text-[var(--primary-dark)] last:border-0 hover:bg-[var(--primary-soft)]"
                    >
                      <div className="font-medium">{mat.nombre}</div>
                      {mat.codigo && (
                        <div className="text-xs text-[var(--primary)]">
                          {mat.codigo}
                        </div>
                      )}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--primary)]">
              Estado
            </label>
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="mt-1 w-full rounded-md border border-[var(--primary-muted)] bg-white px-3 py-1.5 text-sm text-[var(--primary-dark)] focus:border-[var(--primary)] focus:outline-none"
            >
              <option value="">Todos</option>
              <option value="disponible">Disponible</option>
              <option value="asignado">Asignado</option>
              <option value="usado">Utilizado</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-[var(--primary)]">
              Orden de Corte
            </label>
            <input
              type="text"
              value={filterOrden}
              onChange={(e) => setFilterOrden(e.target.value)}
              placeholder="Buscar orden..."
              className="mt-1 w-full rounded-md border border-[var(--primary-muted)] bg-white px-3 py-1.5 text-sm text-[var(--primary-dark)] focus:border-[var(--primary)] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Resumen */}
      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-md border border-[var(--primary-muted)] bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--primary)]">
            Total Bultos
          </p>
          <p className="mt-1 text-2xl font-bold text-[var(--primary-dark)]">
            {totals.bultos.toLocaleString("es-ES")}
          </p>
        </div>
        <div className="rounded-md border border-[var(--primary-muted)] bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--primary)]">
            Total Láminas
          </p>
          <p className="mt-1 text-2xl font-bold text-[var(--primary-dark)]">
            {totals.laminas.toLocaleString("es-ES")}
          </p>
        </div>
        <div className="rounded-md border border-[var(--primary-muted)] bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--primary)]">
            Ubicaciones
          </p>
          <p className="mt-1 text-2xl font-bold text-[var(--primary-dark)]">
            {locationSummary.length}
          </p>
        </div>
        <div className="rounded-md border border-[var(--primary-muted)] bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--primary)]">
            Materiales
          </p>
          <p className="mt-1 text-2xl font-bold text-[var(--primary-dark)]">
            {materialSummary.length}
          </p>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="mt-4 flex-1 overflow-hidden rounded-md border border-[var(--primary-muted)] bg-white">
        <BundleTable bundles={filteredBundles} />
      </div>
    </div>
  );
}

function BundleTable({ bundles }: { bundles: DashboardBundle[] }) {
  return (
    <div className="h-full overflow-auto">
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-[var(--primary-soft)]">
          <tr className="text-left text-xs font-semibold uppercase tracking-wide text-[var(--primary)]">
            <th className="px-4 py-3">Bulto</th>
            <th className="px-4 py-3">Ubicación</th>
            <th className="px-4 py-3">Material</th>
            <th className="px-4 py-3">Orden</th>
            <th className="px-4 py-3">Láminas</th>
            <th className="px-4 py-3">Bobina</th>
            <th className="px-4 py-3">Estado</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--primary-muted)]">
          {bundles.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                className="px-4 py-8 text-center text-[var(--primary)]"
              >
                No se encontraron bultos con los filtros seleccionados.
              </td>
            </tr>
          ) : (
            bundles.map((bundle) => (
              <tr
                key={bundle.id}
                className="hover:bg-[var(--primary-soft)] transition"
              >
                <td className="px-4 py-3 font-medium text-[var(--primary-dark)]">
                  #{bundle.numeroBulto ?? "-"}
                </td>
                <td className="px-4 py-3 text-[var(--primary-dark)]">
                  {bundle.ubicacion}
                </td>
                <td className="px-4 py-3 text-[var(--primary-dark)]">
                  {bundle.materialNombre ?? "-"}
                </td>
                <td className="px-4 py-3 text-[var(--primary-dark)]">
                  {bundle.ordenCorte}
                </td>
                <td className="px-4 py-3 text-[var(--primary-dark)]">
                  {bundle.cantidadLaminas.toLocaleString("es-ES")}
                </td>
                <td className="px-4 py-3 text-[var(--primary-dark)]">
                  {bundle.numBobina ?? "-"}
                </td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-2">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        STATUS_COLORS[bundle.estado] ?? "bg-slate-300"
                      }`}
                    />
                    <span className="text-[var(--primary-dark)]">
                      {STATUS_LABELS[bundle.estado] ?? bundle.estado}
                    </span>
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}