import { getPrisma } from "@/lib/prisma";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function AdminActivityPage() {
  const prisma = getPrisma();
  const logs = prisma
    ? await prisma.adminActivityLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 100,
      })
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Activity Log</h1>
        <p className="text-text-muted mt-1">
          Recent admin actions — product edits, review moderation, settings
          changes.
        </p>
      </div>

      {!prisma && (
        <p className="text-sm text-accent-warm">Database not configured.</p>
      )}

      <div className="rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Admin</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Entity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-text-muted">
                  No activity logged yet
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-text-muted whitespace-nowrap">
                    {log.createdAt.toLocaleString()}
                  </TableCell>
                  <TableCell>{log.adminEmail}</TableCell>
                  <TableCell>
                    <code className="text-xs">{log.action}</code>
                  </TableCell>
                  <TableCell className="text-text-muted">
                    {log.entityType}
                    {log.entityId ? ` · ${log.entityId.slice(0, 8)}…` : ""}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
