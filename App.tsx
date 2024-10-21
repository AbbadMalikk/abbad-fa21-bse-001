import React, { useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useProducts } from './hooks/useProducts';

const categories = ['coffee', 'candy', 'dairy', 'bread-bakery', 'meat-seafood', 'fresh-produce'];

const App = () => {
  const [selectedCategory, setSelectedCategory] = useState('coffee');
  const { products, loading, error } = useProducts(selectedCategory);

  const renderCategoryButton = (category: string) => (
    <TouchableOpacity
      key={category}
      style={[
        styles.categoryButton,
        selectedCategory === category && styles.selectedCategoryButton,
      ]}
      onPress={() => setSelectedCategory(category)}
    >
      <Text style={[
        styles.categoryButtonText,
        selectedCategory === category && styles.selectedCategoryButtonText,
      ]}>
        {category}
      </Text>
    </TouchableOpacity>
  );

  const renderProduct = ({ item, index }: { item: any; index: number }) => (
    <View style={[styles.productContainer, index % 2 !== 0 && styles.productContainerMargin]}>
      <Image
        style={styles.productImage}
        source={{ uri: 'https://via.placeholder.com/150' }}  // Dummy image
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>{item.inStock ? "Instock" : "False"}</Text>
      </View>
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
  
  return (
    <View style={styles.container}>
       {/* Search Bar */}
       <View style={styles.searchBar}>
        <Text style={styles.searchText}>Search for products</Text>
      </View>

      {/* Category Buttons */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
        {categories.map(renderCategoryButton)}
      </ScrollView>

      {/* Display Loading or Error */}
      {loading ? (
        <ActivityIndicator style={styles.loader} size="large" color="#4caf50" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        /* Product Grid */
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.productList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 10,
  },
  categoryContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  searchText: {
    fontSize: 16,
    color: '#aaa',
  },
  searchBar: {
    backgroundColor: '#fff',
    padding: 10,
    paddingVertical: 15,
    borderRadius: 10,
    marginVertical: 10,
    marginTop: 50,
  },
  categoryButton: {
    width: 100, // Fixed width
    height: 40, // Fixed height
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    marginRight: 10,
    marginBottom:30
  },
  selectedCategoryButton: {
    backgroundColor: '#4caf50',
  },
  loader:{
    justifyContent:'center',
    alignContent:'center',
    position:'absolute',
    top:'50%',
    left:'50%'
  },
  categoryButtonText: {
    fontSize: 16,
    color: '#555',
  },
  selectedCategoryButtonText: {
    color: '#fff',
  },
  productList: {
    paddingBottom: 20,
  },
  productContainerMargin: {
    marginTop: 40, // Adjust the value as needed for spacing
  },
  productContainer: {
    flex: 1,
    margin: 10,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'flex-start', // Align items to the start
    position: 'relative', // For absolute positioning of add button
    maxWidth: '50%',
    height:300
  },
  productImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center', // Center text vertically
    marginBottom: 30, // To give space for the add button
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'left', // Align text to the left
  },
  productPrice: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 10,
    position: 'absolute', // Position the button at the bottom right
    bottom: 0,
    right: 0,
    borderTopLeftRadius:30
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default App;
