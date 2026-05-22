"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronRight, PanelLeftClose, PanelLeft } from "lucide-react";
import { primaryNav, utilityNav, type NavItem } from "@/lib/nav";

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => ({
    "Comment Analysis": true,
  }));

  const toggleExpanded = (label: string) =>
    setExpanded((e) => ({ ...e, [label]: !e[label] }));

  return (
    <aside
      className={`flex h-screen flex-col border-r border-[var(--color-border)] bg-white transition-[width] duration-150 ${
        collapsed ? "w-[64px]" : "w-[240px]"
      }`}
    >
      <div className="flex items-center justify-between px-4 pt-5 pb-4">
        {!collapsed && (
          <Link href="/" className="flex items-center gap-2">
            <span className="inline-block h-5 w-5 rounded-full bg-gradient-to-br from-black to-white border border-black/30" />
            <span className="font-semibold tracking-tight">Pendulum</span>
          </Link>
        )}
        <button
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={() => setCollapsed((c) => !c)}
          className="rounded-md p-1 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
        >
          {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 pb-4">
        {primaryNav.map((item) => (
          <SidebarRow
            key={item.label}
            item={item}
            pathname={pathname}
            collapsed={collapsed}
            expanded={!!expanded[item.label]}
            onToggleExpanded={() => toggleExpanded(item.label)}
          />
        ))}
      </nav>

      <div className="border-t border-[var(--color-border)] px-2 pt-3 pb-3">
        {utilityNav.map((item) => (
          <SidebarRow
            key={item.label}
            item={item}
            pathname={pathname}
            collapsed={collapsed}
            expanded={false}
            onToggleExpanded={() => {}}
          />
        ))}
        <div className="mt-2 flex items-center gap-2 px-2 py-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-900 text-xs font-medium text-white">
            LH
          </span>
          {!collapsed && (
            <div className="min-w-0">
              <div className="truncate text-sm">Levi Howard</div>
              <div className="truncate text-xs text-zinc-500">levi+Levi_san…</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

function SidebarRow({
  item,
  pathname,
  collapsed,
  expanded,
  onToggleExpanded,
}: {
  item: NavItem;
  pathname: string;
  collapsed: boolean;
  expanded: boolean;
  onToggleExpanded: () => void;
}) {
  const Icon = item.icon;
  const hasChildren = !!item.children?.length;
  const isActiveSelf = item.href && pathname === item.href;
  const isActiveDescendant = item.children?.some((c) => pathname.startsWith(c.href));
  const isHighlighted = isActiveSelf || (!hasChildren && isActiveDescendant);

  const rowClasses = `group flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors ${
    isHighlighted
      ? "bg-zinc-100 text-zinc-900"
      : "text-zinc-700 hover:bg-zinc-50"
  } ${item.disabled ? "cursor-default opacity-60" : ""}`;

  const content = (
    <>
      <Icon className="h-4 w-4 flex-shrink-0" />
      {!collapsed && <span className="flex-1 text-left truncate">{item.label}</span>}
      {!collapsed && hasChildren && (
        <ChevronRight
          className={`h-3.5 w-3.5 text-zinc-400 transition-transform ${
            expanded ? "rotate-90" : ""
          }`}
        />
      )}
    </>
  );

  return (
    <div>
      {hasChildren ? (
        <button onClick={onToggleExpanded} className={rowClasses}>
          {content}
        </button>
      ) : item.href && !item.disabled ? (
        <Link href={item.href} className={rowClasses}>
          {content}
        </Link>
      ) : (
        <div className={rowClasses}>{content}</div>
      )}

      {hasChildren && expanded && !collapsed && (
        <div className="ml-7 mt-0.5 mb-1 space-y-0.5">
          {item.children!.map((child) => {
            const childActive = pathname.startsWith(child.href);
            const isReal = child.href !== "#";
            const childClass = `block rounded-md px-2 py-1.5 text-[13px] transition-colors ${
              childActive
                ? "bg-zinc-100 text-zinc-900"
                : "text-zinc-600 hover:bg-zinc-50"
            } ${!isReal ? "cursor-default opacity-60" : ""}`;
            return isReal ? (
              <Link key={child.label} href={child.href} className={childClass}>
                {child.label}
              </Link>
            ) : (
              <div key={child.label} className={childClass}>
                {child.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
