import { StyleSheet, Image, View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Book } from '@/assets/types/book'

const CartItem = ({
  item,
  onDecrement,
  onIncrement,
  onRemove,
}: {
  item: { book: Book; quantity: number }
  onDecrement: Function
  onIncrement: Function
  onRemove: Function
}) => {
  return (
    <View style={styles.cartItem}>
      <Image
        source={{ uri: item.book.cover }}
        style={styles.itemImage}
      />
      <View style={styles.itemDetails}>
        <Text style={styles.itemTitle}>{item.book.title}</Text>
        <Text style={styles.itemPrice}>${item.book.price.toFixed(2)}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            onPress={() => onDecrement(item.book._id.$oid)}
            style={styles.quantityButton}>
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.itemQuantity}>{item.quantity}</Text>
          <TouchableOpacity
            onPress={() => onIncrement(item.book._id.$oid)}
            style={styles.quantityButton}>
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => onRemove(item.book._id.$oid)}
        style={styles.removeButton}>
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  )
}

export default CartItem

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  cartList: {
    paddingVertical: 16,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  itemImage: {
    width: 80,
    aspectRatio: 1 / 1.55,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 16,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    color: '#888',
    marginBottom: 4,
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666',
  },
  removeButton: {
    padding: 8,
    backgroundColor: '#ff5252',
    borderRadius: 8,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  footer: {
    borderTopWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  checkoutButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    backgroundColor: '#ddd',
    marginHorizontal: 5,
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 3,
  },
})
