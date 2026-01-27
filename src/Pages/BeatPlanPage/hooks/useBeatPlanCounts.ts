import { useState, useEffect } from 'react';
import { getBeatPlanLists, getBeatPlans, getArchivedBeatPlans } from '../../../api/beatPlanService';
import type { BeatPlan } from '../../../api/beatPlanService';

interface BeatPlanCounts {
    templates: number | null;
    active: number | null;
    completed: number | null;
}

export const useBeatPlanCounts = () => {
    const [counts, setCounts] = useState<BeatPlanCounts>({
        templates: null,
        active: null,
        completed: null
    });

    useEffect(() => {
        let isMounted = true;

        // 1. Templates
        getBeatPlanLists().then(res => {
            if (isMounted) {
                setCounts(prev => ({ ...prev, templates: res.success ? res.total : 0 }));
            }
        }).catch(() => {
            if (isMounted) setCounts(prev => ({ ...prev, templates: 0 }));
        });

        // 2. Active (Strictly Active status)
        getBeatPlans().then(res => {
            if (isMounted) {
                const count = res.success
                    ? res.data.filter((p: BeatPlan) => p.status === 'active').length
                    : 0;
                setCounts(prev => ({ ...prev, active: count }));
            }
        }).catch(() => {
            if (isMounted) setCounts(prev => ({ ...prev, active: 0 }));
        });

        // 3. Completed (Archived)
        getArchivedBeatPlans().then(res => {
            if (isMounted) {
                // Check if total is returned directly (optimized), otherwise count list
                const count = (res as any).total ?? (res.success ? res.data.length : 0);
                setCounts(prev => ({ ...prev, completed: count }));
            }
        }).catch(() => {
            if (isMounted) setCounts(prev => ({ ...prev, completed: 0 }));
        });

        return () => {
            isMounted = false;
        };
    }, []);

    return counts;
};
