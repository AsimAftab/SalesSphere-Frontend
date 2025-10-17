import React from 'react';
// Image component is no longer needed
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Product interface without imageUrl
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  piece: number;
}

interface ProductListPDFProps {
  products: Product[];
}

// --- EDITED: Styles updated for a robust multi-page grid layout ---
const styles = StyleSheet.create({
  page: {
  padding: 30,
  fontFamily: 'Helvetica',
  fontSize: 10,
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
    backgroundColor: '#3B82F6',
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
    borderTopWidth: 0, // This prevents double borders between rows
  },
  // A generic style for padding
  tableCell: {
    padding: 5,
  },
  tableHeaderCell: {
    color: '#FFFFFF',
    padding: 5,
  },
  // Column styles now include their right border to create vertical lines
  colSno: { width: '10%', textAlign: 'center', borderRight: '1px solid #E5E5E5' },
  colName: { width: '40%', borderRight: '1px solid #E5E5E5' },
  colCategory: { width: '25%', textAlign: 'center', borderRight: '1px solid #E5E5E5' },
  colPrice: { width: '15%', textAlign: 'center', borderRight: '1px solid #E5E5E5' },
  // The last column does not need a right border
  colPiece: { width: '10%', textAlign: 'center' },
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
      {/* Table Header */}
        <View style={styles.tableHeader} fixed>
          <Text style={[styles.colSno, styles.tableHeaderCell]}>S.No.</Text>
          <Text style={[styles.colName, styles.tableHeaderCell]}>Product Name</Text>
          <Text style={[styles.colCategory, styles.tableHeaderCell]}>Category</Text>
          <Text style={[styles.colPrice, styles.tableHeaderCell]}>Price</Text>
          <Text style={[styles.colPiece, styles.tableHeaderCell]}>Piece</Text>
        </View>
        
        {/* Table Body */}
        {products.map((product, index) => (
            <View style={styles.tableRow} key={product.id} wrap={false}>
            <Text style={[styles.colSno, styles.tableCell]}>{index + 1}</Text>
            <Text style={[styles.colName, styles.tableCell]}>{product.name}</Text>
            <Text style={[styles.colCategory, styles.tableCell]}>{product.category}</Text>
            <Text style={[styles.colPrice, styles.tableCell]}>RS {product.price.toFixed(2)}</Text>
            <Text style={[styles.colPiece, styles.tableCell]}>{product.piece}</Text>
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