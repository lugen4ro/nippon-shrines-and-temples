import { z } from "zod";

const prefectures = z.enum([
    "hokkaido",
    "aomori",
    "iwate",
    "miyagi",
    "akita",
    "yamagata",
    "fukushima",
    "ibaraki",
    "tochigi",
    "gunma",
    "saitama",
    "chiba",
    "tokyo",
    "kanagawa",
    "niigata",
    "toyama",
    "ishikawa",
    "fukui",
    "yamanashi",
    "nagano",
    "gifu",
    "shizuoka",
    "aichi",
    "mie",
    "shiga",
    "kyoto",
    "osaka",
    "hyogo",
    "nara",
    "wakayama",
    "tottori",
    "shimane",
    "okayama",
    "hiroshima",
    "yamaguchi",
    "tokushima",
    "kagawa",
    "ehime",
    "kochi",
    "fukuoka",
    "saga",
    "nagasaki",
    "kumamoto",
    "oita",
    "miyazaki",
    "kagoshima",
    "okinawa",
]);

export const PlaceSchema = z.object({
    slug: z.string().min(1).max(255),
    name: z.string().min(1).max(255),
    name_jp: z.string().min(1).max(255),
    desc: z.string(),
    category: z.enum(["TEMPLE", "SHRINE", "OTHER"]),
    prefecture_slug: prefectures,
    geocode_latitude: z.number(),
    geocode_longitude: z.number(),
    icon_url: z.string().optional(),
    gmap_link: z.string(),
    total_reviews: z.number(),
    wiki_link: z.string(),
});

export const ImageSchema = z.object({
    place_slug: z.string().min(1).max(255),
    public_id: z.string().min(1).max(255),
    width: z.number(),
    height: z.number(),
    format: z.string(),
    url: z.string(),
    bytes: z.number(),
    order: z.number().min(1),
    source_name: z.string(),
    source_url: z.string(),
});

// export const patchIssueSchema = z.object({
//     title: z.string().min(1, "Title is required.").max(255).optional(),
//     description: z
//         .string()
//         .min(1, "Description is required.")
//         .max(65535)
//         .optional(),
//     assignedToUserId: z
//         .string()
//         .min(1, "assignedToUserId is required")
//         .max(255)
//         .optional()
//         .nullable(), // So we can unassign
// });
