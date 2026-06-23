import { notFound } from "next/navigation";
import { ProductEditor } from "@/components/admin/ProductEditor";
import { getProductForEdit } from "@/lib/admin/actions";
import { mapProductToForm } from "@/lib/admin/product-mapper";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductForEdit(id);
  if (!product) notFound();

  return <ProductEditor productId={id} initial={mapProductToForm(product)} />;
}
