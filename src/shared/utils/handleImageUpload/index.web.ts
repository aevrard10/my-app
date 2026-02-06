import queryClient from "@shared/graphql/utils/queryClient";
import useCurrentTokenQuery from "@shared/hooks/queries/useCurrentTokenQuery";
import { getUploadEndpoint } from "@shared/config/api";

const handleImageUpload = async (
  file: any,
  reptileId: string,
  type: "profile" | "gallery" = "profile"
) => {
  try {
    const token = await queryClient.ensureQueryData({
      queryKey: useCurrentTokenQuery.queryKey,
      queryFn: useCurrentTokenQuery.queryFn,
    });

    const formData = new FormData();
    formData.append("image", file); // "image" correspond au champ de multer
    formData.append("reptileId", reptileId); // ID du reptile pour l'update
    formData.append("type", type);

    const response = await fetch(getUploadEndpoint(), {
      method: "POST",
      body: formData,
      headers: token ? { token } : undefined,
    });

    if (!response?.ok) {
      throw new Error("Erreur lors de l'upload de l'image");
    }

    const data = await response.json();
    const imageUrl = data.imageUrl;
    return imageUrl;
  } catch (error) {
    throw error;
  }
};

export default handleImageUpload;
