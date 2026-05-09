import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

// ---------------------------------------------------------------------------
// Development passwords — these are only for local development.
// Change them before any real deployment.
// ADMIN password : 1234 (must be changed on first login)
// USER password  : 0000
// ---------------------------------------------------------------------------

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // --- Users ---
  const adminPasswordHash = await bcrypt.hash("1234", 10);
  const userPasswordHash = await bcrypt.hash("0000", 10);

  const admin = await prisma.user.upsert({
    where: { id: "seed-admin" },
    update: {},
    create: {
      id: "seed-admin",
      name: "Тато",
      role: "ADMIN",
      passwordHash: adminPasswordHash,
      mustChangePassword: true,
    },
  });

  const user = await prisma.user.upsert({
    where: { id: "seed-user" },
    update: {},
    create: {
      id: "seed-user",
      name: "Максим",
      role: "USER",
      passwordHash: userPasswordHash,
      mustChangePassword: false,
    },
  });

  console.log(`✅ Users: ${admin.name} (Admin), ${user.name} (User)`);

  // --- Reward definitions ---
  const rewards = [
    { id: "reward-youtube",  name: "20 хв YouTube",         description: "20 хвилин YouTube без обмежень", cost: 1 },
    { id: "reward-money",    name: "30 грн кишенькових",    description: "30 гривень кишенькових грошей",   cost: 1 },
    { id: "reward-icecream", name: "Морозиво",               description: "Одна порція морозива на вибір",   cost: 1 },
    { id: "reward-cinema",   name: "Похід в кіно",           description: "Сімейний похід до кінотеатру",    cost: 3 },
    { id: "reward-gaming",   name: "Година спільної гри",    description: "Година спільної гри з татом",     cost: 5 },
  ];

  for (const reward of rewards) {
    await prisma.rewardDefinition.upsert({
      where: { id: reward.id },
      update: {},
      create: reward,
    });
  }

  console.log(`✅ Rewards: ${rewards.map((r) => r.name).join(", ")}`);
  console.log("🎉 Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
