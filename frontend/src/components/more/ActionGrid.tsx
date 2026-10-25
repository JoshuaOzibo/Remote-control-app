"use client";

import { useEffect, useRef, useState } from "react";
import { icon } from "@/components/ui/icons";
import { Key } from "@/components/ui/Key";
import { sendKey } from "@/hooks/useRemote";
import type { KeyName } from "@/lib/protocol";
import { cn } from "@/lib/utils";
import { ACTION_GROUPS, type Action, type ActionGroup } from "./moreActions";

const CONFIRM_MS = 2000;

export function ActionGrid({ group }: { group: ActionGroup }) {
  const [armed, setArmed] = useState<KeyName | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const press = ({ k, confirm }: Action) => {
    clearTimeout(timer.current);
    if (confirm && armed !== k) {
      setArmed(k);
      timer.current = setTimeout(() => setArmed(null), CONFIRM_MS);
      return;
    }
    setArmed(null);
    sendKey(k);
  };

  return (
    <div className="flex flex-col gap-6">
      {ACTION_GROUPS[group].map(({ title, actions }) => (
        <section key={title} aria-label={title} className="flex flex-col gap-2.5">
          <div className="label">{title}</div>
          <div className="grid grid-cols-3 gap-2.5">
            {actions.map((action) => {
              const { k, label, Icon, hint } = action;
              const waiting = armed === k;
              return (
                <Key
                  key={k}
                  onPress={() => press(action)}
                  aria-label={waiting ? `${label}: tap again to confirm` : label}
                  className={cn(
                    "h-[88px] gap-1 px-1 text-center",
                    waiting && "text-amber outline-2 outline-offset-2 outline-amber",
                  )}
                >
                  <Icon {...icon} />
                  <span className={cn("cap leading-tight", waiting ? "font-semibold text-amber" : "text-text")}>
                    {waiting ? "Tap again" : label}
                  </span>
                  <span className="font-mono text-[10px] leading-tight text-dim">{waiting ? "to confirm" : hint}</span>
                </Key>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
