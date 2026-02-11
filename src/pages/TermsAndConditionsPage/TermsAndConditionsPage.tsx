import React from 'react';
import { LegalPageLayout } from '../../components/legal';
import { termsData } from './TermsAndConditionsPage.data';

const TermsAndConditionsPage: React.FC = () => (
  <LegalPageLayout data={termsData} />
);

export default TermsAndConditionsPage;
