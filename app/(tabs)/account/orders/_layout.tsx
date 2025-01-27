import { Stack } from 'expo-router'

export default function OrdersLayout() {
  return (
    <Stack>
      <Stack.Screen
        name='index'
        options={{ headerShown: true, title: 'Orders' }}
      />
      <Stack.Screen
        name='[slug]'
        options={{ headerShown: true }}
      />
    </Stack>
  )
}
