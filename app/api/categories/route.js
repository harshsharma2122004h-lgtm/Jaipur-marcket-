const { NextResponse } = require("next/server");
const { db } = require("../../../lib/db");

async function GET() {
  const categories = await db.category.findMany({
    where: { parentId: null },
    include: { children: true },
  });

  return NextResponse.json({ categories });
}

module.exports = { GET };
