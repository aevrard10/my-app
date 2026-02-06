import React from "react";
import { ActivityIndicator, Button, IconButton, Text, TouchableRipple } from "react-native-paper";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import CardSurface from "@shared/components/CardSurface";
import { formatDDMMYYYY } from "@shared/utils/formatedDate";

type Photo = {
  id: string;
  url: string;
  created_at: string;
};

type GallerySectionProps = {
  photos?: Photo[];
  isLoading?: boolean;
  onAdd: () => void;
  onDelete: (id: string) => void;
  onOpen: (photo: Photo) => void;
  isAdding?: boolean;
  onShare?: (photo: Photo) => void;
};

const GallerySection = ({
  photos,
  isLoading,
  onAdd,
  onDelete,
  onOpen,
  isAdding,
  onShare,
}: GallerySectionProps) => {
  return (
    <CardSurface style={styles.card}>
      <View style={styles.header}>
        <Text variant="titleMedium">Galerie</Text>
        <Button mode="outlined" compact onPress={onAdd} loading={isAdding}>
          Ajouter
        </Button>
      </View>
      {isLoading ? (
        <ActivityIndicator style={styles.loader} />
      ) : photos && photos.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.row}>
            {photos.map((photo) => (
              <TouchableRipple
                key={photo.id}
                onLongPress={() => onDelete(photo.id)}
                onPress={() => onOpen(photo)}
                style={styles.item}
              >
                <View>
                  <Image source={{ uri: photo.url }} style={styles.image} />
                  <View style={styles.footer}>
                    <Text variant="labelSmall" style={styles.date}>
                      {formatDDMMYYYY(photo.created_at)}
                    </Text>
                    {onShare && (
                      <IconButton
                        icon="share-variant"
                        size={16}
                        onPress={() => onShare(photo)}
                        style={styles.shareBtn}
                      />
                    )}
                  </View>
                </View>
              </TouchableRipple>
            ))}
          </View>
        </ScrollView>
      ) : (
        <Text variant="bodySmall" style={styles.empty}>
          Ajoutez des photos pour garder l&apos;historique.
        </Text>
      )}
    </CardSurface>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    gap: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  item: {
    borderRadius: 14,
    overflow: "hidden",
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 14,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
  },
  date: {
    opacity: 0.6,
  },
  shareBtn: {
    margin: 0,
  },
  empty: {
    opacity: 0.6,
  },
  loader: {
    alignSelf: "center",
    marginVertical: 12,
  },
});

export default GallerySection;
