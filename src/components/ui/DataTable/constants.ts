import { Eye, SquarePen, Trash2, type LucideIcon } from 'lucide-react';

/** Built-in action type icons */
export const ActionIcons: Record<string, LucideIcon> = {
  view: Eye,
  edit: SquarePen,
  delete: Trash2,
};

/** Built-in action type colors */
export const ActionColors: Record<string, string> = {
  view: 'text-blue-500 hover:text-blue-700',
  edit: 'text-blue-700 hover:text-blue-900',
  delete: 'text-red-600 hover:text-red-800',
  custom: 'text-gray-600 hover:text-gray-800',
};

/** Standardized View Details column styling */
export const VIEW_DETAILS_STYLE = 'text-blue-500 hover:underline font-semibold text-sm inline-flex items-center gap-1';
