import { prisma } from "../src/lib/prima";

async function seed() {
  await prisma.event.create({
    data: {
      id: "73f6a9ef-94ea-4ac0-b7ad-0e11f64cbe15",
      title: "Unite Summit",
      slug: "unite-summit",
      details: "A conference for developers",
      maximumAttendees: 120,
    },
  });
}

seed().then(() => {
  console.log("Seed complete!");
  prisma.$disconnect();
});
