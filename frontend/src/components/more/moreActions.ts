import {
  Activity,
  AppWindow,
  ArrowLeft,
  ArrowRight,
  ArrowRightLeft,
  Bell,
  Cast,
  ChevronsLeft,
  ChevronsRight,
  CirclePlay,
  ClipboardList,
  ClipboardPaste,
  Copy,
  Crop,
  FolderOpen,
  Grid2x2,
  History,
  House,
  Link,
  Lock,
  Maximize,
  Maximize2,
  Minimize2,
  MousePointerClick,
  PanelLeft,
  PanelRight,
  Redo2,
  RefreshCw,
  Save,
  Scissors,
  Search,
  SearchX,
  Settings2,
  SkipBack,
  SkipForward,
  Smile,
  SquarePlus,
  SquareX,
  TextSearch,
  TextSelect,
  Undo2,
  X,
  ZoomIn,
  ZoomOut,
  type LucideIcon,
} from "lucide-react";
import type { KeyName } from "@/lib/protocol";

export type Action = { k: KeyName; label: string; Icon: LucideIcon };

export type ActionSection = { title: string; actions: Action[] };

const LAPTOP: ActionSection[] = [
  {
    title: "Windows",
    actions: [
      { k: "start", label: "Start", Icon: Grid2x2 },
      { k: "search", label: "Search", Icon: Search },
      { k: "explorer", label: "Files", Icon: FolderOpen },
      { k: "taskmanager", label: "Task manager", Icon: Activity },
      { k: "desktop", label: "Desktop", Icon: House },
      { k: "lock", label: "Lock", Icon: Lock },
    ],
  },
  {
    title: "Window",
    actions: [
      { k: "minimize", label: "Minimize", Icon: Minimize2 },
      { k: "maximize", label: "Maximize", Icon: Maximize2 },
      { k: "switch", label: "Switch", Icon: ArrowRightLeft },
      { k: "snapleft", label: "Snap left", Icon: PanelLeft },
      { k: "snapright", label: "Snap right", Icon: PanelRight },
      { k: "closewindow", label: "Close", Icon: X },
    ],
  },
  {
    title: "Screen and panels",
    actions: [
      { k: "project", label: "Display", Icon: Cast },
      { k: "quicksettings", label: "Quick settings", Icon: Settings2 },
      { k: "notifications", label: "Alerts", Icon: Bell },
      { k: "clipboard", label: "Clipboard", Icon: ClipboardList },
      { k: "emoji", label: "Emoji", Icon: Smile },
      { k: "fullscreen", label: "Full screen", Icon: Maximize },
    ],
  },
  {
    title: "Media",
    actions: [
      { k: "prev", label: "Previous", Icon: SkipBack },
      { k: "playpause", label: "Play / pause", Icon: CirclePlay },
      { k: "next", label: "Next", Icon: SkipForward },
    ],
  },
];

const SHORTCUTS: ActionSection[] = [
  {
    title: "Tabs",
    actions: [
      { k: "newtab", label: "New tab", Icon: SquarePlus },
      { k: "closetab", label: "Close tab", Icon: SquareX },
      { k: "reopentab", label: "Reopen tab", Icon: History },
      { k: "prevtab", label: "Prev tab", Icon: ChevronsLeft },
      { k: "nexttab", label: "Next tab", Icon: ChevronsRight },
      { k: "newwindow", label: "New window", Icon: AppWindow },
    ],
  },
  {
    title: "Browse",
    actions: [
      { k: "back", label: "Back", Icon: ArrowLeft },
      { k: "forward", label: "Forward", Icon: ArrowRight },
      { k: "refresh", label: "Refresh", Icon: RefreshCw },
      { k: "addressbar", label: "Address bar", Icon: Link },
      { k: "find", label: "Find", Icon: TextSearch },
      { k: "menu", label: "Menu", Icon: MousePointerClick },
    ],
  },
  {
    title: "Zoom",
    actions: [
      { k: "zoomout", label: "Zoom out", Icon: ZoomOut },
      { k: "zoomreset", label: "Reset", Icon: SearchX },
      { k: "zoomin", label: "Zoom in", Icon: ZoomIn },
    ],
  },
  {
    title: "Edit",
    actions: [
      { k: "copy", label: "Copy", Icon: Copy },
      { k: "cut", label: "Cut", Icon: Scissors },
      { k: "paste", label: "Paste", Icon: ClipboardPaste },
      { k: "undo", label: "Undo", Icon: Undo2 },
      { k: "redo", label: "Redo", Icon: Redo2 },
      { k: "selectall", label: "Select all", Icon: TextSelect },
      { k: "save", label: "Save", Icon: Save },
      { k: "snip", label: "Snip", Icon: Crop },
    ],
  },
];

export const ACTION_GROUPS = { laptop: LAPTOP, shortcuts: SHORTCUTS } as const;

export type ActionGroup = keyof typeof ACTION_GROUPS;
