import { NextResponse, type NextRequest } from "next/server";
import { isAdmin } from "@/lib/admin/auth";
import { listRequests, listSubscribers } from "@/lib/content/inbox";

const cell = (v: unknown) => {
  const s = String(v ?? "");
  // Quote every cell; neutralise spreadsheet formulas.
  return `"${(/^[=+\-@]/.test(s) ? `'${s}` : s).replace(/"/g, '""')}"`;
};

/** The inbox as a CSV file (for a spreadsheet or a mailing tool). */
export async function GET(request: NextRequest) {
  if (!(await isAdmin())) return new NextResponse("Not signed in.", { status: 401 });
  const kind = request.nextUrl.searchParams.get("kind") === "subscribers" ? "subscribers" : "requests";
  const rows =
    kind === "subscribers"
      ? [["Date", "Name", "Email", "Message"], ...(await listSubscribers()).map((s) => [new Date(s.createdAt).toISOString(), s.name, s.email, s.message])]
      : [
          ["Date", "Piece", "Name", "City", "Email", "Message", "Done"],
          ...(await listRequests()).map((r) => [new Date(r.createdAt).toISOString(), r.garment, r.name, r.city, r.email, r.message, r.done ? "yes" : ""]),
        ];
  const csv = rows.map((r) => r.map(cell).join(",")).join("\r\n");
  return new NextResponse(`﻿${csv}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="andy-lenart-${kind}.csv"`,
    },
  });
}
