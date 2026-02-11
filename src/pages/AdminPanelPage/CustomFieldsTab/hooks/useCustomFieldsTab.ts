import { useState, useMemo } from 'react';
import { useAuth } from '@/api/authService';
import { isFeatureEnabled } from '@/api/auth/permissionUtils';
import { CATEGORY_CONFIGS } from '../categoryConfig';
import type { CategoryConfig } from '../categoryConfig';

export function useCustomFieldsTab() {
  const { user, isLoading } = useAuth();

  const enabledCategories = useMemo(() => {
    if (!user) return [];
    return CATEGORY_CONFIGS.filter((config) => isFeatureEnabled(user, config.module));
  }, [user]);

  const [selectedKey, setSelectedKey] = useState<string>('');

  // Derive the actual selected key: use state if valid, otherwise default to first enabled
  const effectiveSelectedKey = useMemo(() => {
    if (enabledCategories.length === 0) return '';
    const isValid = enabledCategories.some((c) => c.key === selectedKey);
    return isValid ? selectedKey : enabledCategories[0].key;
  }, [enabledCategories, selectedKey]);

  const selectedConfig: CategoryConfig | undefined = useMemo(
    () => enabledCategories.find((c) => c.key === effectiveSelectedKey),
    [enabledCategories, effectiveSelectedKey]
  );

  return {
    enabledCategories,
    selectedKey: effectiveSelectedKey,
    setSelectedKey,
    selectedConfig,
    isLoading,
  };
}
