"use client";
import { PlusIcon, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function AddContactButton() {
  const [searchBy, setSearchBy] = useState<"name" | "email">("email");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // or a loading placeholder
  }

  return (
    <Dialog>
      <DialogTrigger>
        {" "}
        <Button variant="ghost" size="icon">
          <PlusIcon className="h-5 w-5" />
          <span className="sr-only">Add contact</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a contact</DialogTitle>
          <DialogDescription>
            Search for a person. Click request to make contact.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-start items-center space-x-2">
          <Switch
            onClick={() => setSearchBy(searchBy === "name" ? "email" : "name")}
            id="nameOrEmail"
          />
          <Label htmlFor="nameOrEmail">Search by name</Label>
        </div>
        <div className="grid gap-4 py-1">
          <div className="flex items-center space-x-2">
            <Label htmlFor="name" className="text-right">
              {searchBy === "name" ? "Name" : "Email"}
            </Label>
            <Input
              type={searchBy === "name" ? "text" : "email"}
              id={searchBy === "name" ? "Name" : "Email"}
              placeholder={
                searchBy === "name" ? "John Doe" : "johndoe@gmail.com"
              }
              className="col-span-3"
            />
            <button type="submit" className="px-3 h-9 rounded-md hover:bg-muted">
              <span className="sr-only">Search</span>
              <Search className="h-4 w-4" />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}