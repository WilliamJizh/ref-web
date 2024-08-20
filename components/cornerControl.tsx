"use client";
import {
  LoginLink,
  LogoutLink,
  useKindeBrowserClient,
} from "@kinde-oss/kinde-auth-nextjs";
import { Car, LogIn, LogOut, Save, User } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Skeleton } from "./ui/skeleton";

interface CornerControlProps {
  handleSave: () => void;
}

const CornerControl = ({ handleSave }: CornerControlProps) => {
  const { user, isLoading } = useKindeBrowserClient();

  const UserInfoDisplay = () => {
    const userName = user?.given_name + " " + user?.family_name || user?.email;
    if (isLoading) {
      return (
        <div className="flex flex-col items-center p-2 gap-2 w-64 md:w-96 lg:w-128">
          <Skeleton className="w-36 h-4 " />
          <Skeleton className="w-12 h-12 rounded-full" />
          <Skeleton className="w-36 h-4 " />
          <Skeleton className="w-36 h-12 " />
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center p-2 gap-8 w-64 md:w-96">
        <div className="text-sm text-gray-500">{user?.email}</div>
        <div className="flex flex-col items-center gap-2">
          <Avatar className="m-auto w-12 h-12">
            <AvatarImage src={user?.picture || ""} />
            <AvatarFallback>{userName}</AvatarFallback>
          </Avatar>
          <div className="text-xl font-bold">{userName}</div>
        </div>
        <Button variant="outline" className="w-fit h-fit p-2 px-4">
          <LogoutLink>Logout</LogoutLink>
        </Button>
      </div>
    );
  };

  return (
    <div className="w-fit p-4 m-auto">
      <Card className="flex gap-2 p-2">
        <Button
          className="w-fit h-fit p-2"
          onClick={() => {
            if (!user) {
              return;
            }
            handleSave();
          }}
          variant="outline"
        >
          {user ? (
            <Save />
          ) : (
            <LoginLink>
              <Save />
            </LoginLink>
          )}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-fit h-fit p-2">
              <User />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {user ? (
              <UserInfoDisplay />
            ) : (
              <DropdownMenuItem>
                <LoginLink>Login</LoginLink>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </Card>
    </div>
  );
};

export default CornerControl;
