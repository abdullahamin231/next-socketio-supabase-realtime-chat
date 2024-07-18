"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { parseWithZod } from "@conform-to/zod";
import { signupSchema } from "@/app/signup/schema";

export async function signup(prevState: unknown, formData: FormData) {
  const submission = parseWithZod(formData, {
    schema: signupSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: submission.value.email,
    password: submission.value.password,
  };

  const { error } = await supabase.auth.signUp(data);
  if (error) {
    return {
      status: "error",
      message: error.message,
    };
  }

  await supabase.auth.signInWithPassword(data);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    const { error } = await supabase.from("user_info").insert({
      id: user?.id,
      full_name: `${submission.value.firstName} ${submission.value.lastName}`,
    });
    if (error) {
      return {
        status: "error",
        message: error.message,
      };
    }
  }

  revalidatePath("/", "layout");
  redirect("/");
}
