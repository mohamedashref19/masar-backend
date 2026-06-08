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

export const createProjectSchema = z.object({
  title: z.string().min(5, "عنوان المشروع يجب أن يكون 5 أحرف على الأقل"),
  description: z
    .string()
    .min(20, "الوصف يجب أن يكون تفصيلياً (20 حرف على الأقل)"),
  category: z.string().min(2, "يرجى تحديد قسم المشروع"),
  // المهارات هناخدها كـ String مفصول بفاصلة، وبعدين نحولها لـ Array قبل ما نبعتها للباك إند
  skillsRequired: z.string().min(2, "يرجى كتابة مهارة واحدة على الأقل"),
  budget: z.coerce.number().min(5, "الميزانية لا يمكن أن تقل عن 5 دولار"), // coerce بيحول الـ string لـ number أوتوماتيك
  deadline: z.string().refine((date) => new Date(date) > new Date(), {
    message: "الموعد النهائي يجب أن يكون في المستقبل",
  }),
});

export const applyProposalSchema = z.object({
  coverLetter: z
    .string()
    .min(20, "تفاصيل العرض يجب أن تكون 20 حرفاً على الأقل"),
  price: z.coerce.number().min(5, "السعر لا يمكن أن يقل عن 5 دولار"),
  duration: z.coerce
    .number()
    .min(1, "مدة التنفيذ يجب أن تكون يوماً واحداً على الأقل"),
});

export const reviewSchema = z.object({
  rating: z.coerce
    .number()
    .min(1, "التقييم يجب أن يكون نجمة واحدة على الأقل")
    .max(5, "التقييم لا يمكن أن يتجاوز 5 نجوم"),
  review: z
    .string()
    .min(10, "التعليق يجب أن يكون 10 أحرف على الأقل ليكون مفيداً"),
});

export const clientSettingsSchema = z.object({
  name: z.string().min(3, "الاسم يجب أن يكون 3 أحرف على الأقل"),
});

// 2. للمستقل (بيانات كاملة)
export const freelancerSettingsSchema = z.object({
  name: z.string().min(3, "الاسم يجب أن يكون 3 أحرف على الأقل"),
  title: z.string().optional(),
  bio: z.string().optional(),
  hourlyRate: z.coerce
    .number()
    .min(0, "السعر لا يمكن أن يكون بالسالب")
    .optional()
    .or(z.literal("")),
  skills: z.array(z.string()).optional(),
  githubLink: z.string().url("رابط غير صحيح").optional().or(z.literal("")), // مهم جداً
  cv: z.any().optional(),
});

export const changePasswordSchema = z
  .object({
    passwordCurrent: z.string().min(1, "يرجى إدخال كلمة المرور الحالية"),
    password: z
      .string()
      .min(8, "كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل"),
    passwordConfirm: z.string().min(1, "يرجى تأكيد كلمة المرور الجديدة"),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "كلمات المرور غير متطابقة",
    path: ["passwordConfirm"], // الإيرور هيظهر تحت حقل التأكيد
  });
