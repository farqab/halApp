import { Stack } from "expo-router";
import { MarketProvider } from "../context/MarketContext";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <MarketProvider>
      <StatusBar style="dark" />
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="city-selection"
          options={{
            presentation: 'modal',
            title: 'Konum Değiştir',
            headerShown: false
          }}
        />
      </Stack>
    </MarketProvider>
  );
}
