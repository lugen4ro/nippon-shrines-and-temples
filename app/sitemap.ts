export default async function sitemap() {
    const baseUrl = "https://nipponshrines.com";

    return [
        { url: `${baseUrl}/map`, lastModified: new Date() },
        { url: `${baseUrl}/about`, lastModified: new Date() },
    ];
}
