import { Tabs } from 'expo-router'
import React from 'react'
import { StyleSheet, View } from 'react-native'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { SafeAreaView } from 'react-native-safe-area-context'

import { HapticTab } from '@/components/HapticTab'
import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'
import { useCartStore } from '@/store/cart-store'

export default function TabLayout() {
  const colorScheme = useColorScheme()
  const { getItemCount } = useCartStore()

  return (
    <SafeAreaView
      edges={['top']}
      style={styles.safeArea}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarStyle: {
            height: 52,
          },
        }}>
        <Tabs.Screen
          name='index'
          options={{
            title: 'Головна',
            tabBarIcon: ({ color }) => (
              <MaterialIcons
                size={28}
                name='home'
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name='genres'
          options={{
            title: 'Жанри',
            tabBarIcon: ({ color }) => (
              <MaterialIcons
                size={28}
                name='collections-bookmark'
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name='cart'
          options={{
            title: 'Кошик',
            tabBarBadge: getItemCount() > 0 ? getItemCount() : undefined,
            tabBarBadgeStyle: {
              backgroundColor: Colors[colorScheme ?? 'light'].tint,
            },
            tabBarIcon: ({ color }) => (
              <MaterialIcons
                size={28}
                name='shopping-basket'
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name='account'
          options={{
            title: 'Акаунт',
            tabBarIcon: ({ color }) => (
              <MaterialIcons
                size={28}
                name='account-circle'
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
})
