import * as ImagePicker from "expo-image-picker";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { MapMarker, MapMarkerImage, MarkerImagePressEvent } from "@/types";

import { useDatabase } from "@/contexts/DatabaseContext";

import ImageList from "@/components/ImageList";

export default function MarkerScreen() {
  const { id } = useLocalSearchParams<{id: string}>();
  const { getMarkerById, addMarkerImage, deleteMarkerImage, getMarkerImages, isLoading, error } = useDatabase();

  const [marker, setMarker] = useState<MapMarker | null>(null);
  const [images, setImages] = useState<MapMarkerImage[]>([]);

  useFocusEffect(useCallback(() => {
    if (!isLoading) {
      loadMarker();
      loadImages();
    }
  }, [id, isLoading]));

  const loadMarker = async () => {
    try {
      setMarker(await getMarkerById(parseInt(id)));
    }
    catch (error) {
      console.error('Не удалось загрузить маркер: ', error);
      
      Alert.alert("Ошибка", "Не удалось загрузить маркер");
    }
  }

  const loadImages = async () => {
    try {
      setImages(await getMarkerImages(parseInt(id)));
    }
    catch (error) {
      console.error('Не удалось загрузить изображения: ', error);
      
      Alert.alert("Ошибка", "Не удалось загрузить изображения");
    }
  }

  const onAddAsync = async () => {
    if (!marker) {
      console.error('Маркер не был загружен.');

      Alert.alert('Ошибка', 'Маркер не был загружен.');

      return;
    }

    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        quality: 1
      });

      if (!result.canceled) {
        const newImage : MapMarkerImage = await addMarkerImage(marker?.id, result.assets[0].uri);

        setImages([...images, newImage])
      }
    }
    catch (error) {
      console.error('Не удалось добавить изображение: ', error);

      Alert.alert('Ошибка', 'Не удалось добавить изображение.');
    }
  }

  const handleDelete = async (image: MapMarkerImage) => {
    try {
      await deleteMarkerImage(image.id);

      setImages(images.filter(img => img.id != image.id))
    }
    catch (error) {
      console.error('Не удалось удалить изображение: ', error);

      Alert.alert('Ошибка', 'Не удалось удалить изображение.');
    }
  }

  const onLongPress = async (event: MarkerImagePressEvent) => {
    Alert.alert('Удаление', 'Удалить изображение?',
      [
        {
          text: 'Да',
          style: 'destructive',
          onPress: async () => await handleDelete(event.image)
        },
        {
          text: 'Нет',
          style: 'cancel',
          isPreferred: true
        }
      ]
    )
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
      <View style={styles.infocontainer}>
        <Text>Id: {id}</Text>
        <Text>Latitude: {marker?.latitude}</Text>
        <Text>Longitude: {marker?.longitude}</Text>
      </View>
      <SafeAreaView style={styles.imagecontainer} edges={["left", "right", "bottom"]}>
        <ImageList
          images={images}
          onAdd={onAddAsync}
          onLongPress={onLongPress}
          />
      </SafeAreaView>
    </View>
  )
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

  infocontainer: {
    padding: 10,
    backgroundColor: "#FFFFFF"
  },

  imagecontainer: {
    flex: 1
  }
});