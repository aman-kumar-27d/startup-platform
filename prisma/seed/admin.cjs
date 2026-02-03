require("dotenv/config");
const { PrismaClient, Role } = require("@prisma/client");
const bcrypt = require("bcrypt");

// Instantiate PrismaClient without unsupported options; env is loaded above
const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || "";
  const password = process.env.ADMIN_PASSWORD || ""; 

  const hashedPassword = await bcrypt.hash(password, 12);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  console.log("✅ Admin user ready:", admin.email);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
