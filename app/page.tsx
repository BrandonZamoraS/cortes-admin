"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CutOrderPanel } from "@/components/cut-order-panel";
import { AddCutOrderForm } from "@/components/add-cut-order-form";
import { CutOrder } from "@/types/cut-order";
import { fetchCutOrders } from "@/lib/services/cut-orders";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"todos" | "activo" | "inactivo">(
    "todos",
  );
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [orders, setOrders] = useState<CutOrder[]>([]);
  const [isAddingOrder, setIsAddingOrder] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchCutOrders();
      setOrders(data);
      setSelectedOrderId((current) => {
        if (current && data.some((order) => order.id === current)) {
          return current;
        }
        return data[0]?.id ?? null;
      });
    } catch (fetchError) {
      setError(
        fetchError instanceof Error
          ? fetchError.message
          : "No se pudieron cargar las órdenes.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch = order.code
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "todos"
          || (statusFilter === "activo" && order.status === "Activo")
          || (statusFilter === "inactivo" && order.status === "Inactivo");

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  useEffect(() => {
    if (
      selectedOrderId
      && !filteredOrders.some((order) => order.id === selectedOrderId)
    ) {
      setSelectedOrderId(filteredOrders[0]?.id ?? null);
    }
  }, [filteredOrders, selectedOrderId]);

  const selectedOrder =
    filteredOrders.find((order) => order.id === selectedOrderId) ?? null;

  const handleOrderCreated = useCallback(() => {
    setIsAddingOrder(false);
    loadOrders();
  }, [loadOrders]);

  return (
    <div className="flex h-full w-full flex-col text-[var(--primary-dark)]">
      <header className="shrink-0 border-b border-[color:rgba(0,0,0,0.08)] bg-[var(--primary-soft)] px-6 py-3 text-[var(--primary-dark)] shadow">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-[var(--primary)]">
              Control de Bultos
            </h1>
          </div>
          <Image
            src="/logo-Comeca.png"
            alt="Logo Comeca"
            width={120}
            height={48}
            className="h-12 w-auto object-contain"
            priority
          />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="flex w-80 flex-col border-r border-[var(--primary-muted)] bg-white p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-3">
            <div className="sm:flex-[0_0_60%]">
              <label className="text-xs font-semibold uppercase tracking-wide text-[var(--primary)]">
                # de orden de corte
              </label>
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Buscar..."
                className="mt-2 w-full rounded-md border border-[var(--primary-muted)] px-3 py-2 text-sm text-[var(--primary-dark)] focus:border-[var(--primary)] focus:outline-none sm:h-10"
              />
            </div>
            <div className="sm:flex-[0_0_40%]">
              <label className="text-xs font-semibold uppercase tracking-wide text-[var(--primary)]">
                Estado
              </label>
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as "todos" | "activo" | "inactivo")
                }
                className="mt-2 w-full rounded-md border border-[var(--primary-muted)] px-3 py-2 text-sm text-[var(--primary-dark)] focus:border-[var(--primary)] focus:outline-none sm:h-10"
              >
                <option value="todos">Todos</option>
                <option value="activo">Activos</option>
                <option value="inactivo">Inactivos</option>
              </select>
            </div>
          </div>

          {error ? (
            <p className="mt-6 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </p>
          ) : null}

          <div className="mt-6 flex-1 overflow-y-auto">
            {isLoading ? (
              <p className="rounded-md border border-[var(--primary-muted)] bg-[var(--primary-soft)] px-4 py-3 text-sm text-[var(--primary)]">
                Cargando órdenes...
              </p>
            ) : filteredOrders.length === 0 ? (
              <p className="rounded-md border border-dashed border-[var(--primary-muted)] bg-[var(--primary-soft)] px-4 py-3 text-sm text-[var(--primary)]">
                No se encontraron órdenes con los filtros seleccionados.
              </p>
            ) : (
              <div className="space-y-3 pb-4">
                {filteredOrders.map((order) => {
                  const isActive = order.id === selectedOrderId;
                  return (
                    <button
                      key={order.id}
                      onClick={() => {
                        setIsAddingOrder(false);
                        setSelectedOrderId((prev) =>
                          prev === order.id ? null : order.id,
                        );
                      }}
                      className={`w-full rounded-md border px-4 py-3 text-left transition ${
                        isActive
                          ? "border-[var(--primary)] bg-[var(--primary-soft)] shadow-sm"
                          : "border-[var(--primary-muted)] hover:border-[var(--primary)]"
                      }`}
                    >
                      <div className="flex items-center justify-between text-sm font-semibold text-[var(--primary-dark)]">
                        <span>{order.code}</span>
                        <span
                          className={`rounded-md px-3 py-0.5 text-xs font-medium ${
                            order.status === "Activo"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-[var(--primary-soft)] text-[var(--primary-dark)]"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-[var(--primary)]">{order.date}</p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <button
            onClick={() => {
              setSelectedOrderId(null);
              setIsAddingOrder(true);
            }}
            className="mt-4 w-full rounded-md bg-[var(--primary)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--primary-dark)]"
          >
            Añadir Orden de Corte
          </button>
        </aside>

        <main className="flex flex-1 flex-col overflow-hidden bg-[var(--primary-soft)]/60 pb-0">
          {isAddingOrder ? (
            <div className="flex h-full flex-1 flex-col overflow-y-auto">
              <AddCutOrderForm
                onCancel={() => setIsAddingOrder(false)}
                onCreated={handleOrderCreated}
              />
            </div>
          ) : (
            <div className="flex h-full flex-1 flex-col overflow-hidden">
              <CutOrderPanel order={selectedOrder} onRequestReload={loadOrders} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
