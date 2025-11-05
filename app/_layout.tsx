import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)/login" options={{ headerShown: false, title: 'Prihlásenie' }} />
        <Stack.Screen name="(tabs)/register" options={{ title: 'Registrácia' }} />
  <Stack.Screen name="home" options={{ title: 'Domov' }} />
  <Stack.Screen name="chat-list" options={{ title: 'Chaty' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
