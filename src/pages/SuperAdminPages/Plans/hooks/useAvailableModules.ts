import { useState, useEffect } from 'react';
import { RoleRepository, type FeatureRegistry } from '@/api/roleService';
import { AVAILABLE_MODULES } from '@/components/modals/SuperAdmin/CustomPlanModal/constants';
import type { EnrichedModule } from '@/components/modals/SuperAdmin/CustomPlanModal/types';

export const useAvailableModules = () => {
    const [availableModules, setAvailableModules] = useState<EnrichedModule[]>([]);
    const [featureRegistry, setFeatureRegistry] = useState<FeatureRegistry>({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [modules, registry] = await Promise.all([
                    RoleRepository.getModules(),
                    RoleRepository.getFeatureRegistry()
                ]);

                // Merge backend modules with local icons
                const enriched = modules.map(backendMod => {
                    const localMod = AVAILABLE_MODULES.find(m => m.id === backendMod.key);
                    return {
                        ...backendMod,
                        icon: localMod?.icon
                    };
                });

                setAvailableModules(enriched);
                setFeatureRegistry(registry);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch modules:", err);
                setError("Failed to load modules");
                // Fallback to local constants if backend fails
                setAvailableModules(AVAILABLE_MODULES.map(m => ({ key: m.id, label: m.label, icon: m.icon })));
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    return {
        availableModules,
        featureRegistry,
        isLoading,
        error
    };
};
