"use client";

import { LoadingSpinner } from "./LoadingSpinner";
import { EmptyState } from "./EmptyState";

export type Column<T> = {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
};

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  emptyMessage = "لا توجد بيانات",
  onRowClick,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12">
        <EmptyState message={emptyMessage} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-right px-6 py-4 text-sm font-semibold text-gray-600 whitespace-nowrap"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr
                key={idx}
                onClick={() => onRowClick?.(item)}
                className={`border-b border-gray-50 transition-colors ${
                  onRowClick ? "cursor-pointer hover:bg-gray-50" : ""
                } ${idx % 2 === 1 ? "bg-gray-50/30" : ""}`}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap"
                  >
                    {col.render
                      ? col.render(item)
                      : (item[col.key] as React.ReactNode) ?? "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
