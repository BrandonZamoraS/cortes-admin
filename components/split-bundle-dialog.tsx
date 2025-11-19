"use client";

import { useState } from "react";
import { Bundle } from "@/types/cut-order";

type Props = {
  bundle: Bundle;
  onCancel: () => void;
  onConfirm: (sheets: number) => void;
};

export function SplitBundleDialog({ bundle, onCancel, onConfirm }: Props) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const maxSheets = bundle.sheets;

  const handleSubmit = () => {
    const parsed = Number(value);
    if (Number.isNaN(parsed) || parsed <= 0) {
      setError("Ingresa una cantidad válida.");
      return;
    }
    if (parsed >= maxSheets) {
      setError("La cantidad debe ser menor a la del bulto original.");
      return;
    }
    setError(null);
    onConfirm(parsed);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onCancel}>
      <div
        className="w-full max-w-md rounded-md border border-[var(--primary-muted)] bg-white p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <h3 className="text-2xl font-semibold text-[var(--primary-dark)]">
          Dividir {bundle.name}
        </h3>
        <p className="mt-2 text-sm text-[var(--primary)]">
          Este bulto tiene {bundle.sheets.toLocaleString("es-ES")} láminas. Ingresa cuántas quieres retirar para crear un nuevo bulto.
        </p>
        <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-[var(--primary)]">
          Cantidad a retirar
        </label>
        <input
          type="number"
          min={1}
          max={maxSheets - 1}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className="mt-2 w-full rounded-md border border-[var(--primary-muted)] px-4 py-2 text-sm text-[var(--primary-dark)] focus:border-[var(--primary)] focus:outline-none"
        />
        {error ? (
          <p className="mt-2 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </p>
        ) : null}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-[var(--primary-muted)] px-4 py-2 text-sm font-medium text-[var(--primary-dark)] transition hover:border-[var(--primary)]"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--primary-dark)]"
          >
            Dividir
          </button>
        </div>
      </div>
    </div>
  );
}
