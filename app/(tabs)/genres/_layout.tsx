import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { Stack } from 'expo-router'
import { TouchableOpacity } from 'react-native'

export default function GenresLayout() {
  return (
    <Stack>
      <Stack.Screen
        name='index'
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='[slug]'
        options={({ navigation }) => ({
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <MaterialIcons
                name='arrow-back'
                size={28}
                color='black'
              />
            </TouchableOpacity>
          ),
        })}
      />
    </Stack>
  )
}
