import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { ModeToggle } from "./theme-toggle";
import SignOutButton from "./_signout-button/signout-button";

export default async function Home() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }
  const { data: full_name } = await supabase
    .from("user_info")
    .select("full_name")
    .eq("id", data.user.id);

  return (
    <main className="min-h-screen p-12">
      <div className="flex flex-row items-center gap-1">
        {full_name && (
          <h1 className="text-2xl font-bold">
            Welcome back, {full_name[0].full_name}
          </h1>
        )}
        <div className="flex-grow"></div>
        <ModeToggle />
        <SignOutButton />
      </div>
    </main>
  );
}
