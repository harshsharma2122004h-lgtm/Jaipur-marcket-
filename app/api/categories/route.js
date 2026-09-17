const { NextResponse } = require("next/server");
const { db } = require("../../../lib/db");

async function GET(req) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const search = searchParams.get("q");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");

  const where = { isActive: true };

  if (category) where.category = { slug: category };
  if (search) where.title = { contains: search, mode: "insensitive" };
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = Number(minPrice);
    if (maxPrice) where.price.lte = Number(maxPrice);
  }

  const products = await db.product.findMany({
    where,
    include: { images: true, category: true, variants: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ products });
}

module.exports = { GET };
