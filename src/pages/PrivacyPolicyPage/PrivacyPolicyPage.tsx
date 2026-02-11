import React from 'react';
import { LegalPageLayout } from '../../components/legal';
import { privacyData } from './PrivacyPolicyPage.data';

const PrivacyPolicyPage: React.FC = () => (
  <LegalPageLayout data={privacyData} />
);

export default PrivacyPolicyPage;
