
import imgProduct1 from "@/assets/lop3.png";
import imgProduct2 from "@/assets/lop4.png";
import imgProduct3 from "@/assets/lop5.png";
import imgProduct4 from "@/assets/combo.jpg";
import { resources, ResourceItem } from "./resources";

export type ProductType = 'book' | 'video' | 'code' | 'ppt' | 'video_demo' | 'robotics';
export type GradeLevel = 3 | 4 | 5;

export interface Product {
    id: string; // Changed from number to string to match resource id
    title: string;
    type: ProductType[];
    grade: GradeLevel;
    price: number;
    originalPrice?: number;
    rating: number;
    reviews: number;
    image: string;
    description?: string; // Added description field
    previewUrl: string; // Drive Link Preview
    downloadUrl: string; // Drive Link Download (but will show payment toast)
}

// Helper to map resource type to product type
const mapType = (resType: string): ProductType => {
    switch (resType) {
        case 'books': return 'book';
        case 'videos': return 'video';
        case 'code': return 'code';
        case 'ppt': return 'ppt';
        case 'video_demo': return 'video_demo';
        case 'robotics': return 'robotics';
        default: return 'book';
    }
};

// Helper to parse grade
const parseGrade = (resGrade: string | undefined, category: string): GradeLevel => {
    if (resGrade) {
        const p = parseInt(resGrade);
        if (!isNaN(p) && (p === 3 || p === 4 || p === 5)) return p as GradeLevel;
    }
    // Fallback based on category if grade not set
    if (category === '6-8') return 3;
    if (category === '9-11') return 4;
    // '12-14' maps to 5
    return 5;
};

// Helper to get image based on grade/type
const getImage = (grade: number): string => {
    switch (grade) {
        case 3: return imgProduct1;
        case 4: return imgProduct2;
        case 5: return imgProduct3;
        default: return imgProduct4; // Fallback
    }
};

// Convert resources to products
export const products: Product[] = resources.filter(res => res.category !== 'teacher').map((res: ResourceItem) => {
    const grade = parseGrade(res.grade, res.category);

    // Logic giả lập giá và rating (vì resource gốc không có)
    const isCombo = res.id.includes('combo');

    return {
        id: res.id,
        title: res.title,
        type: [mapType(res.type)], // Hiện tại mỗi resource chỉ có 1 type
        grade: grade,
        price: 49000, // Giá mặc định, có thể tùy chỉnh logic sau
        originalPrice: 150000,
        rating: 5.0,
        reviews: Math.floor(Math.random() * 100) + 10,
        image: getImage(grade),
        description: res.description,
        previewUrl: res.previewUrl,
        downloadUrl: res.downloadUrl
    };
});
