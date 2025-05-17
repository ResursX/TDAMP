import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";

import { LongPressEvent, MapMarker, MarkerDragEndEvent, MarkerPressEvent } from "@/types";

import { useDatabase } from "@/contexts/DatabaseContext";

import CircleButton from "@/components/CircleButton";
import Map from "@/components/Map";

export default function Index() {
  const { addMarker, updateMarker, deleteMarker, getMarkers, isLoading, error } = useDatabase();
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const router = useRouter();

  useFocusEffect(useCallback(() => {
    if (!isLoading) {
      loadMarkers();
    }
  }, [isLoading]));

  const loadMarkers = async () => {
    try {
      setMarkers(await getMarkers());
    }
    catch (error) {
      console.error('Не удалось загрузить метки: ', error);
      
      Alert.alert("Ошибка", "Не удалось загрузить метки");
    }
  }

  const onLongPress = async (event: LongPressEvent) => {
    console.log(`Long pressed: ${event.latitude}, ${event.longitude}`);

    try {
      const newMarker: MapMarker = await addMarker(event.latitude, event.longitude);

      setMarkers([...markers, newMarker])
    }
    catch (error) {
      console.error('Не получилось добавить метку: ', error);

      Alert.alert("Ошибка", "Не получилось добавить метку")
    }
  }

  const onMarkerPress = (event: MarkerPressEvent) => {
    console.log(`Marker pressed: ${event.marker.id}`);

    try {
      router.push({
        pathname: '/marker/[id]',
        params: {
          "id": event.marker.id
        }
      })
    }
    catch (error) {
      console.error('Не получилось открыть метку: ', error);

      Alert.alert("Ошибка", "Не получилось открыть метку")
    }
  }

  const onMarkerDragEnd = async (event: MarkerDragEndEvent) => {
    console.log(`Marker dragged: ${event.marker.id}, ${event.latitude}, ${event.longitude}`);

    try {
      const newMarker: MapMarker = await updateMarker(event.marker.id, event.latitude, event.longitude);

      setMarkers(markers.map(marker => marker.id == event.marker.id ? newMarker : marker))
    }
    catch (error) {
      console.error('Не получилось обновить метку: ', error);

      Alert.alert("Ошибка", "Не получилось обновить метку")
    }
  }

  const onPressClear = async () => {
    console.log(`Cleanup`);

    try {
      for (const marker of markers) {
        await deleteMarker(marker.id);
      }

      setMarkers([]);
    }
    catch (error) {
      console.error('Не получилось удалить метки: ', error);

      Alert.alert("Ошибка", "Не получилось удалить метки")
    }
  }

  if (isLoading) {
    return (
      <View style={[styles.container, styles.containerIntermediate]}>
        <ActivityIndicator size="large" color={styles.loading.color}/>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.containerIntermediate]}>
        <Text style={styles.textIntermediate}>Ошибка загрузки БД</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Map
        latitude={37.78825}
        longitude={-122.4324}
        markers={markers}
        onLongPress={onLongPress}
        onMarkerPress={onMarkerPress}
        onMarkerDragEnd={onMarkerDragEnd}>
      </Map>
      <View style={styles.clearButtonContainer}>
        <CircleButton icon="clear" onPress={onPressClear}/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  containerIntermediate: {
    alignContent: 'center',
    justifyContent: 'center'
  },

  textIntermediate: {
    textAlign: 'center',
    color: '#FF0000',
    fontSize: 28
  },

  loading: {
    color: '#0000FF'
  },

  clearButtonContainer: {
    position: "absolute",
    bottom: 50,
    right: -40
  }
})