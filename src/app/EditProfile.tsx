"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User } from "@supabase/supabase-js";
import { supabase } from "./actions";
import { useState } from "react";

export function EditProfile({
  userId,
  full_name,
}: {
  userId: string;
  full_name: string;
}) {
  const [fullName, setFullName] = useState({
    firstName: full_name.split(" ")[0],
    lastName: full_name.split(" ")[1],
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFullName((prev) => ({ ...prev, [name]: [value] }));
  };

  const handleSubmit = async () => {
    const FullName = `${fullName.firstName} ${fullName.lastName}`;
    const { data, error } = await supabase
      .from("user_info")
      .update({ full_name: FullName })
      .eq("id", userId);

    
    if (error) setError(error.message);
    else setError(""); // Clear error if successful
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Avatar className="h-10 w-10 border cursor-pointer">
          <AvatarFallback>
            {`${fullName.firstName.split("")[0]}${fullName.lastName.split("")[0]}`}
          </AvatarFallback>
        </Avatar>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;t re
            done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="firstName">First name</Label>
            <Input
              value={fullName.firstName}
              // @ts-ignore
              onChange={handleChange}
              name="firstName"
              type="text"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="lastName">Last name</Label>
            <Input
              value={fullName.lastName}
              // @ts-ignore
              onChange={handleChange}
              name="lastName"
              type="text"
            />
          </div>
        </div>
        {error && (
          <div className="col-span-2 text-sm text-red-500">{error}</div>
        )}
        <DialogFooter className="place-self-end">
          <Button onClick={handleSubmit} type="button">
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
