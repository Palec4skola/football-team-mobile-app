import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/use-color-scheme';

// (nepotrebuješ anchor, môžeme ho odstrániť)
export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Login bude prvý po štarte aplikácie */}
        <Stack.Screen name="login" options={{ headerShown: false, title: 'Prihlásenie' }} />

        {/* Registrácia */}
        <Stack.Screen name="register" options={{ headerShown: true, title: 'Registrácia' }} />

        {/* Tabs (hlavná časť aplikácie po prihlásení) */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        {/* Ostatné obrazovky mimo tabs, ak ich máš */}
        <Stack.Screen name="chat-list" options={{ headerShown: true, title: 'Chaty' }} />
      </Stack>

      <StatusBar style="auto" />
    </ThemeProvider>//skkusam
  );
}
