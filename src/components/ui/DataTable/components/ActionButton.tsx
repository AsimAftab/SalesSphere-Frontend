import { Link } from 'react-router-dom';
import type { TableAction } from '../types';
import { ActionIcons, ActionColors } from '../constants';

interface ActionButtonProps<T> {
  action: TableAction<T>;
  item: T;
  index: number;
}

export function ActionButton<T>({ action, item, index }: ActionButtonProps<T>) {
  const Icon = action.type && ActionIcons[action.type] ? ActionIcons[action.type] : action.icon;
  const colorClass = action.className || (action.type ? ActionColors[action.type] : ActionColors.custom);
  const href = typeof action.href === 'function' ? action.href(item) : action.href;
  const actionLabel = action.label || action.title || '';
  const isDisabled = typeof action.disabled === 'function' ? action.disabled(item) : action.disabled;

  const content = (
    <>
      {Icon && <Icon className="h-5 w-5" />}
      {action.showLabel && <span className="ml-1">{actionLabel}</span>}
    </>
  );

  const baseClassName = `inline-flex items-center gap-1 font-semibold text-sm ${colorClass} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`;

  if (href && !isDisabled) {
    return (
      <Link
        key={`${actionLabel}-${index}`}
        to={href}
        className={`${baseClassName} hover:underline`}
        aria-label={actionLabel}
        title={action.title}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      key={`${actionLabel}-${index}`}
      onClick={(e) => {
        e.stopPropagation();
        if (!isDisabled) action.onClick(item);
      }}
      className={baseClassName}
      aria-label={actionLabel}
      title={action.title}
      disabled={isDisabled}
    >
      {content}
    </button>
  );
}

export default ActionButton;
