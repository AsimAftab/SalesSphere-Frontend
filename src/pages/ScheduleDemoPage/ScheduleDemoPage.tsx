import { memo } from 'react';
import { DemoContentSection, DemoRequestForm } from './components';
import { DEMO_BENEFITS } from './ScheduleDemoPage.data';

/**
 * ScheduleDemoPage - Landing page for scheduling product demos
 *
 * Layout: Two-column grid with content on left and form on right
 * Follows SOLID principles with separated concerns:
 * - Types: ScheduleDemoPage.types.ts
 * - Schema: ScheduleDemoPage.schema.ts
 * - Data: ScheduleDemoPage.data.ts
 * - Components: components/
 */
const ScheduleDemoPage = memo(() => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-12 sm:pb-16 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        {/* Left Column - Content */}
        <DemoContentSection benefits={DEMO_BENEFITS} />

        {/* Right Column - Form */}
        <DemoRequestForm />
      </div>
    </div>
  </div>
));

ScheduleDemoPage.displayName = 'ScheduleDemoPage';

export default ScheduleDemoPage;
