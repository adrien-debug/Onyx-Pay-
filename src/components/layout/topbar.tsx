"use client";

import { Bell, Search } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { Badge } from "@/components/ui/badge";
import { getRoleColor } from "@/lib/utils";

interface TopbarProps {
  title?: string;
  description?: string;
}

export function Topbar({ title, description }: TopbarProps) {
  const { data: session } = useSession();

  return (
    <header className="h-16 border-b border-zinc-800 bg-black/50 backdrop-blur-xl sticky top-0 z-40">
      <div className="flex h-full items-center justify-between px-6">
        {/* Left: Title */}
        <div>
          {title && <h1 className="text-xl font-semibold text-zinc-100">{title}</h1>}
          {description && <p className="text-sm text-zinc-400">{description}</p>}
        </div>

        {/* Right: Search, Notifications, Profile */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <Input
              placeholder="Rechercher..."
              className="w-64 pl-9 bg-zinc-900/50"
            />
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-copper-500" />
          </Button>

          {/* Profile */}
          <div className="flex items-center gap-3 pl-4 border-l border-zinc-800">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-zinc-200">
                {session?.user?.name || "Utilisateur"}
              </p>
              <Badge
                className={`text-[10px] px-1.5 py-0 ${getRoleColor(
                  session?.user?.role || "VIEWER"
                )}`}
              >
                {session?.user?.role || "VIEWER"}
              </Badge>
            </div>
            <Avatar
              fallback={session?.user?.name || "U"}
              size="md"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
