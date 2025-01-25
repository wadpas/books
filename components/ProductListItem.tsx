import { Pressable, StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import { Link, RelativePathString } from 'expo-router'

const bookListItem = ({ book }: { book: any }) => {
  return (
    <Link
      asChild
      href={`/book/${book.slug}` as RelativePathString}>
      <Pressable style={styles.item}>
        <View style={styles.itemImageContainer}>
          <Image
            source={book.cover}
            style={styles.itemImage}
          />
        </View>
        <View style={styles.itemTextContainer}>
          <Text
            className='line-clamp-1'
            style={styles.itemTitle}>
            {book.title}
          </Text>
          <Text style={styles.itemPrice}>{book.author}</Text>
        </View>
      </Pressable>
    </Link>
  )
}

export default bookListItem

const styles = StyleSheet.create({
  item: {
    width: '49%',
    backgroundColor: 'white',
    marginVertical: 8,
    borderRadius: 5,
    overflow: 'hidden',
  },
  itemImageContainer: {
    borderRadius: 10,
    width: '100%',
    height: 300,
  },
  itemImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  itemTextContainer: {
    padding: 8,
    alignItems: 'flex-start',
    gap: 4,
  },
  itemTitle: {
    fontSize: 16,
    color: '#888',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
  },
})
