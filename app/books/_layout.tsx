import { Stack } from 'expo-router'
import { TouchableOpacity } from 'react-native'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'

export default function BooksLayout() {
  return (
    <Stack>
      <Stack.Screen
        name='[slug]'
        options={({ navigation }) => ({
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity
              className='mx-3'
              onPress={() => navigation.goBack()}>
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
