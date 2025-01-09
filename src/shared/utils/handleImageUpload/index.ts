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

const handleImageUpload = async (file: File | Blob, d: string) => {
  const token = await queryClient.ensureQueryData({
    queryKey: useCurrentTokenQuery.queryKey,
    queryFn: useCurrentTokenQuery.queryFn,
  });
  console.log("🗂️ UPLOADING DOCUMENT (NATIVE)..");
  console.log("🗂️ file: ", file);
  console.log("🗂️ id: ", d);
  console.log("🗂️ token: ", token);

  let documentUri = file.path;
  let isFileCopiedToCache = false;

  try {
    const fileInfo = await FileSystem.getInfoAsync(documentUri);
    console.log("🗂️ 👉 FILE INFO: ", JSON.stringify(fileInfo, null, 2));
    const formData = new FormData();
    formData.append("file", {
      uri: documentUri,
      name: fileInfo.name || `image_${Date.now()}.jpg`, // Nom du fichier
      type: file.type, // Type MIME (modifiez-le si nécessaire)
    });
    formData.append("id", d);
    console.log("🗂️ FormData :", formData);

    const uploadResponse = await FileSystem.uploadAsync(
      "http://localhost:3030/api/file-upload",
      fileInfo.uri,
      {
        headers: {
          token,
          "Content-Type": "multipart/form-data",
        },
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
      }
    );

    const uploadResult = {
      ...uploadResponse,
      ok: uploadResponse.status === 200,
    };

    return uploadResult;
  } catch (error) {
    console.log("🗂️ 👉 UPLOAD ERROR: ", JSON.stringify(error, null, 2));

    cleanFileFromCache(documentUri, isFileCopiedToCache && !!documentUri);

    return Promise.reject(error);
  }
};

export default handleImageUpload;
