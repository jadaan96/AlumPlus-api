import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

/** حساب ثابت — يُنشأ/يُحدَّث تلقائياً عند تشغيل الخادم (لا حاجة لـ db:seed يدوياً) */
export async function ensureDefaultAdmin(): Promise<void> {
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "admin123";
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { username },
    update: { passwordHash },
    create: { username, passwordHash },
  });
}
