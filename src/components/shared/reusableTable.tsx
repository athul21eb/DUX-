

'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { motion } from "framer-motion";
import { ReactNode } from "react";

// Reusable DataTable Component
interface DataTableProps<T> {
  headers: string[];
  rows: T[];
  renderRow: (row: T) => ReactNode[];
}

const MotionTableRow = motion(TableRow);

export default function ReusableDataTable<T>({ headers, rows, renderRow }: DataTableProps<T>) {
  return (
    <div className="rounded-md border overflow-x-auto w-full">
      <Table>
        <TableHeader className="bg-muted">
          <TableRow>
            {headers.map((header, index) => (
              <TableHead key={index} className="px-4 py-3 text-left font-medium">
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length > 0 ? (
            rows.map((row, rowIndex) => (
              <MotionTableRow
                key={rowIndex}
                whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                className="transition-colors"
              >
                {renderRow(row).map((cell, cellIndex) => (
                  <TableCell key={cellIndex} className="px-4 py-3 text-sm">
                    {cell}
                  </TableCell>
                ))}
              </MotionTableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={headers.length} className="h-24 text-center">
                No data found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
