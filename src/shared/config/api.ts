const getGraphQLEndpoint = () => {
  const url = process.env.EXPO_PUBLIC_API_URL;
  if (!url) {
    throw new Error("EXPO_PUBLIC_API_URL is not set");
  }
  return url;
};

const getUploadEndpoint = () => {
  const graphQLEndpoint = getGraphQLEndpoint();
  const baseUrl = graphQLEndpoint.replace(/\/graphql\/?$/, "");
  return `${baseUrl}/api/upload`;
};

export { getGraphQLEndpoint, getUploadEndpoint };
