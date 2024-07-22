import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import AddContactButton from "./AddContactButton";
import { Skeleton } from "@/components/ui/skeleton"


export interface Contact {
  id: string;
  fallback: string;
  name: string;
  latestMessage: string;
  lastSeen: string;
}

export interface CompleteContact extends Contact {
  conversationId: string | undefined;
}

export const ContactButton = () => {
  return (
    <div className="mb-2 flex items-center justify-between">
      <h2 className="text-lg font-medium">Contacts</h2>
      <AddContactButton />
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
  latestMessage,
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
        <p className="text-xs text-muted-foreground">{latestMessage}</p>
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

export const ContactList = ({ contacts, onClick, loading, selectedContact }: ContactListProps) => {
  if(loading){
    return <ContactsSkeleton />
  }
  return (
    <ScrollArea className="h-96">
      {contacts.map((contact, i) => (
        <ContactItem classNames={selectedContact?.id === contact.id ? "bg-muted":""} key={i} {...contact} onClick={() => onClick(contact)} />
      ))}
    </ScrollArea>
  );
};


export function ContactsSkeleton() {
  return (
    <div
      className="flex items-center gap-3 rounded-md p-2 hover:bg-muted cursor-pointer"
    >
      <Skeleton className="h-10 w-10 border rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[150px]" />
        <Skeleton className="h-4 w-[100px]" />
      </div>
    </div>
  )
}
