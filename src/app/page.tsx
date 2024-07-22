import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { ModeToggle } from "./theme-toggle";
import SignOutButton from "./_signout-button/signout-button";
import Link from "next/link";
import { MessagesSquare } from "lucide-react";
import ChatApp from "./ChatApp";
import ConnectedDisplay from "./ConnectedDisplay";
import { EditProfile } from "./EditProfile";

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
    <main className="flex flex-col h-screen overflow-hidden">
      <header className="flex h-16 items-center justify-between border-b border-muted px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <Link href="#" className="flex items-center gap-2" prefetch={false}>
            <MessagesSquare className="h-6 w-6" />
            <span className="font-medium">Chat App</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <ConnectedDisplay />
          <EditProfile userId={data.user.id} full_name={full_name![0].full_name} />
          <ModeToggle />
          <SignOutButton />
        </div>
      </header>
      <ChatApp user={data.user} />
    </main>
  );
}
