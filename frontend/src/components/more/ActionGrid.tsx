"use client";

import { icon } from "@/components/ui/icons";
import { Key } from "@/components/ui/Key";
import { sendKey } from "@/hooks/useRemote";
import { ACTION_GROUPS, type ActionGroup } from "./moreActions";

export function ActionGrid({ group }: { group: ActionGroup }) {
  return (
    <div className="flex flex-col gap-6">
      {ACTION_GROUPS[group].map(({ title, actions }) => (
        <section key={title} aria-label={title} className="flex flex-col gap-2.5">
          <div className="label">{title}</div>
          <div className="grid grid-cols-3 gap-2.5">
            {actions.map(({ k, label, Icon }) => (
              <Key key={k} onPress={() => sendKey(k)} className="h-[72px] px-1 text-center">
                <Icon {...icon} />
                <span className="cap leading-tight">{label}</span>
              </Key>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
