import { LongPressEvent, MapMarker, MarkerDragEndEvent, MarkerPressEvent } from '@/types';
import { StyleSheet, View } from 'react-native';
import MapView, { Circle, Marker } from 'react-native-maps';

type MapProps = {
  latitude: number,
  longitude: number,
  markers: MapMarker[],
  onLongPress?: (event: LongPressEvent) => void,
  onMarkerPress?: (event: MarkerPressEvent) => void,
  onMarkerDragEnd?: (event: MarkerDragEndEvent) => void
};

export default function Map({ latitude, longitude, markers, onLongPress, onMarkerPress, onMarkerDragEnd } : MapProps) {
  //const region_latitude = data ? (data.center_latitude ? data.center_latitude : 37.78825) : 37.78825;
  //const region_longitude = data ? (data.center_longitude ? data.center_longitude : -122.4324) : -122.4324;

  return (
    <View style={styles.container}>
      <MapView 
        style={styles.map}
        initialRegion={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
        onLongPress={(event) => onLongPress && onLongPress({
            latitude: event.nativeEvent.coordinate.latitude,
            longitude: event.nativeEvent.coordinate.longitude
        })}
        >
          <Circle
            center={{
              latitude: latitude,
              longitude: longitude
            }}
            radius={100}
            />
          {markers.map(marker => (
            <Marker
              key={marker.id}
              coordinate={{
                latitude: marker.latitude,
                longitude: marker.longitude
              }}
              onPress={() => onMarkerPress && onMarkerPress({marker: marker})}
              draggable={true}
              onDragEnd={(event) => onMarkerDragEnd && onMarkerDragEnd({
                marker: marker,
                latitude: event.nativeEvent.coordinate.latitude,
                longitude: event.nativeEvent.coordinate.longitude
              })}></Marker>
            ))}
      </MapView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  
  map: {
    width: '100%',
    height: '100%'
  }
})