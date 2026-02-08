import React, { useCallback, useMemo, useRef } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import CardSurface from "@shared/components/CardSurface";
import { useI18n } from "@shared/i18n";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system/legacy";
import { useSnackbar } from "@rn-flix/snackbar";
import QRCode from "react-native-qrcode-svg";

type QrCodeSectionProps = {
  reptile: {
    id: string;
    name?: string | null;
    species?: string | null;
    sex?: string | null;
    danger_level?: string | null;
    acquired_date?: string | null;
    origin?: string | null;
    location?: string | null;
    diet?: string | null;
    temperature_range?: string | null;
    humidity_level?: number | null;
  } | null;
};

const QrCodeSection = ({ reptile }: QrCodeSectionProps) => {
  const { t } = useI18n();
  const { show } = useSnackbar();
  const qrRef = useRef<any>(null);

  const qrValue = useMemo(() => {
    if (!reptile) {
      return "reptitrack://";
    }
    return `reptitrack://reptile/${reptile.id}`;
  }, [reptile]);

  const withQrData = useCallback(async (fn: (data: string) => Promise<void>) => {
    if (!qrRef.current || !qrRef.current.toDataURL) {
      show(t("profile.qr_unavailable"));
      return;
    }
    qrRef.current.toDataURL(async (data: string) => {
      await fn(data);
    });
  }, [show, t]);

  const handleShare = useCallback(async () => {
    if (Platform.OS === "web") {
      show(t("profile.qr_web_only"));
      return;
    }
    if (!(await Sharing.isAvailableAsync())) {
      show(t("profile.qr_share_unavailable"));
      return;
    }
    await withQrData(async (data) => {
      const fileUri = `${FileSystem.cacheDirectory}qr-${reptile?.id || "reptitrack"}.png`;
      await FileSystem.writeAsStringAsync(fileUri, data, {
        encoding: FileSystem.EncodingType.Base64,
      });
      await Sharing.shareAsync(fileUri);
    });
  }, [reptile?.id, show, t, withQrData]);

  const handlePrint = useCallback(async () => {
    if (Platform.OS === "web") {
      show(t("profile.qr_web_only"));
      return;
    }
    await withQrData(async (data) => {
      try {
        const { printAsync } = await import("expo-print");
        const html = `
        <html>
          <body style="font-family: -apple-system, Roboto, sans-serif; padding: 24px;">
            <h2>${reptile?.name || "ReptiTrack"}</h2>
            <img src="data:image/png;base64,${data}" style="width:220px;height:220px;" />
          </body>
        </html>`;
        await printAsync({ html });
      } catch {
        show(t("profile.export_missing_print"));
      }
    });
  }, [reptile?.name, show, t, withQrData]);

  return (
    <CardSurface style={styles.card}>
      <Text variant="titleMedium" style={styles.title}>
        {t("profile.qr_title")}
      </Text>
      <Text variant="bodySmall" style={styles.subtitle}>
        {t("profile.qr_subtitle")}
      </Text>
      <View style={styles.qrContainer}>
        <QRCode
          value={qrValue}
          size={180}
          color="#1F3A2E"
          backgroundColor="white"
          getRef={qrRef}
        />
      </View>
      <View style={styles.actions}>
        <Button mode="outlined" icon="share-variant" onPress={handleShare}>
          {t("profile.qr_share")}
        </Button>
        <Button mode="contained" icon="printer" onPress={handlePrint}>
          {t("profile.qr_print")}
        </Button>
      </View>
    </CardSurface>
  );
};

const styles = StyleSheet.create({
  card: {
    marginTop: 12,
    gap: 8,
  },
  title: {
    marginBottom: 2,
  },
  subtitle: {
    opacity: 0.7,
  },
  qrContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
});

export default QrCodeSection;
