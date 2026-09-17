const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

async function main() {
  const categories = [
    { name: "Oxidized Jewellery", slug: "oxidized-jewellery" },
    { name: "Kurtis", slug: "kurtis" },
    { name: "Printed Shirts", slug: "printed-shirts" },
    { name: "Printed T-Shirts", slug: "printed-tshirts" },
    { name: "Back Pouches", slug: "back-pouches" },
    { name: "Fabric", slug: "fabric" },
  ];

  for (const cat of categories) {
    await db.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  console.log("Seeded categories:", categories.map((c) => c.name).join(", "));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
