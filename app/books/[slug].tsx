import { StyleSheet, Image, View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Redirect, Stack, useLocalSearchParams } from 'expo-router'
import { useToast } from 'react-native-toast-notifications'
import books from '@/assets/books_db.books.json'
import { useCartStore } from '@/store/cart-store'

const Book = () => {
  const { slug } = useLocalSearchParams<{ slug: string }>()
  const toast = useToast()

  const book = books.find((book) => book.slug === slug)
  if (!book) return <Redirect href={'/+not-found'} />

  const { items, addItem, incrementItem, decrementItem } = useCartStore()
  const cartItem = items.find((item) => item.book._id === book._id)
  const initialQuantity = cartItem ? cartItem.quantity : 1
  const [quantity, setQuantity] = useState(initialQuantity)

  const increaseQuantity = () => {
    if (quantity < book.maxQuantity) {
      setQuantity((prev) => prev + 1)
      incrementItem(book._id)
    } else {
      toast.show(`Наявна кількість примірників - ${book.maxQuantity} шт.`, {
        type: 'warning',
        placement: 'top',
        duration: 1500,
      })
    }
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1)
      decrementItem(book._id)
    }
  }

  const addToCart = () => {
    addItem({
      book: book,
      quantity,
    })
    toast.show('Added to cart', {
      type: 'success',
      placement: 'top',
      duration: 1500,
    })
  }

  const totalPrice = (book.price * quantity).toFixed(0)

  return (
    <View>
      <Stack.Screen options={{ title: book.title }} />
      <Image
        source={{ uri: book.cover }}
        style={styles.cover}
        resizeMode='stretch'
      />
      <View style={{ padding: 16, flex: 1 }}>
        <Text style={styles.title}>{book.title}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>Ціна: {book.price.toFixed(0)} грн</Text>
          <Text style={styles.price}>Загалом: {totalPrice} грн</Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={decreaseQuantity}
          disabled={quantity <= 1}>
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>

        <Text style={styles.quantity}>{quantity}</Text>

        <TouchableOpacity
          style={styles.quantityButton}
          onPress={increaseQuantity}>
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.addToCartButton, { opacity: quantity === 0 ? 0.5 : 1 }]}
          onPress={addToCart}
          disabled={quantity === 0}>
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Book

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  cover: {
    width: '50%',
    aspectRatio: 1 / 1.55,
    resizeMode: 'cover',
    alignSelf: 'center',
    marginTop: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  slug: {
    fontSize: 18,
    color: '#555',
    marginBottom: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  price: {
    fontWeight: 'bold',
    color: '#000',
  },

  imagesContainer: {
    marginBottom: 16,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 8,
    borderRadius: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007bff',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  quantityButtonText: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 6,
  },
  quantity: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 16,
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: '#28a745',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorMessage: {
    fontSize: 18,
    color: '#f00',
    textAlign: 'center',
    marginTop: 20,
  },
})
