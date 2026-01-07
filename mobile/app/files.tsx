import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ApiError, apiRequest } from '../utils/api';
import { clearAuthToken, getAuthToken } from '../utils/auth';

const brandColor = '#f76c63';

const iconSources = {
  folder: require('../assets/icons/folder.png'),
  pdf: require('../assets/icons/pdf.png'),
  word: require('../assets/icons/word.png'),
  excel: require('../assets/icons/excel.png'),
  archive: require('../assets/icons/archive.png'),
  image: require('../assets/icons/image.png'),
  text: require('../assets/icons/text.png'),
  video: require('../assets/icons/video.png'),
  file: require('../assets/icons/file.png'),
} as const;

type FileCard = {
  id: number;
  name: string;
  type: keyof typeof iconSources | 'unknown';
  extension?: string;
};

type ApiFileItem = {
  id: number;
  name: string;
  is_folder: boolean;
};

const iconForType = (type: FileCard['type']) => {
  if (type in iconSources) {
    return iconSources[type as keyof typeof iconSources];
  }
  return iconSources.file;
};

const extensionMap: Record<string, FileCard['type']> = {
  pdf: 'pdf',
  doc: 'word',
  docx: 'word',
  odt: 'word',
  xls: 'excel',
  xlsx: 'excel',
  csv: 'excel',
  zip: 'archive',
  rar: 'archive',
  '7z': 'archive',
  png: 'image',
  jpg: 'image',
  jpeg: 'image',
  gif: 'image',
  webp: 'image',
  txt: 'text',
  md: 'text',
  mp4: 'video',
  mov: 'video',
  mkv: 'video',
};

const toCard = (item: ApiFileItem): FileCard => {
  if (item.is_folder) {
    return { id: item.id, name: item.name, type: 'folder' };
  }
  const extension = item.name.includes('.') ? item.name.split('.').pop()?.toLowerCase() : undefined;
  const type = (extension && extensionMap[extension]) || 'unknown';
  return { id: item.id, name: item.name, type, extension };
};

export default function FilesScreen() {
  const [items, setItems] = useState<FileCard[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.replace('/');
      return;
    }

    const loadFiles = async () => {
      try {
        setIsLoading(true);
        const data = await apiRequest<ApiFileItem[]>('/api/files', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setItems(data.map(toCard));
        setError(null);
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          clearAuthToken();
          router.replace('/');
          return;
        }
        const message = err instanceof ApiError ? err.message : "Impossible de charger les fichiers.";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    loadFiles();
  }, [router]);

  const cards = useMemo(() => items.map((item) => ({ ...item, icon: iconForType(item.type) })), [items]);

  const handleLogout = () => {
    clearAuthToken();
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.wrapper}>
        <View style={styles.sidebar}>
          <View style={styles.sidebarHeader}>
            <Ionicons name="cloud-upload-outline" size={32} color="#fff" />
            <Text style={styles.sidebarTitle}>SUPFile</Text>
          </View>
          <View style={styles.sidebarLinks}>
            <Ionicons name="home-outline" size={24} color="#fff" style={styles.sidebarIcon} />
            <Ionicons name="folder-open-outline" size={24} color="#fff" style={styles.sidebarIcon} />
            <Ionicons name="document-text-outline" size={24} color="#fff" style={styles.sidebarIcon} />
            <Ionicons name="star-outline" size={24} color="#fff" style={styles.sidebarIcon} />
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.topBar}>
            <View style={styles.searchBar}>
              <MaterialIcons name="search" size={20} color="#7a7a7a" />
              <TextInput
                style={styles.searchInput}
                placeholder="Rechercher un fichier ou un dossier"
                placeholderTextColor="#7a7a7a"
              />
            </View>

            <Pressable style={styles.logoutButton} accessibilityLabel="Se déconnecter" onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={24} color="#2d2d2d" />
            </Pressable>
          </View>

          <View style={styles.headingRow}>
            <Text style={styles.pageTitle}>Mon SUPFile</Text>
            <Text style={styles.breadcrumb}>Mes fichiers locaux • Dossier de test</Text>
          </View>

          {isLoading ? <ActivityIndicator size="small" color={brandColor} /> : null}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {!isLoading && !error && cards.length === 0 ? (
            <Text style={styles.emptyText}>Aucun fichier disponible pour le moment.</Text>
          ) : (
            <View style={styles.grid}>
              {cards.map((item) => (
                <View key={item.id} style={styles.card}>
                  <View style={styles.cardImageWrapper}>
                    <Image source={item.icon} style={styles.cardImage} resizeMode="contain" />
                  </View>
                  <Text style={styles.cardName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.cardExtension}>
                    {item.type === 'folder' ? 'DOSSIER' : (item.extension || 'inconnu').toUpperCase()}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4f4f8',
  },
  wrapper: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 86,
    backgroundColor: brandColor,
    paddingTop: 26,
    paddingBottom: 32,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sidebarHeader: {
    alignItems: 'center',
    gap: 8,
  },
  sidebarTitle: {
    color: '#fff',
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  sidebarLinks: {
    alignItems: 'center',
    gap: 22,
  },
  sidebarIcon: {
    backgroundColor: 'rgba(0,0,0,0.08)',
    padding: 10,
    borderRadius: 14,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    flexGrow: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 14,
    flex: 1,
    gap: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#2d2d2d',
  },
  logoutButton: {
    marginLeft: 14,
    height: 44,
    width: 52,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  headingRow: {
    marginBottom: 14,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1f1f1f',
  },
  breadcrumb: {
    color: '#7a7a7a',
    marginTop: 4,
  },
  errorText: {
    color: '#d6362a',
    marginBottom: 12,
    fontWeight: '600',
  },
  emptyText: {
    color: '#7a7a7a',
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 18,
  },
  card: {
    width: '45%',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 14,
    shadowColor: '#1f1f1f',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  cardImageWrapper: {
    backgroundColor: '#f7f7f7',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardImage: {
    width: 70,
    height: 70,
  },
  cardName: {
    marginTop: 12,
    fontWeight: '700',
    color: '#2d2d2d',
  },
  cardExtension: {
    color: '#7a7a7a',
    marginTop: 4,
    fontSize: 12,
    letterSpacing: 0.4,
  },
});
