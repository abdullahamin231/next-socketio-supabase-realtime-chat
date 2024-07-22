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
import { getAllUsers } from "./actions";
import { ScrollArea } from "@radix-ui/react-scroll-area";

interface Option {
  id: string;
  full_name: string;
  last_seen: string;
}

export default function AddContactButton({ userId }: { userId: string }) {
  const [searchBy, setSearchBy] = useState<"name" | "email">("email");
  // hydration error fix
  const [isClient, setIsClient] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [options, setOptions] = useState<Option[]>([]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // or a loading placeholder
  }

  const handleSearch = async () => {
    const response = await getAllUsers(searchBy, searchInput);
    if (response) {
      setOptions(response);
    }
  };

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
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={
                searchBy === "name" ? "John Doe" : "johndoe@gmail.com"
              }
              className="col-span-3"
            />
            <button
              onClick={handleSearch}
              type="button"
              className="px-3 h-9 rounded-md hover:bg-muted"
            >
              <span className="sr-only">Search</span>
              <Search className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="border-t-2 py-2">
          {options.length > 0 && (
            <ScrollArea className="space-y-2 h-44">
              {options.map((option: Option) => (
                <OptionItem option={option} userId={userId} />
              ))}
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

const OptionItem = ({ option, userId }: { option: Option; userId: string }) => {
  const [sent, setSent] = useState(false);
  return (
    <div className="flex items-center justify-between">
      <p>{option.full_name}</p>
      <Button
        disabled={sent}
        onClick={() => {
          setSent(true);
        }}
      >
        {sent ? "Request Sent!" : "Send Request"}
      </Button>
    </div>
  );
};
