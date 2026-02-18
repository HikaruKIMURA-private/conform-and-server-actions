export const baseUrl = (options?: { useCommitURL?: boolean }) => {
  const isProd = process.env.NEXT_PUBLIC_VERCEL_ENV === "production";
  console.log(process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL);
  const url = isProd
    ? process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
    : options?.useCommitURL
      ? process.env.NEXT_PUBLIC_VERCEL_URL
      : process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL;
  console.log(url);
  return url
    ? `https://${url}`
    : `http://localhost:${process.env.NEXT_PUBLIC_PORT || 3000}`;
};
