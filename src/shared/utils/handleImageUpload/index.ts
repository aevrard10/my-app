import queryClient from "@shared/graphql/utils/queryClient";
import useCurrentTokenQuery from "@shared/hooks/queries/useCurrentTokenQuery";
import * as FileSystem from "expo-file-system";

const cleanFileFromCache = async (fileUri: string, deleteIt = false) => {
  if (!deleteIt) {
    return;
  }

  console.log("🗂️ 👉 DELETING FILE FROM CACHE DIRECTORY..");
  await FileSystem.deleteAsync(fileUri);
};

const convertBlobToUri = async (blob: Blob) => {
  const reader = new FileReader();
  return new Promise<string>((resolve, reject) => {
    reader.onload = async () => {
      const base64 = reader.result?.toString().split(",")[1]; // Récupère la data base64
      if (!base64) {
        reject(new Error("Erreur de conversion Blob → Base64"));
        return;
      }

      // Écrire dans un fichier temporaire
      const fileUri = `${FileSystem.cacheDirectory}temp_${Date.now()}.jpg`;
      await FileSystem.writeAsStringAsync(fileUri, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });
      resolve(fileUri);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(blob);
  });
};

const handleImageUpload = async (file: File | Blob, d: string) => {
  try {
    const token = await queryClient.ensureQueryData({
      queryKey: useCurrentTokenQuery.queryKey,
      queryFn: useCurrentTokenQuery.queryFn,
    });
    console.log("🗂️ UPLOADING DOCUMENT (NATIVE)..");
    console.log("🗂️ file: ", file);
    console.log("🗂️ id: ", d);

    let documentUri: string;

    if (file instanceof Blob) {
      documentUri = await convertBlobToUri(file);
    } else if ("uri" in file) {
      documentUri = file.uri;
    } else {
      throw new Error("Impossible de récupérer l'URI du fichier.");
    }

    console.log("🗂️ documentUri: ", documentUri);

    const formData = new FormData();
    formData.append("file", {
      uri: documentUri,
      name: `image_${Date.now()}.jpg`,
      type: "image/jpeg",
    });
    formData.append("id", d);

    console.log("🗂️ FormData :", formData);

    const response = await fetch("http://192.168.1.20:3030/api/file-upload", {
      method: "POST",
      body: formData,
      headers: {
        token, // Ajoute ton token ici si nécessaire
        "Content-Type": "multipart/form-data",
      },
    });

    if (!response.ok) {
      throw new Error("Erreur lors de l'upload de l'image.");
    }

    const data = await response.json();
    console.log("🗂️ Image uploadée avec succès :", data.url);

    return data;
  } catch (error) {
    console.error("🗂️ 👉 UPLOAD ERROR: ", error);
    throw error;
  }
};


export default handleImageUpload;