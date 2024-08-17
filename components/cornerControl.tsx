"use client";
import {
  LoginLink,
  LogoutLink,
  RegisterLink,
  useKindeBrowserClient,
} from "@kinde-oss/kinde-auth-nextjs";
import { Card } from "./ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { LogIn, LogOut, Save } from "lucide-react";
import { useNodesState } from "@xyflow/react";

interface CornerControlProps {
  handleSave: () => void;
}

const CornerControl = ({ handleSave }: CornerControlProps) => {
  const { user } = useKindeBrowserClient();

  return (
    <div className="w-fit p-4 m-auto">
      <Card>
        <ToggleGroup type="single" className=" px-2">
          <ToggleGroupItem
            value="button"
            className="w-fit h-fit p-2"
            onClick={handleSave}
          >
            <Save />
          </ToggleGroupItem>
          <ToggleGroupItem value="button" className="w-fit h-fit p-2">
            {user ? (
              <LogoutLink>
                <LogOut />
              </LogoutLink>
            ) : (
              <LoginLink>
                <LogIn />
              </LoginLink>
            )}
          </ToggleGroupItem>
        </ToggleGroup>
      </Card>
    </div>
  );
};

export default CornerControl;
