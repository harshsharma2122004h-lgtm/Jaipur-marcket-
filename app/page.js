import { db } from "../lib/db";

async function getData() {
  const categories = await db.category.findMany({ where: { parentId: null } });
  const products = await db.product.findMany({
    where: { isActive: true },
    include: { images: true },
    orderBy: { createdAt: "desc" },
    take: 12,
  });
  return { categories, products };
}

export default async function HomePage() {
  const { categories, products } = await getData();

  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-lg font-semibold mb-3">Shop by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {categories.map((cat) => (
            <a
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="border rounded-lg p-3 text-center text-sm bg-white hover:shadow"
            >
              {cat.name}
            </a>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">New Arrivals</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {products.map((p) => (
            <a
              key={p.id}
              href={`/product/${p.slug}`}
              className="border rounded-lg bg-white overflow-hidden hover:shadow"
            >
              <div className="aspect-square bg-stone-100">
                {p.images[0] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.images[0].url} alt={p.title} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="p-2">
                <div className="text-sm font-medium truncate">{p.title}</div>
                <div className="text-sm text-stone-600">₹{(p.price / 100).toFixed(0)}</div>
              </div>
            </a>
          ))}
          {products.length === 0 && (
            <p className="text-stone-500 text-sm col-span-full">
              No products yet — add some from the admin panel.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
