import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useEffect, useMemo, useState } from "react"

type ActivityRow = {
    id?: string
    date: string
    description: string
    sub: string
    category: string
    status: "Completed" | "Pending" | "Failed" | string
    amount: string
    positive: boolean | null
}

type ActivityTableProps = {
    rows: ActivityRow[]
    pageSize?: number
}

export function ActivityTable({
    rows,
    pageSize = 5,
}: ActivityTableProps) {
    const [page, setPage] = useState(1)

    const totalPages = Math.max(1, Math.ceil(rows.length / pageSize))

    useEffect(() => {
        setPage((currentPage) => Math.min(currentPage, totalPages))
    }, [totalPages])

    const paginatedRows = useMemo(() => {
        const start = (page - 1) * pageSize
        return rows.slice(start, start + pageSize).map((row, index) => ({
            ...row,
            _key: row.id ?? `${start + index}-${row.date}-${row.description}-${row.amount}`,
        }))
    }, [page, pageSize, rows])

    const showPagination = rows.length > pageSize

    function handlePrevious() {
        setPage((prev) => Math.max(1, prev - 1))
    }

    function handleNext() {
        setPage((prev) => Math.min(totalPages, prev + 1))
    }

    return (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <Table>
                <TableHeader>
                    <TableRow className="bg-slate-50 hover:bg-slate-50">
                        <TableHead className="pl-6">Data</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="pr-6 text-right">Valor</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {paginatedRows.map((row) => (
                        <TableRow key={row._key}>
                            <TableCell className="pl-6 font-medium text-slate-500">
                                {row.date}
                            </TableCell>

                            <TableCell>
                                <div className="font-semibold">{row.description}</div>
                                <div className="text-xs text-slate-500">{row.sub}</div>
                            </TableCell>

                            <TableCell>
                                <Badge
                                    variant="secondary"
                                    className="rounded-md bg-slate-100 text-[10px] tracking-[0.12em] text-slate-500"
                                >
                                    {row.category}
                                </Badge>
                            </TableCell>

                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <span
                                        className={[
                                            "h-2 w-2 rounded-full",
                                            row.status === "Pending"
                                                ? "bg-amber-400"
                                                : row.status === "Failed"
                                                    ? "bg-red-400"
                                                    : "bg-emerald-400",
                                        ].join(" ")}
                                    />
                                    <span className="text-sm text-slate-600">{row.status}</span>
                                </div>
                            </TableCell>

                            <TableCell
                                className={[
                                    "pr-6 text-right font-semibold",
                                    row.positive === true
                                        ? "text-emerald-500"
                                        : row.positive === false
                                            ? "text-red-500"
                                            : "text-slate-700",
                                ].join(" ")}
                            >
                                {row.amount}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {showPagination && (
                <div className="flex items-center justify-between border-t px-6 py-4 text-sm text-slate-500">
                    <span>
                        Mostrando {(page - 1) * pageSize + 1}-
                        {Math.min(page * pageSize, rows.length)} de {rows.length} transações
                    </span>

                    <div className="flex items-center gap-2">
                        <button type="button" onClick={handlePrevious} disabled={page === 1}>
                            Anterior
                        </button>

                        <span className="px-2 text-slate-600">
                            {page} / {totalPages}
                        </span>

                        <button
                            type="button"
                            onClick={handleNext}
                            disabled={page === totalPages}
                            className="font-medium text-emerald-600"
                        >
                            Próxima
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
