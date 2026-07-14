import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot, FileSearch, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/dashboard/copilot", label: "Copilot", icon: Bot },
  { href: "/dashboard/reports", label: "Reports", icon: FileSearch },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#060d18]/95 p-2 backdrop-blur lg:hidden">
      <div className="grid grid-cols-3 gap-1">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "grid place-items-center rounded-md py-2 text-[11px] text-zinc-400",
              (pathname === item.href || pathname?.startsWith(item.href + "/")) && "bg-cyan-500/10 text-cyan-200"
            )}
          >
            <item.icon className="mb-1 size-4" />
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
