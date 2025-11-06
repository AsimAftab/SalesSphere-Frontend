import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { type Product } from '../../api/productService'; // Ensure this path is correct

interface ProductListPDFProps {
  products: Product[];
}

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 9, // Slightly smaller to fit new column
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Helvetica-Bold',
  },
  table: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#3B82F6', // blue-500
    color: '#FFFFFF',
    fontFamily: 'Helvetica-Bold',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderTopWidth: 0,
  },
  tableCell: {
    padding: 5,
  },
  tableHeaderCell: {
    color: '#FFFFFF',
    padding: 5,
  },
  // --- Column widths adjusted for new column ---
  colSno: { width: '8%', textAlign: 'center', borderRight: '1px solid #E5E5E5' },
  colName: { width: '30%', borderRight: '1px solid #E5E5E5', paddingLeft: 5 },
  colCategory: { width: '22%', borderRight: '1px solid #E5E5E5', paddingLeft: 5 },
  colSerial: { width: '20%', borderRight: '1px solid #E5E5E5', paddingLeft: 5 },
  colPrice: { width: '10%', textAlign: 'right', borderRight: '1px solid #E5E5E5', paddingRight: 5 },
  colQty: { width: '10%', textAlign: 'center' },
  
  pageNumber: {
    position: 'absolute',
    fontSize: 10,
    bottom: 20,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'grey',
  },
});

const ProductListPDF: React.FC<ProductListPDFProps> = ({ products }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Product List</Text>
      <View style={styles.table}>
        <View style={styles.tableHeader} fixed>
          <Text style={[styles.colSno, styles.tableHeaderCell]}>S.No.</Text>
          <Text style={[styles.colName, styles.tableHeaderCell]}>Product Name</Text>
          <Text style={[styles.colCategory, styles.tableHeaderCell]}>Category</Text>
          <Text style={[styles.colSerial, styles.tableHeaderCell]}>Serial No.</Text>
          <Text style={[styles.colQty, styles.tableHeaderCell]}>Stock</Text>
          <Text style={[styles.colPrice, styles.tableHeaderCell]}>Price</Text>
        </View>
        
        {/* Table Body */}
        {products.map((product, index) => (
            <View style={styles.tableRow} key={product._id} wrap={false}>
              <Text style={[styles.colSno, styles.tableCell]}>{index + 1}</Text>
              {/* --- FIXES --- */}
              <Text style={[styles.colName, styles.tableCell]}>{product.productName}</Text>
              <Text style={[styles.colCategory, styles.tableCell]}>{product.category?.name || 'N/A'}</Text>
              <Text style={[styles.colSerial, styles.tableCell]}>{product.serialNo || 'N/A'}</Text>
              <Text style={[styles.colQty, styles.tableCell]}>{product.qty}</Text>
              <Text style={[styles.colPrice, styles.tableCell]}>{product.price.toFixed(2)}</Text>
            </View>
        ))}
      </View>
      <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
       `${pageNumber} / ${totalPages}`
      )} fixed />
    </Page>
  </Document>
);

export default ProductListPDF;