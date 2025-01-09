import queryClient from "@shared/graphql/utils/queryClient";
import useCurrentTokenQuery from "@shared/hooks/queries/useCurrentTokenQuery";
import useReptilesQuery from "../../../navigation/screens/Reptiles/hooks/queries/useReptilesQuery";

const handleImageUpload = async (file: File | Blob, d: string) => {
  try {
    console.log("file", file);
    const token = await queryClient.ensureQueryData({
      queryKey: useCurrentTokenQuery.queryKey,
      queryFn: useCurrentTokenQuery.queryFn,
    });
    const formData = new FormData();
    formData.append("file", file); // Clé 'file' doit correspondre à `upload.single("file")`
    formData.append("id", d); // Envoyer l'ID du reptile
    console.log("formData", formData);
    console.log("file", file);
    const response = await fetch("http://localhost:3030/api/file-upload", {
      method: "POST",
      body: formData,
      headers: {
        token, // Envoyez le token d'authentification, si nécessaire
      },
    })?.catch((error) => {
      console.error("Erreur lors de l'upload de l'image :", error);
    });

    if (!response?.ok) {
      throw new Error("Erreur lors de l'upload de l'image.");
    }

    const data = await response?.json();
    queryClient.invalidateQueries({ queryKey: useReptilesQuery.queryKey });
    console.log("Image uploadée avec succès :", data.url);

    // Faire quelque chose avec l'URL retournée (par ex., mise à jour de la base de données)
  } catch (error) {
    console.error("Erreur lors de l'upload :", error);
  }
};

export default handleImageUpload;
