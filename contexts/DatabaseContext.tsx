import { initDatabase } from "@/database/schema";
import { MapMarker, MapMarkerImage } from "@/types";
import * as SQLite from "expo-sqlite";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface DatabaseContextType {
  // Операции с базой данных
  // Маркеры
  addMarker: (latitude: number, longitude: number) => Promise<MapMarker>;
  updateMarker: (id: number, latitude: number, longitude: number) => Promise<MapMarker>;
  deleteMarker: (id: number) => Promise<void>;
  getMarkers: () => Promise<MapMarker[]>;
  getMarkerById: (id: number) => Promise<MapMarker | null>;

  // Изображения
  addMarkerImage: (markerId: number, uri: string) => Promise<MapMarkerImage>;
  deleteMarkerImage: (imageId: number) => Promise<void>;
  getMarkerImages: (markerId: number) => Promise<MapMarkerImage[]>;

  // Статусы
  isLoading: boolean;
  error: Error | null;
};

const DatabaseContext = createContext<DatabaseContextType | null>(null);

export const useDatabase = (): DatabaseContextType => {
  const context = useContext(DatabaseContext);
  if (context === null) {
    throw new Error('useDatabase может использоватся только внутри DatabaseProvider');
  }
  return context;
};

interface DatabaseProviderProps {
  children: ReactNode;
}

export const DatabaseProvider: React.FC<DatabaseProviderProps> = ({ children }) => {
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initDatabase()
      .then(setDb)
      .catch(setError)
      .finally(() => setIsLoading(false));
    return () => {
      if (db) {
        db.closeAsync()
          .catch(console.error);
      }
    };
  }, []);

  const addMarker = async (latitude: number, longitude: number): Promise<MapMarker> => {
    if (!db) throw new Error("БД не инициализирована");

    const addedMarker = await db.getFirstAsync<MapMarker>(
      `INSERT INTO markers (latitude, longitude) VALUES ($latitude, $longitude) RETURNING id, latitude, longitude;`,
      {
        $latitude: latitude,
        $longitude: longitude
      }
    );

    if (!addedMarker) throw new Error("Ошибка добавления маркера");

    return addedMarker;
  }

  const updateMarker = async (id: number, latitude: number, longitude: number): Promise<MapMarker> => {
    if (!db) throw new Error("БД не инициализирована");

    const updatedMarker = await db.getFirstAsync<MapMarker>(
      `UPDATE markers SET latitude = $latitude, longitude = $longitude WHERE id = $id RETURNING id, latitude, longitude;`,
      {
        $id: id,
        $latitude: latitude,
        $longitude: longitude
      }
    );

    if (!updatedMarker) throw new Error("Ошибка обновления маркера");

    return updatedMarker;
  }

  const deleteMarker = async (id: number): Promise<void> => {
    if (!db) throw new Error("БД не инициализирована");

    await db.runAsync(
      `DELETE FROM markers WHERE id = $id;`,
      {
        $id: id
      }
    );
  }

  const getMarkers = async (): Promise<MapMarker[]> => {
    if (!db) throw new Error("БД не инициализирована");

    return await db.getAllAsync<MapMarker>(
      `SELECT id, latitude, longitude FROM markers;`
    );
  }

  const getMarkerById = async (id: number): Promise<MapMarker | null> => {
    if (!db) throw new Error("БД не инициализирована");

    const marker = await db.getFirstAsync<MapMarker>(
      `SELECT id, latitude, longitude FROM markers WHERE id = $id;`,
      {
        $id: id
      }
    );

    return marker;
  }

  const addMarkerImage = async (markerId: number, uri: string): Promise<MapMarkerImage> => {
    if (!db) throw new Error("БД не инициализирована");

    const addedMarker = await db.getFirstAsync<MapMarkerImage>(
      `INSERT INTO marker_images (marker_id, uri) VALUES ($marker_id, $uri) RETURNING id, uri;`,
      {
        $marker_id: markerId,
        $uri: uri
      }
    );

    if (!addedMarker) throw new Error("Ошибка добавления маркера");

    return addedMarker;
  }

  const deleteMarkerImage = async (imageId: number): Promise<void> => {
    if (!db) throw new Error("БД не инициализирована");

    await db.runAsync(
      `DELETE FROM marker_images WHERE id = $id;`,
      {
        $id: imageId
      }
    );
  }

  const getMarkerImages = async (markerId: number): Promise<MapMarkerImage[]> => {
    if (!db) throw new Error("БД не инициализирована");

    return await db.getAllAsync<MapMarkerImage>(
      `SELECT id, uri FROM marker_images WHERE marker_id = $marker_id;`,
      {
        $marker_id: markerId
      }
    );
  }

  const contextValue: DatabaseContextType = {
    addMarker,
    updateMarker,
    deleteMarker,
    getMarkers,
    getMarkerById,

    addMarkerImage,
    deleteMarkerImage,
    getMarkerImages,

    isLoading,
    error
  }
  
  return (
    <DatabaseContext.Provider value={contextValue}>
      {children}
    </DatabaseContext.Provider>
  );
};