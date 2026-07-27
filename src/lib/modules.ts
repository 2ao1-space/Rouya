import {
  BookOpen,
  ChartArea,
  Folder,
  Moon,
  Notebook,
  Target,
  Wallet,
} from "lucide-react";

export const ALL_MODULES = [
  { id: "finance", label: "الماليات", icon: Wallet, href: "/finance" },
  { id: "prayer", label: "الصلاة", icon: Moon, href: "/prayer" },
  { id: "adhkar", label: "الأذكار", icon: BookOpen, href: "/adhkar" },
  { id: "notes", label: "الملاحظات", icon: Notebook, href: "/notes" },
  {
    id: "documents",
    label: "الوثائق",
    icon: Folder,
    href: "/documents",
  },
  { id: "habits", label: "العادات", icon: Target, href: "/habits" },
  {
    id: "analytics",
    label: "التحليلات",
    icon: ChartArea,
    href: "/analytics",
  },
];
