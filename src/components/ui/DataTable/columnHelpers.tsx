import type React from 'react';
import { Link } from 'react-router-dom';
import { Eye, type LucideIcon } from 'lucide-react';
import type { TableColumn } from './types';
import { VIEW_DETAILS_STYLE } from './constants';

/** Create a text column */
export function textColumn<T>(
  key: string,
  label: string,
  accessorOrOptions?: keyof T | ((item: T) => string) | ({ accessor?: keyof T | ((item: T) => string); className?: string } & Partial<TableColumn<T>>),
  options?: Partial<TableColumn<T>>
): TableColumn<T> {
  let accessor: keyof T | ((item: T) => string) | undefined;
  let cellClassName: string | undefined;
  let rest: Partial<TableColumn<T>> = {};

  if (accessorOrOptions) {
    if (typeof accessorOrOptions === 'object' && accessorOrOptions !== null) {
      const { accessor: acc, className, ...restOptions } = accessorOrOptions;
      accessor = acc;
      cellClassName = className;
      rest = restOptions;
    } else {
      accessor = accessorOrOptions as keyof T | ((item: T) => string);
      if (options) {
        const { className, ...restOptions } = options as { className?: string } & Partial<TableColumn<T>>;
        cellClassName = className;
        rest = restOptions;
      }
    }
  }

  return {
    key,
    label,
    accessor: accessor || (key as keyof T),
    cellClassName,
    ...rest,
  };
}

/** Create a currency column */
export function currencyColumn<T>(
  key: string,
  label: string,
  accessorOrOptions?: keyof T | ((item: T) => number) | ({ accessor?: keyof T | ((item: T) => number); locale?: string; currency?: string; prefix?: string } & Partial<TableColumn<T>>),
  options?: { locale?: string; currency?: string; prefix?: string; render?: (value: unknown, item: T, index: number) => React.ReactNode } & Partial<TableColumn<T>>
): TableColumn<T> {
  let accessor: keyof T | ((item: T) => number) | undefined;
  let locale = 'en-IN';
  let prefix = '₹ ';
  let customRender: ((value: unknown, item: T, index: number) => React.ReactNode) | undefined;
  let rest: Partial<TableColumn<T>> = {};

  if (accessorOrOptions) {
    if (typeof accessorOrOptions === 'object' && accessorOrOptions !== null) {
      const { accessor: acc, locale: loc, prefix: pre, render: rend, ...restOptions } = accessorOrOptions;
      accessor = acc;
      if (loc) locale = loc;
      if (pre) prefix = pre;
      customRender = rend;
      rest = restOptions;
    } else {
      accessor = accessorOrOptions as keyof T | ((item: T) => number);
      if (options) {
        locale = options.locale || locale;
        prefix = options.prefix || prefix;
        customRender = options.render;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { locale: _l, prefix: _p, render: _r, ...restOpts } = options;
        rest = restOpts;
      }
    }
  }

  return {
    key,
    label,
    accessor: accessor || (key as keyof T),
    render: customRender || ((value) => {
      const num = Number(value);
      if (isNaN(num)) return '-';
      return `${prefix}${num.toLocaleString(locale)}`;
    }),
    ...rest,
  };
}

/** Create an image column */
export function imageColumn<T>(
  key: string,
  label: string,
  options: {
    getImageUrl: (item: T) => string | undefined;
    getFallback: (item: T) => string;
    onClick?: (item: T) => void;
  } & Partial<TableColumn<T>>
): TableColumn<T> {
  const { getImageUrl, getFallback, onClick, ...rest } = options;
  return {
    key,
    label,
    render: (_, item) => {
      const imageUrl = getImageUrl(item);
      const fallback = getFallback(item);

      if (imageUrl) {
        return (
          <img
            src={imageUrl}
            alt={fallback}
            className={`h-10 w-10 rounded-md object-cover ${onClick ? 'cursor-pointer' : ''}`}
            onClick={onClick ? (e) => { e.stopPropagation(); onClick(item); } : undefined}
            onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); onClick(item); } } : undefined}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : undefined}
          />
        );
      }
      return (
        <div className="h-10 w-10 rounded-md bg-secondary flex items-center justify-center text-white font-bold">
          {fallback.substring(0, 2).toUpperCase()}
        </div>
      );
    },
    ...rest,
  };
}

/** Create a status badge column */
export function statusColumn<T>(
  key: string,
  label: string,
  accessorOrOptions?: keyof T | ((item: T) => string) | ({
    accessor?: keyof T | ((item: T) => string);
    onClick?: (item: T) => void;
    disabled?: boolean;
    StatusComponent?: React.ComponentType<{ status: string; onClick?: () => void; disabled?: boolean }>;
  } & Partial<TableColumn<T>>),
  options?: {
    onClick?: (item: T) => void;
    disabled?: boolean;
    StatusComponent?: React.ComponentType<{ status: string; onClick?: () => void; disabled?: boolean }>;
  } & Partial<TableColumn<T>>
): TableColumn<T> {
  let accessor: keyof T | ((item: T) => string) | undefined;
  let onClick: ((item: T) => void) | undefined;
  let disabled = false;
  let StatusComponent: React.ComponentType<{ status: string; onClick?: () => void; disabled?: boolean }> | undefined;
  let rest: Partial<TableColumn<T>> = {};

  if (accessorOrOptions) {
    if (typeof accessorOrOptions === 'object' && accessorOrOptions !== null) {
      accessor = accessorOrOptions.accessor;
      onClick = accessorOrOptions.onClick;
      disabled = accessorOrOptions.disabled || false;
      StatusComponent = accessorOrOptions.StatusComponent;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { accessor: _a, onClick: _c, disabled: _d, StatusComponent: _s, ...restOpts } = accessorOrOptions;
      rest = restOpts;
    } else {
      accessor = accessorOrOptions as keyof T | ((item: T) => string);
      if (options) {
        onClick = options.onClick;
        disabled = options.disabled || false;
        StatusComponent = options.StatusComponent;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { onClick: _c, disabled: _d, StatusComponent: _s, ...restOpts } = options;
        rest = restOpts;
      }
    }
  }

  // Default status badge component
  const DefaultStatusBadge: React.FC<{ status: string; onClick?: () => void; disabled?: boolean }> = ({ status, onClick: handleClick, disabled: isDisabled }) => {
    const getStatusColor = (s: string) => {
      const statusLower = s.toLowerCase();
      if (['active', 'approved', 'completed', 'success', 'delivered'].some(x => statusLower.includes(x))) {
        return 'bg-green-100 text-green-800';
      }
      if (['pending', 'processing', 'in progress'].some(x => statusLower.includes(x))) {
        return 'bg-yellow-100 text-yellow-800';
      }
      if (['rejected', 'cancelled', 'failed', 'inactive'].some(x => statusLower.includes(x))) {
        return 'bg-red-100 text-red-800';
      }
      return 'bg-gray-100 text-gray-800';
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)} ${handleClick && !isDisabled ? 'cursor-pointer hover:opacity-80' : ''}`}
        onClick={handleClick && !isDisabled ? handleClick : undefined}
        onKeyDown={handleClick && !isDisabled ? (e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); } : undefined}
        role={handleClick && !isDisabled ? 'button' : undefined}
        tabIndex={handleClick && !isDisabled ? 0 : undefined}
      >
        {status}
      </span>
    );
  };

  return {
    key,
    label,
    accessor: accessor || (key as keyof T),
    render: (value, item) => {
      const Component = StatusComponent || DefaultStatusBadge;
      return (
        <Component
          status={String(value)}
          onClick={onClick && !disabled ? () => onClick(item) : undefined}
          disabled={disabled}
        />
      );
    },
    ...rest,
  };
}

/** Create a link column */
export function linkColumn<T>(
  keyOrLabel: string,
  labelOrGetHref: string | ((item: T) => string),
  options?: {
    key?: string;
    getHref?: (item: T) => string;
    getText?: (item: T) => string;
    icon?: LucideIcon;
    state?: (item: T) => Record<string, unknown>;
  } & Partial<TableColumn<T>>
): TableColumn<T> {
  let key: string;
  let label: string;
  let getHref: (item: T) => string;
  let getText: ((item: T) => string) | undefined;
  let Icon: LucideIcon | undefined;
  let state: ((item: T) => Record<string, unknown>) | undefined;
  let rest: Partial<TableColumn<T>> = {};

  if (typeof labelOrGetHref === 'function') {
    label = keyOrLabel;
    getHref = labelOrGetHref;
    key = options?.key || 'link';
    getText = options?.getText;
    Icon = options?.icon;
    state = options?.state;
    if (options) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { key: _k, getHref: _h, getText: _t, icon: _i, state: _st, ...restOpts } = options;
      rest = restOpts;
    }
  } else {
    key = keyOrLabel;
    label = labelOrGetHref;
    getHref = options?.getHref || (() => '#');
    getText = options?.getText;
    Icon = options?.icon;
    state = options?.state;
    if (options) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { key: _k, getHref: _h, getText: _t, icon: _i, state: _st, ...restOpts } = options;
      rest = restOpts;
    }
  }

  return {
    key,
    label,
    render: (_, item) => (
      <Link
        to={getHref(item)}
        state={state ? state(item) : undefined}
        className={VIEW_DETAILS_STYLE}
      >
        {Icon && <Icon className="w-5 h-5" />}
        {getText ? getText(item) : 'View Details'}
      </Link>
    ),
    ...rest,
  };
}

/** Create a View Details column with consistent styling */
export function viewDetailsColumn<T>(
  getHref: ((item: T) => string) | string,
  options?: {
    label?: string;
    getText?: (item: T) => string;
    onClick?: (item: T) => void;
    state?: (item: T) => Record<string, unknown>;
  } & Partial<TableColumn<T>>
): TableColumn<T> {
  const label = options?.label || 'View Details';
  const getText = options?.getText;
  const onClick = options?.onClick;
  const state = options?.state;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { label: _l, getText: _g, onClick: _o, state: _s, ...rest } = options || {};

  if (onClick) {
    return {
      key: 'viewDetails',
      label,
      render: (_, item) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick(item);
          }}
          className={VIEW_DETAILS_STYLE}
        >
          <Eye className="w-5 h-5" />
          {getText ? getText(item) : 'View Details'}
        </button>
      ),
      ...rest,
    };
  }

  return {
    key: 'viewDetails',
    label,
    render: (_, item) => (
      <Link
        to={typeof getHref === 'function' ? getHref(item) : getHref}
        state={state ? state(item) : undefined}
        className={VIEW_DETAILS_STYLE}
      >
        <Eye className="w-5 h-5" />
        {getText ? getText(item) : 'View Details'}
      </Link>
    ),
    ...rest,
  };
}

/** Create a date column */
export function dateColumn<T>(
  key: string,
  label: string,
  accessorOrOptions?: keyof T | ((item: T) => string | Date) | ({ accessor?: keyof T | ((item: T) => string | Date); format?: Intl.DateTimeFormatOptions; locale?: string } & Partial<TableColumn<T>>)
): TableColumn<T> {
  let accessor: keyof T | ((item: T) => string | Date) | undefined;
  let format: Intl.DateTimeFormatOptions | undefined;
  let locale = 'en-GB';
  let rest: Partial<TableColumn<T>> = {};

  if (accessorOrOptions) {
    if (typeof accessorOrOptions === 'object' && accessorOrOptions !== null) {
      const { accessor: acc, format: fmt, locale: loc, ...restOptions } = accessorOrOptions;
      accessor = acc;
      format = fmt;
      if (loc) locale = loc;
      rest = restOptions;
    } else {
      accessor = accessorOrOptions as keyof T | ((item: T) => string | Date);
    }
  }

  const defaultFormat: Intl.DateTimeFormatOptions = format || {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  };

  return {
    key,
    label,
    accessor: accessor || (key as keyof T),
    render: (value) => {
      if (!value) return '-';
      const date = value instanceof Date ? value : new Date(String(value));
      if (isNaN(date.getTime())) return String(value);
      return date.toLocaleDateString(locale, defaultFormat);
    },
    ...rest,
  };
}
