import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { ToastProvider } from 'react-native-toast-notifications'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import 'react-native-reanimated'
import '../global.css'

import { useColorScheme } from '@/hooks/useColorScheme'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const colorScheme = useColorScheme()
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  })

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) {
    return null
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <ToastProvider>
        <Stack>
          <Stack.Screen
            name='(tabs)'
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name='books'
            options={{ headerShown: false, title: 'Books' }}
          />
          <Stack.Screen name='+not-found' />
        </Stack>
        <StatusBar style='auto' />
      </ToastProvider>
    </ThemeProvider>
  )
}
