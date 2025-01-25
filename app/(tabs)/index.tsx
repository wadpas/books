import { FlatList, StyleSheet, Image, View } from 'react-native'
import React from 'react'

import BOOKS from '@/assets/books_db.books.json'
import ProductListItem from '@/components/ProductListItem'

const Home = () => {
  return (
    <FlatList
      data={BOOKS}
      renderItem={({ item }) => <ProductListItem book={item} />}
      keyExtractor={(item) => item._id['$oid'].toString()}
      numColumns={2}
      ListHeaderComponent={
        <View style={styles.heroContainer}>
          <Image
            source={require('@/assets/images/hero.jpg')}
            style={styles.heroImage}
          />
        </View>
      }
      columnWrapperStyle={styles.flatListColumn}
      contentContainerStyle={styles.flatListContent}
      style={{ paddingHorizontal: 10, paddingVertical: 5 }}
    />
  )
}

export default Home

const styles = StyleSheet.create({
  flatListContent: {
    paddingBottom: 10,
  },
  flatListColumn: {
    justifyContent: 'space-between',
  },
  heroContainer: {
    paddingTop: 5,
    width: '100%',
    aspectRatio: 5,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 5,
  },
})
