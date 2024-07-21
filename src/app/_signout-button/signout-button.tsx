"use client";
import { useRouter } from "next/navigation";
import { signOut } from "./actions";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { LogOutIcon } from "lucide-react";

const SignOutButton = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleSignOut = async () => {
    setLoading(true);
    const response = await signOut();
    setLoading(false);
    if (response.error === "") {
      router.push("/login");
    }
    return response;
  };

  return (
    <Button
      onClick={async () => {
        const message = await handleSignOut();
        toast({
          title: message!.error,
        });
      }}
      variant="ghost"
      size="icon"
    >
      <LogOutIcon className="h-6 w-6" />
      <span className="sr-only">
        {" "}
        {loading ? "Signing out..." : "Sign out"}
      </span>
    </Button>
  );
};

export default SignOutButton;
