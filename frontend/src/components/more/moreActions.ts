import {
  Activity,
  AppWindow,
  ArrowDownToLine,
  ArrowLeft,
  ArrowRight,
  ArrowRightLeft,
  ArrowUpToLine,
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
  LayoutGrid,
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
  Settings,
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

export type Action = { k: KeyName; label: string; Icon: LucideIcon; hint: string; confirm?: boolean };

export type ActionSection = { title: string; actions: Action[] };

const LAPTOP: ActionSection[] = [
  {
    title: "Apps",
    actions: [
      { k: "start", label: "Start menu", Icon: Grid2x2, hint: "Win" },
      { k: "search", label: "Search", Icon: Search, hint: "Win + S" },
      { k: "explorer", label: "Files", Icon: FolderOpen, hint: "Win + E" },
      { k: "switch", label: "Switch app", Icon: ArrowRightLeft, hint: "Alt + Tab" },
      { k: "taskview", label: "All windows", Icon: LayoutGrid, hint: "Win + Tab" },
      { k: "desktop", label: "Show desktop", Icon: House, hint: "Win + D" },
    ],
  },
  {
    title: "Window",
    actions: [
      { k: "minimize", label: "Make smaller", Icon: Minimize2, hint: "Win + Down" },
      { k: "maximize", label: "Make bigger", Icon: Maximize2, hint: "Win + Up" },
      { k: "closewindow", label: "Close app", Icon: X, hint: "Alt + F4", confirm: true },
      { k: "snapleft", label: "Left half", Icon: PanelLeft, hint: "Win + Left" },
      { k: "snapright", label: "Right half", Icon: PanelRight, hint: "Win + Right" },
      { k: "fullscreen", label: "Full screen", Icon: Maximize, hint: "F" },
    ],
  },
  {
    title: "Laptop",
    actions: [
      { k: "lock", label: "Lock", Icon: Lock, hint: "Win + L", confirm: true },
      { k: "settings", label: "Settings", Icon: Settings, hint: "Win + I" },
      { k: "quicksettings", label: "Quick settings", Icon: Settings2, hint: "Win + A" },
      { k: "notifications", label: "Notifications", Icon: Bell, hint: "Win + N" },
      { k: "project", label: "Second screen", Icon: Cast, hint: "Win + P" },
      { k: "snip", label: "Screenshot", Icon: Crop, hint: "Win + Shift + S" },
    ],
  },
  {
    title: "Watching",
    actions: [
      { k: "prev", label: "Previous", Icon: SkipBack, hint: "Media key" },
      { k: "playpause", label: "Play / pause", Icon: CirclePlay, hint: "Media key" },
      { k: "next", label: "Next", Icon: SkipForward, hint: "Media key" },
    ],
  },
  {
    title: "Fix problems",
    actions: [{ k: "taskmanager", label: "Task Manager", Icon: Activity, hint: "Ctrl + Shift + Esc", confirm: true }],
  },
];

const SHORTCUTS: ActionSection[] = [
  {
    title: "Web browser",
    actions: [
      { k: "back", label: "Back", Icon: ArrowLeft, hint: "Alt + Left" },
      { k: "forward", label: "Forward", Icon: ArrowRight, hint: "Alt + Right" },
      { k: "refresh", label: "Refresh", Icon: RefreshCw, hint: "F5" },
      { k: "addressbar", label: "Web address", Icon: Link, hint: "Ctrl + L" },
      { k: "find", label: "Find on page", Icon: TextSearch, hint: "Ctrl + F" },
      { k: "menu", label: "Right-click menu", Icon: MousePointerClick, hint: "Shift + F10" },
      { k: "pageup", label: "Page up", Icon: ArrowUpToLine, hint: "Page Up" },
      { k: "pagedown", label: "Page down", Icon: ArrowDownToLine, hint: "Page Down" },
    ],
  },
  {
    title: "Tabs",
    actions: [
      { k: "newtab", label: "New tab", Icon: SquarePlus, hint: "Ctrl + T" },
      { k: "closetab", label: "Close tab", Icon: SquareX, hint: "Ctrl + W", confirm: true },
      { k: "reopentab", label: "Reopen tab", Icon: History, hint: "Ctrl + Shift + T" },
      { k: "prevtab", label: "Previous tab", Icon: ChevronsLeft, hint: "Ctrl + Shift + Tab" },
      { k: "nexttab", label: "Next tab", Icon: ChevronsRight, hint: "Ctrl + Tab" },
      { k: "newwindow", label: "New window", Icon: AppWindow, hint: "Ctrl + N" },
    ],
  },
  {
    title: "Zoom",
    actions: [
      { k: "zoomout", label: "Zoom out", Icon: ZoomOut, hint: "Ctrl + -" },
      { k: "zoomreset", label: "Normal size", Icon: SearchX, hint: "Ctrl + 0" },
      { k: "zoomin", label: "Zoom in", Icon: ZoomIn, hint: "Ctrl + =" },
    ],
  },
  {
    title: "Editing",
    actions: [
      { k: "copy", label: "Copy", Icon: Copy, hint: "Ctrl + C" },
      { k: "cut", label: "Cut", Icon: Scissors, hint: "Ctrl + X" },
      { k: "paste", label: "Paste", Icon: ClipboardPaste, hint: "Ctrl + V" },
      { k: "undo", label: "Undo", Icon: Undo2, hint: "Ctrl + Z" },
      { k: "redo", label: "Redo", Icon: Redo2, hint: "Ctrl + Y" },
      { k: "selectall", label: "Select all", Icon: TextSelect, hint: "Ctrl + A" },
      { k: "save", label: "Save", Icon: Save, hint: "Ctrl + S" },
      { k: "clipboard", label: "Copied items", Icon: ClipboardList, hint: "Win + V" },
      { k: "emoji", label: "Emoji", Icon: Smile, hint: "Win + ." },
    ],
  },
];

export const ACTION_GROUPS = { laptop: LAPTOP, shortcuts: SHORTCUTS } as const;

export type ActionGroup = keyof typeof ACTION_GROUPS;

export const GROUP_TITLES: Record<ActionGroup, string> = { laptop: "Laptop & apps", shortcuts: "Web & editing" };

export const GROUP_ORDER: ActionGroup[] = ["laptop", "shortcuts"];
