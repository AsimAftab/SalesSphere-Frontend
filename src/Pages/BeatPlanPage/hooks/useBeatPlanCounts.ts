import { useState, useEffect } from 'react';
import { getBeatPlanCounts } from '../../../api/beatPlanService';

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

        getBeatPlanCounts().then(res => {
            if (isMounted && res.success) {
                setCounts({
                    templates: res.data.templates,
                    active: res.data.active,
                    completed: res.data.completed
                });
            }
        }).catch(() => {
            if (isMounted) setCounts({ templates: 0, active: 0, completed: 0 });
        });

        return () => {
            isMounted = false;
        };
    }, []);

    return counts;
};
