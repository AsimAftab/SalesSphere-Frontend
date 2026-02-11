import { useSubscriptionPlansManager } from './hooks/useSubscriptionPlansManager';
import SubscriptionPlansContent from './SubscriptionPlansContent';
import { ErrorBoundary } from '@/components/ui';



export default function SubscriptionPlansPage() {
    const manager = useSubscriptionPlansManager();

    return (
        <>
            <ErrorBoundary>
                <SubscriptionPlansContent manager={manager} />
            </ErrorBoundary>
        </>
    );
}
