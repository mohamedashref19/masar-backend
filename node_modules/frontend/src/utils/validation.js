import * as z from "zod";

const passwordSchema = z.string().min(8, "كلمة المرور يجب أن لا تقل عن 8 أحرف");
const emailSchema = z.string().email("صيغة البريد الإلكتروني غير صحيحة");

export const registerSchema = z
  .object({
    name: z.string().min(3, "الاسم لازم يكون 3 حروف على الأقل"),
    email: emailSchema,
    password: passwordSchema,
    passwordConfirm: z.string(),
    role: z.enum(["client", "freelancer"], {
      errorMap: () => ({ message: "يجب اختيار نوع الحساب" }),
    }),
    companyName: z.string().optional(),
    title: z.string().optional(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "كلمات المرور غير متطابقة",
    path: ["passwordConfirm"],
  })
  // تم نقل الـ superRefine إلى هنا (مكانه الصحيح)
  .superRefine((data, ctx) => {
    if (data.role === "client" && !data.companyName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "اسم الشركة مطلوب لأصحاب الأعمال",
        path: ["companyName"],
      });
    }
    if (data.role === "freelancer" && !data.title) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "المسمى الوظيفي مطلوب للمستقلين",
        path: ["title"],
      });
    }
  });

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "كلمة المرور مطلوبة"),
});
