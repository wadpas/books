import { FlatList, Pressable, StyleSheet, Text, Image } from 'react-native'
import React from 'react'
import { Link, RelativePathString } from 'expo-router'

import { Genres } from '@/assets/categories'

const genres = () => {
  return (
    <FlatList
      data={Genres}
      renderItem={({ item }) => (
        <Link
          asChild
          href={`/genres/${item.slug}` as RelativePathString}>
          <Pressable style={styles.category}>
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.categoryImage}
            />
            <Text style={styles.categoryText}>{item.name}</Text>
          </Pressable>
        </Link>
      )}
      numColumns={2}
      keyExtractor={(item) => item.name}
      columnWrapperStyle={styles.flatListColumn}
      contentContainerStyle={styles.flatListContent}
      style={{ paddingHorizontal: 10, paddingVertical: 5 }}
    />
  )
}

export default genres

const styles = StyleSheet.create({
  category: {
    width: '49%',
    alignItems: 'center',
    marginVertical: 5,
  },
  categoryImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: '38%',
    marginBottom: 8,
  },
  categoryText: {},
  flatListContent: {},
  flatListColumn: {
    justifyContent: 'space-between',
  },
})
