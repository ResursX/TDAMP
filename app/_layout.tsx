import { DatabaseProvider } from "@/contexts/DatabaseContext";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <DatabaseProvider>
        <Stack>
          <Stack.Screen name='index' options={{ title: 'Карта', headerShown: false }}/>
          <Stack.Screen name='marker/[id]' options={{ title: 'Маркер' }}/>
          <Stack.Screen name='+not-found'/>
        </Stack>
        <StatusBar style='auto'/>
      </DatabaseProvider>
    </>
  );
}
