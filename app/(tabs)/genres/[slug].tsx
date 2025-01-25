import { FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Redirect, Stack, useLocalSearchParams } from 'expo-router'
import { Genres } from '@/assets/categories'
import books from '@/assets/books_db.books.json'
import ProductListItem from '@/components/ProductListItem'

const Genre = () => {
  const { slug } = useLocalSearchParams<{ slug: string }>()

  const genre = Genres.find((genre) => genre.slug === slug)

  if (!genre) return <Redirect href={'/+not-found'} />

  const Books = books.filter((book) => book.genre.includes(genre.name))

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: genre.name }} />
      <FlatList
        data={Books}
        keyExtractor={(item) => item._id['$oid'].toString()}
        renderItem={({ item }) => <ProductListItem book={item} />}
        numColumns={2}
        columnWrapperStyle={styles.productRow}
        style={{ paddingHorizontal: 10, paddingVertical: 5 }}
        contentContainerStyle={styles.productsList}
      />
    </View>
  )
}

export default Genre

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor: '#fff',
    // padding: 16,
  },
  categoryImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 8,
    marginBottom: 16,
  },
  categoryName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  productsList: {
    flexGrow: 1,
  },
  productRow: {
    justifyContent: 'space-between',
  },
  productContainer: {
    flex: 1,
    margin: 8,
  },
  productImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
    borderRadius: 8,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  productPrice: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
})
