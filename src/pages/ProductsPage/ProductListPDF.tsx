import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { type Product } from '@/api/productService';
import { formatDisplayDate } from '@/utils/dateUtils';
import { PDF_FONT_FAMILY } from '@/utils/pdfFonts';

const styles = StyleSheet.create({
  page: { paddingTop: 20, paddingLeft: 20, paddingRight: 20, paddingBottom: 50, backgroundColor: '#FFFFFF', fontFamily: PDF_FONT_FAMILY },
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#111827', paddingBottom: 10 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#111827', textTransform: 'uppercase' },
  titleGroup: { flexDirection: 'column' },
  subTitle: { fontSize: 10, color: '#6B7280', marginTop: 4, textTransform: 'uppercase' },
  reportInfo: { flexDirection: 'column', alignItems: 'flex-end' },
  reportLabel: { fontSize: 8, color: '#6B7280' },
  reportValue: { fontSize: 10, color: '#111827', fontWeight: 'bold' },
  tableContainer: { flexDirection: 'column', width: '100%' },
  tableHeader: { flexDirection: 'row', backgroundColor: '#197ADC', borderBottomColor: '#E5E7EB', borderBottomWidth: 1, alignItems: 'center', height: 24, borderLeftWidth: 1, borderRightWidth: 1, borderTopWidth: 1, borderLeftColor: '#E5E7EB', borderRightColor: '#E5E7EB', borderTopColor: '#E5E7EB' },
  tableRow: { flexDirection: 'row', borderBottomColor: '#F3F4F6', borderBottomWidth: 1, alignItems: 'stretch', minHeight: 24, borderLeftWidth: 1, borderRightWidth: 1, borderLeftColor: '#E5E7EB', borderRightColor: '#E5E7EB' },
  rowEven: { backgroundColor: '#FFFFFF' },
  rowOdd: { backgroundColor: '#FAFAFA' },
  cellHeader: { fontSize: 7, fontWeight: 'bold', color: '#FFFFFF', paddingHorizontal: 4, paddingVertical: 5, textAlign: 'left' },
  cellText: { fontSize: 7, color: '#1F2937', paddingHorizontal: 4, paddingVertical: 4, textAlign: 'left' },
  textCenter: { textAlign: 'center' },
  // Added a specific style for columns that need extra indentation from the left border
  paddedColumn: { paddingLeft: 10 }
});

interface ProductListPDFProps {
  products: Product[];
}

const ProductListPDF: React.FC<ProductListPDFProps> = ({ products }) => (
  <Document>
    <Page size="A4" orientation="portrait" style={styles.page}>

      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.titleGroup}>
          <Text style={styles.title}>Product Inventory Report</Text>
          <Text style={styles.subTitle}>Overview of All Products</Text>
        </View>
        <View style={styles.reportInfo}>
          <Text style={styles.reportLabel}>Generated On</Text>
          <Text style={styles.reportValue}>{formatDisplayDate(new Date().toISOString())}</Text>
          <Text style={styles.reportLabel}>Total Products</Text>
          <Text style={styles.reportValue}>{products.length}</Text>
        </View>
      </View>

      {/* Table */}
      <View style={styles.tableContainer}>
        {/* Table Header */}
        <View style={styles.tableHeader} fixed>
          <View style={{ width: '5%' }}><Text style={[styles.cellHeader, styles.textCenter]}>S.No</Text></View>

          {/* Added paddingLeft to create the gap from S.No */}
          <View style={{ width: '32%', paddingLeft: 10 }}><Text style={styles.cellHeader}>Product Name</Text></View>

          <View style={{ width: '18%' }}><Text style={styles.cellHeader}>Category</Text></View>
          <View style={{ width: '20%' }}><Text style={styles.cellHeader}>Serial No.</Text></View>
          <View style={{ width: '12%' }}><Text style={styles.cellHeader}>Stock (Qty)</Text></View>
          <View style={{ width: '13%' }}><Text style={styles.cellHeader}>Price (RS)</Text></View>
        </View>

        {/* Table Rows */}
        {products.map((product, index) => {
          const rowStyle = index % 2 === 0 ? styles.rowEven : styles.rowOdd;

          return (
            <View style={[styles.tableRow, rowStyle]} key={product.id || index} wrap={false}>
              <View style={{ width: '5%' }}>
                <Text style={[styles.cellText, styles.textCenter]}>{index + 1}</Text>
              </View>

              {/* Added paddingLeft here as well to align with the header gap */}
              <View style={{ width: '32%', paddingLeft: 10 }}>
                <Text style={styles.cellText}>{product.productName || 'N/A'}</Text>
              </View>

              <View style={{ width: '18%' }}>
                <Text style={styles.cellText}>{product.category?.name || 'N/A'}</Text>
              </View>

              <View style={{ width: '20%' }}>
                <Text style={styles.cellText}>{product.serialNo || 'N/A'}</Text>
              </View>

              <View style={{ width: '12%' }}>
                <Text style={styles.cellText}>{product.qty}</Text>
              </View>

              <View style={{ width: '13%' }}>
                <Text style={styles.cellText}>
                  {product.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* Footer */}
      <View style={{ position: 'absolute', bottom: 20, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} fixed>
        <Text style={{ fontSize: 8, color: '#9CA3AF' }}>Product Inventory Report</Text>
        <Text style={{ fontSize: 8, color: '#9CA3AF' }} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
      </View>
    </Page>
  </Document>
);

export default ProductListPDF;