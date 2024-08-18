"use client";
import {
  LoginLink,
  LogoutLink,
  useKindeBrowserClient
} from "@kinde-oss/kinde-auth-nextjs";
import { LogIn, LogOut, Save } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface CornerControlProps {
  handleSave: () => void;
}

const CornerControl = ({ handleSave }: CornerControlProps) => {
  const { user } = useKindeBrowserClient();

  return (
    <div className="w-fit p-4 m-auto">
      <Card className="flex gap-2 p-2">
        <Button
          className="w-fit h-fit p-2"
          onClick={handleSave}
          variant="outline"
        >
          <Save />
        </Button>
        <Button className="w-fit h-fit p-2" variant="outline">
          {user ? (
            <LogoutLink>
              <LogOut />
            </LogoutLink>
          ) : (
            <LoginLink>
              <LogIn />
            </LoginLink>
          )}
        </Button>
      </Card>
    </div>
  );
};

export default CornerControl;
