import { MapMarkerImage, MarkerImagePressEvent } from "@/types";
import { MaterialIcons } from "@expo/vector-icons";
import { Dimensions, FlatList, Image, Pressable, StyleSheet, useWindowDimensions, View } from "react-native";

type ImageListProps = {
  images: MapMarkerImage[],
  onAdd?: () => void,
  onPress?: (event: MarkerImagePressEvent) => void,
  onLongPress?: (event: MarkerImagePressEvent) => void
}

export default function ImageList({ images, onAdd, onPress, onLongPress } : ImageListProps) {
  const { height, width } = useWindowDimensions();

  const renderItem = (item: MapMarkerImage, index: number) => {
    console.log(`Rendering image ${item.id} ${item.uri}`);
    
    return (
      <Pressable
        style={styles.listPressable}
        onPress={() => onPress && onPress({image: item})}
        onLongPress={() => onLongPress && onLongPress({image: item})}
        >
        <Image source={{ uri: item.uri }} key={item.id} style={styles.image} />
      </Pressable>
    )
  }

  const renderFooter = () => {
    console.log(`Rendering footer ${Dimensions.get('window').width / 3 - 2}`);

    return (
      <Pressable
        style={styles.listPressable}
        onPress={() => {
          onAdd && onAdd()
        }}>
        <MaterialIcons name="add" color="#fff" size={22}/>
      </Pressable>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.list}
        numColumns={3}
        data={images}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item, index }) => renderItem(item, index)}
        ListFooterComponentStyle={styles.listFooterContainer}
        ListFooterComponent={renderFooter}
        />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 2
  },

  list: {
  },

  listContainer: {
  },

  listFooterContainer: {
  },

  listPressable: {
    width: Dimensions.get('window').width / 3 - 2,
    height: undefined,
    aspectRatio: 1,

    backgroundColor: '#4d8a54',

    marginLeft: 1,
    marginRight: 1,
    marginBottom: 2,

    alignItems: 'center',
    justifyContent: 'center'
  },

  image: {
    height: '100%',
    width: '100%'
  },
});