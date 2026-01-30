import { Font } from '@react-pdf/renderer';

// Register Noto Sans Devanagari — supports both Latin (English) and Devanagari (Nepali) scripts
Font.register({
  family: 'NotoSans',
  fonts: [
    { src: '/fonts/NotoSansDevanagari-Regular.ttf' },
    { src: '/fonts/NotoSansDevanagari-Bold.ttf', fontWeight: 'bold' },
  ],
});

export const PDF_FONT_FAMILY = 'NotoSans';
