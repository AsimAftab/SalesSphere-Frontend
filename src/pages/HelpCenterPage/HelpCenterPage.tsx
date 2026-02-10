import React, { useState, useMemo } from 'react';
import { categories } from './HelpCenterPage.data';
import {
  HelpCenterHero,
  HelpCenterCategoryGrid,
  HelpCenterAccordionSection,
  HelpCenterContactSection,
} from './components';
import { useDocumentTitle } from '@/hooks';

const HelpCenterPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const query = searchQuery.trim().toLowerCase();

  useDocumentTitle('Help Center | SalesSphere');

  const matchCounts = useMemo(() => {
    if (!query) return null;
    const counts: Record<string, number> = {};
    for (const cat of categories) {
      counts[cat.id] = cat.items.filter(
        (item) =>
          item.question.toLowerCase().includes(query) ||
          item.answer.toLowerCase().includes(query),
      ).length;
    }
    return counts;
  }, [query]);

  const selectedCategory = selectedCategoryId
    ? categories.find((c) => c.id === selectedCategoryId) ?? null
    : null;

  const filteredItems = useMemo(() => {
    if (!selectedCategory) return [];
    if (!query) return selectedCategory.items;
    return selectedCategory.items.filter(
      (item) =>
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query),
    );
  }, [selectedCategory, query]);

  return (
    <div className="bg-gray-100 min-h-screen pt-20">
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <HelpCenterHero searchQuery={searchQuery} onSearchChange={setSearchQuery} />

        {selectedCategory ? (
          <HelpCenterAccordionSection
            key={selectedCategory.id}
            category={selectedCategory}
            items={filteredItems}
            onBack={() => setSelectedCategoryId(null)}
          />
        ) : (
          <HelpCenterCategoryGrid
            categories={categories}
            matchCounts={matchCounts}
            onSelectCategory={setSelectedCategoryId}
            onClearSearch={() => setSearchQuery('')}
          />
        )}

        <HelpCenterContactSection />
      </div>
    </div>
  );
};

export default HelpCenterPage;
