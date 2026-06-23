import { Suspense } from "react";
import { getPrisma } from "@/lib/prisma";
import { ProductsTable } from "@/components/admin/ProductsTable";

export default async function AdminProductsPage() {
  const prisma = getPrisma();
  const products = prisma
    ? await prisma.product.findMany({
        orderBy: { sortOrder: "asc" },
        select: {
          id: true,
          slug: true,
          status: true,
          featured: true,
          nameJson: true,
          sortOrder: true,
          downloadCount: true,
        },
      })
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Products</h1>
        <p className="text-text-muted mt-1">
          Manage products, platforms, guides, and publishing workflow.
        </p>
      </div>
      {!prisma && (
        <p className="text-sm text-accent-warm">
          Database not configured — product list is empty.
        </p>
      )}
      <Suspense>
        <ProductsTable products={products} />
      </Suspense>
    </div>
  );
}
