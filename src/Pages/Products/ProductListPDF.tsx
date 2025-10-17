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
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#3B82F6',
    color: '#FFFFFF',
    padding: 5,
    fontFamily: 'Helvetica-Bold',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #E5E5E5',
    padding: 5,
    alignItems: 'center',
  },
  // --- ADDED COLUMN STYLES & ADJUSTED WIDTHS ---
  colSno: {
    width: '10%',
  },
  colName: {
    width: '40%', // Increased width
  },
  colCategory: {
    width: '25%', // Increased width
  },
  colPrice: {
    width: '15%',
    textAlign: 'right',
  },
  colPiece: {
    width: '10%',
    textAlign: 'right',
  },
  // ---------------------------------------------
  pageNumber: {
    position: 'absolute',
    fontSize: 10,
    bottom: 30,
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
        {/* Table Header - Image column removed */}
        <View style={styles.tableHeader} fixed>
          <Text style={styles.colSno}>S.No.</Text>
          <Text style={styles.colName}>Product Name</Text>
          <Text style={styles.colCategory}>Category</Text>
          <Text style={styles.colPrice}>Price</Text>
          <Text style={styles.colPiece}>Piece</Text>
        </View>

        {/* Table Body - Image column removed */}
        {products.map((product, index) => (
          <View style={styles.tableRow} key={product.id} wrap={false}>
            <Text style={styles.colSno}>{index + 1}</Text>
            <Text style={styles.colName}>{product.name}</Text>
            <Text style={styles.colCategory}>{product.category}</Text>
            <Text style={styles.colPrice}>RS {product.price.toFixed(2)}</Text>
            <Text style={styles.colPiece}>{product.piece}</Text>
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