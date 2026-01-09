import { z } from "zod";

// フォームのバリデーションスキーマ
export const userFormSchema = z.object({
  name: z
    .string({ required_error: "名前は必須です" })
    .min(1, "名前は必須です")
    .max(50, "名前は50文字以内で入力してください"),
  email: z
    .string({ required_error: "メールアドレスは必須です" })
    .min(1, "メールアドレスは必須です")
    .email("有効なメールアドレスを入力してください"),
  gender: z.enum(["male", "female", "other"], {
    required_error: "性別を選択してください",
  }),
  terms: z
    .boolean({ required_error: "利用規約への同意が必要です" })
    .refine((val) => val === true, {
      message: "利用規約への同意が必要です",
    }),
});

export type UserFormData = z.infer<typeof userFormSchema>;
