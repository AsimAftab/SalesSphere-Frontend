import React, { useMemo } from 'react';
import type { LegalPageData } from './LegalPageLayout.types';
import { useActiveSection } from './hooks';
import {
  LegalHero,
  LegalSidebar,
  LegalMobileNav,
  LegalSectionRenderer,
  LegalFooterNote,
} from './components';

interface Props {
  data: LegalPageData;
}

const LegalPageLayout: React.FC<Props> = ({ data }) => {
  const sectionIds = useMemo(
    () => data.sections.map((s) => s.id),
    [data.sections],
  );

  const activeId = useActiveSection(sectionIds);

  return (
    <div className="bg-gray-100 min-h-screen pt-20">
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <LegalHero
          title={data.title}
          subtitle={data.subtitle}
          lastUpdated={data.lastUpdated}
        />

        <LegalMobileNav sections={data.sections} activeId={activeId} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <LegalSidebar sections={data.sections} activeId={activeId} />

          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 sm:p-8 lg:p-10 space-y-8">
              {data.sections.map((section, i) => (
                <LegalSectionRenderer
                  key={section.id}
                  section={section}
                  isLast={i === data.sections.length - 1}
                />
              ))}

              <LegalFooterNote data={data.footerNote} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LegalPageLayout;
