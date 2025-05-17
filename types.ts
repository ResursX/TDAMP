/* =============== */
/* Основные данные */
/* =============== */

export interface MapData {
  markers: MapMarker[],
  center_latitude?: number,
  center_longitude?: number
}

export interface MapMarker {
  id: number,

  latitude: number,
  longitude: number
}

export interface MapMarkerImage {
  id: number,

  uri: string
}

/* ======= */
/* События */
/* ======= */

// Map

export interface LongPressEvent {
  latitude: number;
  longitude: number;
}

export interface MarkerEvent {
  marker: MapMarker;
}

export interface MarkerPressEvent extends MarkerEvent {
};

export interface MarkerDragEndEvent extends MarkerEvent {
  latitude: number;
  longitude: number;
};

// Image list

export interface MarkerImageEvent {
  image: MapMarkerImage;
};

export interface MarkerImagePressEvent extends MarkerImageEvent {
};