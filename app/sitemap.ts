export default async function sitemap() {
    const baseUrl = "https://temple-shrine-map-japan.vercel.app";

    return [
        { url: `${baseUrl}/map`, lastModified: new Date() },
        { url: `${baseUrl}/about`, lastModified: new Date() },
    ];
}
