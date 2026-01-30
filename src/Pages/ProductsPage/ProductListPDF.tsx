import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { type Product } from '../../api/productService';
import { formatDisplayDate } from '../../utils/dateUtils';
import { PDF_FONT_FAMILY } from '../../utils/pdfFonts';

const styles = StyleSheet.create({
  page: { padding: 20, backgroundColor: '#FFFFFF', fontFamily: PDF_FONT_FAMILY },
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#111827', paddingBottom: 10 },
  title: { fontSize: 20, fontWeight: 'heavy', color: '#111827', textTransform: 'uppercase' },
  reportInfo: { flexDirection: 'column', alignItems: 'flex-end' },
  reportLabel: { fontSize: 8, color: '#6B7280' },
  reportValue: { fontSize: 10, color: '#111827', fontWeight: 'bold' },
  tableContainer: { flexDirection: 'column', width: '100%', borderColor: '#E5E7EB', borderWidth: 1, borderRadius: 2 },
  tableHeader: { flexDirection: 'row', backgroundColor: '#197ADC', borderBottomColor: '#E5E7EB', borderBottomWidth: 1, alignItems: 'center', height: 24 },
  tableRow: { flexDirection: 'row', borderBottomColor: '#F3F4F6', borderBottomWidth: 1, alignItems: 'stretch', minHeight: 24 },
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
        <Text style={styles.title}>Product Inventory List</Text>
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
        <View style={styles.tableHeader}>
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
            <View style={[styles.tableRow, rowStyle]} key={product.id || index}>
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
    </Page>
  </Document>
);

export default ProductListPDF;