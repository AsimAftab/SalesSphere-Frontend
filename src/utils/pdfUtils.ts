import type { ReactElement } from 'react';

/**
 * Generate a PDF blob from a React-PDF document element.
 * Centralizes the type cast needed for @react-pdf/renderer compatibility.
 */
export async function generatePdfBlob(element: ReactElement): Promise<Blob> {
  const { pdf } = await import('@react-pdf/renderer');
  return pdf(element as any).toBlob();
}
