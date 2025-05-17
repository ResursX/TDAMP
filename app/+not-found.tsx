import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: '404: Not Found' }} />
      <View style={styles.container}>
        <Text style={styles.text}>404: Not found</Text>
        <Link href="/" style={styles.button}>Go back to Home screen</Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: "center",
    alignItems: "center",
  },

  text: {
    color: '#fff',
  },

  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#fff',
  }
});