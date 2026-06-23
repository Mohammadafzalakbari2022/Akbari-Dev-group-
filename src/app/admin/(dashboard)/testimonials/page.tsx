import { TestimonialsEditor } from "@/components/admin/TestimonialsEditor";
import { getAllTestimonials } from "@/lib/data/testimonials";
import { getPrisma } from "@/lib/prisma";
import { pickLocale } from "@/lib/i18n-json";

export default async function AdminTestimonialsPage() {
  const [testimonials, products] = await Promise.all([
    getAllTestimonials(),
    loadProducts(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Testimonials</h1>
        <p className="text-text-muted mt-1">
          Curated quotes shown on the homepage.
        </p>
      </div>
      <TestimonialsEditor
        testimonials={testimonials}
        products={products}
      />
    </div>
  );
}

async function loadProducts() {
  const prisma = getPrisma();
  if (!prisma) return [];

  try {
    const rows = await prisma.product.findMany({
      select: { id: true, nameJson: true },
      orderBy: { sortOrder: "asc" },
    });
    return rows.map((p) => ({
      id: p.id,
      name: pickLocale(p.nameJson, "en"),
    }));
  } catch {
    return [];
  }
}
