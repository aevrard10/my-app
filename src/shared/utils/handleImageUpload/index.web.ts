import queryClient from "@shared/graphql/utils/queryClient";
import useCurrentTokenQuery from "@shared/hooks/queries/useCurrentTokenQuery";
import useReptilesQuery from "../../../navigation/screens/Reptiles/hooks/queries/useReptilesQuery";

const handleImageUpload = async (file :any, reptileId: string) => {
  try {
    console.log("file", file);
    const token = await queryClient.ensureQueryData({
      queryKey: useCurrentTokenQuery.queryKey,
      queryFn: useCurrentTokenQuery.queryFn,
    });

    const formData = new FormData();
    formData.append("image", file); // "image" correspond au champ de multer
    formData.append("reptileId", reptileId); // ID du reptile pour l'update

    const response = await fetch("https://back-hsvb.onrender.com/api/upload", {
      method: "POST",
      body: formData,
      headers: {
        token, // Envoyez le token d'authentification, si nécessaire
      },
    })?.catch((error) => {
      console.error("Erreur lors de l'upload de l'image :", error);
    });



    if (!response?.ok) {
      throw new Error("Erreur lors de l'upload de l'image");
    }

    const data = await response.json();
    const imageUrl = data.imageUrl;

    console.log("Image uploadée avec succès :", imageUrl);

    // Tu peux maintenant utiliser l'URL pour l'afficher ou mettre à jour l'état
    // Par exemple, pour afficher l'image dans un <img> :
    // setImageUrl(imageUrl);
  } catch (error) {
    console.error("Erreur lors de l'upload :", error);
  }
};

export default handleImageUpload;
