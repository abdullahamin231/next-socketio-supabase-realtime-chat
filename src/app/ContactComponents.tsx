import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import AddContactButton from "./AddContactButton";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { BookUser } from "lucide-react";

export interface Contact {
  id: string;
  fallback: string;
  name: string;
  lastSeen: string;
}

export interface CompleteContact extends Contact {
  conversationId: string | undefined;
}

export const ContactButton = ({ userId }: { userId: string }) => {
  return (
    <div className="mb-2 flex items-center justify-between">
      <h2 className="text-lg font-medium">Contacts</h2>
      {/* <AddContactButton userId={userId} /> */}
    </div>
  );
};

interface ContactItemProps extends Contact {
  onClick: () => void;
  classNames?: string;
}

export const ContactItem = ({
  fallback,
  name,
  lastSeen,
  onClick,
  classNames,
}: ContactItemProps) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 rounded-md p-2 hover:bg-muted cursor-pointer ${classNames}`}
    >
      <Avatar className="h-10 w-10 border">
        <AvatarFallback>{fallback}</AvatarFallback>
      </Avatar>
      <div className="flex-1 truncate">
        <p className="text-sm font-medium">{name}</p>
      </div>
      <div className="text-xs text-muted-foreground">{lastSeen}</div>
    </div>
  );
};

interface ContactListProps {
  contacts: CompleteContact[];
  onClick: (contact: CompleteContact) => void;
  loading: boolean;
  selectedContact: Contact | null;
}

export const ContactList = ({
  contacts,
  onClick,
  loading,
  selectedContact,
}: ContactListProps) => {
  if (loading) {
    return <ContactsSkeleton />;
  }
  return (
    <ScrollArea className="h-96">
      {contacts.map((contact, i) => (
        <ContactItem
          classNames={selectedContact?.id === contact.id ? "bg-muted" : ""}
          key={i}
          {...contact}
          onClick={() => onClick(contact)}
        />
      ))}
    </ScrollArea>
  );
};

export const ContactListDrawer = ({
  contacts,
  onClick,
  loading,
  selectedContact,
}: ContactListProps) => {
  return (
    <Drawer>
      <DrawerTrigger className="flex items-center space-x-2 font-semibold px-4 py-2">
        <BookUser /> Contacts
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Your Contacts.</DrawerTitle>
        </DrawerHeader>
        <ContactList {...{ contacts, onClick, loading, selectedContact }} />
        <DrawerFooter>
          <DrawerClose>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export function ContactsSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-md p-2 hover:bg-muted cursor-pointer">
      <Skeleton className="h-10 w-10 border rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[150px]" />
        <Skeleton className="h-4 w-[100px]" />
      </div>
    </div>
  );
}
