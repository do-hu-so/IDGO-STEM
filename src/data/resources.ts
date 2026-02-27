
export type ResourceType = 'books' | 'code' | 'videos' | 'ppt' | 'video_demo' | 'robotics';
export type AgeCategory = '6-8' | '9-11' | '12-14' | 'teacher';
export type GradeLevel = '3' | '4' | '5';

export interface ResourceItem {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    previewUrl: string;
    downloadUrl: string;
    type: ResourceType;
    category: AgeCategory;
    grade?: GradeLevel;
}

// Default Constants (Dùng cho dữ liệu mẫu, bạn có thể thay thế trong từng item bên dưới)
const THUMB_BOOK = "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022&auto=format&fit=crop";
const THUMB_CODE = "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=2069&auto=format&fit=crop";
const THUMB_VID = "https://codekids.asia/wp-content/uploads/2023/11/hoc-lap-trinh-scratch.png";
const THUMB_PPT = "https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=2070&auto=format&fit=crop";

const LINK_DL = "https://drive.google.com/drive/folders/1aQpDQwkYAnnof2hSJTdvFKPecJBmIQS_?usp=sharing";
const LINK_PV_IMG = "https://drive.google.com/file/d/1Z-p8KA3s6d3ABdD0kg7ckI0izGjTiQ60/view?usp=sharing";
const LINK_PV_PPT = "https://docs.google.com/presentation/d/1dCrcwt-q9lV-X0hBeDQ1vaWpB4LuycP7/edit?usp=sharing&ouid=110035452335957165964&rtpof=true&sd=true";
const LINK_PV_VID = "https://drive.google.com/file/d/15g-WMPQ9iP0MaYyQvXG-hurC0rPRJV4J/view?usp=sharing";
// thumbnail
const THUMB_BOOK3 = "https://drive.google.com/file/d/1T98Ci5LB09lto1M9barh3UE7TAX4Mt5y/view?usp=sharing"
const THUMB_CODE3 = ""
const THUMB_VIDEO3 = ""
const THUMB_PPT3 = ""

const THUMB_BOOK4 = "https://drive.google.com/file/d/1Arbxv9YNsLR423TGKHKFd6VuOOzg8FRw/view?usp=sharing"
const THUMB_CODE4 = ""
const THUMB_VIDEO4 = ""
const THUMB_PPT4 = ""

const THUMB_BOOK5 = "https://drive.google.com/file/d/1kXAimyz3Eu4J464hGwM5L25efLs60RwC/view?usp=sharing"
const THUMB_CODE5 = ""
const THUMB_VIDEO5 = ""
const THUMB_PPT5 = ""
//============================TÀI LIÊU============
//============================book================
const BOOK_3 = "https://drive.google.com/file/d/1d6Vxs5WacRejf9-4EPt9RiUM8AUR9OVz/view?usp=sharing"
const BOOK_4 = "https://drive.google.com/file/d/1bA5QZMcX-SASrtnvgAMAwjzDUwNPa5bb/view?usp=sharing"
const BOOK_5 = "https://drive.google.com/file/d/1HPe7_4wLTxP59SsIfNHbwIOGoreWg5sQ/view?usp=sharing"
//============================code================
const CODE_3 = "https://drive.google.com/file/d/1_GU1DRvMmjxgkcGc-CoC7aTT5fBDTSDi/view?usp=sharing"
const CODE_4 = "https://drive.google.com/file/d/1-omxHXe8W9YWiE1lT8GW_LzkRgJ-TYRt/view?usp=sharing"
const CODE_5 = "https://drive.google.com/file/d/1MvxYXf-D-SnmsU4yUirT7YUqu3H9KLcF/view?usp=sharing"
//============================video===============
const VIDEO_3 = "https://drive.google.com/file/d/1mYrS4lvmdhBYryUB10s0ONBIvT-1zHoN/view?usp=sharing"
const VIDEO_4 = "https://drive.google.com/file/d/1kSnUoUnP2pZlk3U8lyOZS5t4Xm2LqukJ/view?usp=sharing"
const VIDEO_5 = "https://drive.google.com/file/d/1Oq0OMLe2o-CpED1KXS-U6Y6awPFj_tk1/view?usp=sharing"
//============================ppt================
const PPT_3 = "https://docs.google.com/presentation/d/1qZHTknVZAhRJ4JSzw1CejbNSwpIkM-Og/edit?usp=sharing&ouid=110035452335957165964&rtpof=true&sd=true"
const PPT_4 = "https://docs.google.com/presentation/d/1hFu5BOjfeny5-nw7g4E1h74GN7eay2m-/edit?usp=sharing&ouid=110035452335957165964&rtpof=true&sd=true"
const PPT_5 = "https://docs.google.com/presentation/d/1kqvXgZreINwi8vOgic3qw0DJu0vRUIuQ/edit?usp=sharing&ouid=110035452335957165964&rtpof=true&sd=true"
const PROJECT_3 = CODE_3; // Alias for legacy code ref
//============================robotics================
const ROBOTICS = "https://drive.google.com/file/d/1m_os8J4bpqNT6QKVn-0IMYbG8jGuWhg3/view?usp=sharing"
const VIDEO_UNG_DUNG = "https://drive.google.com/file/d/1prGjJ7UJDhrJ5Fo3nXT5ORDelm7trZFW/view?usp=sharing"

// Helper Interface
interface ItemConfig { title: string; thumb: string; preview: string; download: string; description?: string; }
const item = (title: string, thumb: string, preview: string, download: string, description: string = ""): ItemConfig => ({ title, thumb, preview, download, description });

// =============================================================================
// DANH SÁCH CHI TIẾT (SỬA NỘI DUNG TỪNG BÀI TẠI ĐÂY)
// =============================================================================

const GRADE_3_DATA = {
    books: [
        item("Khởi động tư duy", THUMB_BOOK3, BOOK_3, LINK_DL, "Tài liệu chuyên biệt dành cho khung chương trình Lớp 3 - Khởi động tư duy"),
    ],
    code: [
        item("Code mẫu Bài 1 - Di chuyển", THUMB_CODE, PROJECT_3, LINK_DL, "Khởi động tư duy lập trình"),
        item("Code mẫu Bài 2 - Nhảy múa", THUMB_CODE, PROJECT_3, LINK_DL, "Khởi động tư duy lập trình"),
        item("Code mẫu Bài 3 - Âm nhạc", THUMB_CODE, PROJECT_3, LINK_DL, "Khởi động tư duy lập trình"),
        item("Code mẫu Bài 4 - Vẽ hình", THUMB_CODE, PROJECT_3, LINK_DL, "Khởi động tư duy lập trình"),
        item("Code mẫu Bài 5 - Kể chuyện", THUMB_CODE, PROJECT_3, LINK_DL, "Khởi động tư duy lập trình"),
    ],
    videos: [
        item("Video Kết quả lớp 3 - Bài 1", THUMB_VID, VIDEO_3, LINK_DL, "Khởi động tư duy lập trình"),
        item("Video Kết quả lớp 3 - Bài 2", THUMB_VID, VIDEO_3, LINK_DL, "Khởi động tư duy lập trình"),
        item("Video Kết quả lớp 3 - Bài 3", THUMB_VID, VIDEO_3, LINK_DL, "Khởi động tư duy lập trình"),
        item("Video Kết quả lớp 3 - Bài 4", THUMB_VID, VIDEO_3, LINK_DL, "Khởi động tư duy lập trình"),
        item("Video Kết quả lớp 3 - Bài 5", THUMB_VID, VIDEO_3, LINK_DL, "Khởi động tư duy lập trình"),
    ],
    ppt: [
        item("Slide Bài giảng lớp 3 - Bài 1", THUMB_BOOK3, PPT_3, LINK_DL, "Khởi động tư duy lập trình"),
        item("Slide Bài giảng lớp 3 - Bài 2", THUMB_BOOK3, PPT_3, LINK_DL, "Khởi động tư duy lập trình"),
        item("Slide Bài giảng lớp 3 - Bài 3", THUMB_BOOK3, PPT_3, LINK_DL, "Khởi động tư duy lập trình"),
        item("Slide Bài giảng lớp 3 - Bài 4", THUMB_BOOK3, PPT_3, LINK_DL, "Khởi động tư duy lập trình"),
        item("Slide Bài giảng lớp 3 - Bài 5", THUMB_BOOK3, PPT_3, LINK_DL, "Khởi động tư duy lập trình"),
        item("Slide Bài giảng lớp 3 - Bài 6", THUMB_BOOK3, PPT_3, LINK_DL, "Khởi động tư duy lập trình"),
        item("Slide Bài giảng lớp 3 - Bài 7", THUMB_BOOK3, PPT_3, LINK_DL, "Khởi động tư duy lập trình"),
        item("Slide Bài giảng lớp 3 - Bài 8", THUMB_BOOK3, PPT_3, LINK_DL, "Khởi động tư duy lập trình"),
        item("Slide Bài giảng lớp 3 - Bài 9", THUMB_BOOK3, PPT_3, LINK_DL, "Khởi động tư duy lập trình"),
        item("Slide Bài giảng lớp 3 - Bài 10", THUMB_BOOK3, PPT_3, LINK_DL, "Khởi động tư duy lập trình"),
        item("Slide Bài giảng lớp 3 - Bài 11", THUMB_BOOK3, PPT_3, LINK_DL, "Khởi động tư duy lập trình"),
        item("Slide Bài giảng lớp 3 - Bài 12", THUMB_BOOK3, PPT_3, LINK_DL, "Khởi động tư duy lập trình"),
        item("Slide Bài giảng lớp 3 - Bài 13", THUMB_BOOK3, PPT_3, LINK_DL, "Khởi động tư duy lập trình"),
        item("Slide Bài giảng lớp 3 - Bài 14", THUMB_BOOK3, PPT_3, LINK_DL, "Khởi động tư duy lập trình"),
        item("Slide Bài giảng lớp 3 - Bài 15", THUMB_BOOK3, PPT_3, LINK_DL, "Khởi động tư duy lập trình"),
    ]
};

const GRADE_4_DATA = {
    books: [
        item("Sáng tạo cùng Scratch", THUMB_BOOK4, BOOK_4, LINK_DL, "Phát triển kỹ năng lập trình"),
    ],
    code: [
        item("Code mẫu lớp 4 - bài 1", THUMB_CODE, CODE_4, LINK_DL, "Phát triển kỹ năng lập trình"),
        item("Code mẫu lớp 4 - bài 2", THUMB_CODE, LINK_PV_IMG, LINK_DL, "Phát triển kỹ năng lập trình"),
        item("Code mẫu lớp 4 - bài 3", THUMB_CODE, LINK_PV_IMG, LINK_DL, "Phát triển kỹ năng lập trình"),
        item("Code mẫu lớp 4 - bài 4", THUMB_CODE, LINK_PV_IMG, LINK_DL, "Phát triển kỹ năng lập trình"),
        item("Code mẫu lớp 4 - bài 5", THUMB_CODE, LINK_PV_IMG, LINK_DL, "Phát triển kỹ năng lập trình"),
    ],
    videos: [
        item("Video Kết quả lớp 4 - Bài 1", THUMB_VID, VIDEO_4, LINK_DL, "Phát triển kỹ năng lập trình"),
        item("Video Kết quả lớp 4 - Bài 2", THUMB_VID, VIDEO_4, LINK_DL, "Phát triển kỹ năng lập trình"),
        item("Video Kết quả lớp 4 - Bài 3", THUMB_VID, VIDEO_4, LINK_DL, "Phát triển kỹ năng lập trình"),
        item("Video Kết quả lớp 4 - Bài 4", THUMB_VID, VIDEO_4, LINK_DL, "Phát triển kỹ năng lập trình"),
        item("Video Kết quả lớp 4 - Bài 5", THUMB_VID, VIDEO_4, LINK_DL, "Phát triển kỹ năng lập trình"),
    ],
    ppt: [
        item("Slide Bài giảng lớp 4 - Bài 1", THUMB_BOOK4, PPT_4, LINK_DL, "Phát triển kỹ năng lập trình"),
        item("Slide Bài giảng lớp 4 - Bài 2", THUMB_BOOK4, PPT_4, LINK_DL, "Phát triển kỹ năng lập trình"),
        item("Slide Bài giảng lớp 4 - Bài 3", THUMB_BOOK4, PPT_4, LINK_DL, "Phát triển kỹ năng lập trình"),
        item("Slide Bài giảng lớp 4 - Bài 4", THUMB_BOOK4, PPT_4, LINK_DL, "Phát triển kỹ năng lập trình"),
        item("Slide Bài giảng lớp 4 - Bài 5", THUMB_BOOK4, PPT_4, LINK_DL, "Phát triển kỹ năng lập trình"),
        item("Slide Bài giảng lớp 4 - Bài 6", THUMB_BOOK4, PPT_4, LINK_DL, "Phát triển kỹ năng lập trình"),
        item("Slide Bài giảng lớp 4 - Bài 7", THUMB_BOOK4, PPT_4, LINK_DL, "Phát triển kỹ năng lập trình"),
        item("Slide Bài giảng lớp 4 - Bài 8", THUMB_BOOK4, PPT_4, LINK_DL, "Phát triển kỹ năng lập trình"),
        item("Slide Bài giảng lớp 4 - Bài 9", THUMB_BOOK4, PPT_4, LINK_DL, "Phát triển kỹ năng lập trình"),
        item("Slide Bài giảng lớp 4 - Bài 10", THUMB_BOOK4, PPT_4, LINK_DL, "Phát triển kỹ năng lập trình"),
        item("Slide Bài giảng lớp 4 - Bài 11", THUMB_BOOK4, PPT_4, LINK_DL, "Phát triển kỹ năng lập trình"),
        item("Slide Bài giảng lớp 4 - Bài 12", THUMB_BOOK4, PPT_4, LINK_DL, "Phát triển kỹ năng lập trình"),
        item("Slide Bài giảng lớp 4 - Bài 13", THUMB_BOOK4, PPT_4, LINK_DL, "Phát triển kỹ năng lập trình"),
        item("Slide Bài giảng lớp 4 - Bài 14", THUMB_BOOK4, PPT_4, LINK_DL, "Phát triển kỹ năng lập trình"),
        item("Slide Bài giảng lớp 4 - Bài 15", THUMB_BOOK4, PPT_4, LINK_DL, "Phát triển kỹ năng lập trình"),
    ]
};

const GRADE_5_DATA = {
    books: [
        item("Chiến binh Scratch", THUMB_BOOK5, BOOK_5, LINK_DL, "Dự án STEM ứng dụng"),
    ],
    code: [
        item("Code mẫu lớp 5 - bài 1", THUMB_CODE, CODE_5, LINK_DL, "Dự án STEM ứng dụng"),
        item("Code mẫu lớp 5 - bài 2", THUMB_CODE, LINK_PV_IMG, LINK_DL, "Dự án STEM ứng dụng"),
        item("Code mẫu lớp 5 - bài 3", THUMB_CODE, LINK_PV_IMG, LINK_DL, "Dự án STEM ứng dụng"),
        item("Code mẫu lớp 5 - bài 4", THUMB_CODE, LINK_PV_IMG, LINK_DL, "Dự án STEM ứng dụng"),
        item("Code mẫu lớp 5 - bài 5", THUMB_CODE, LINK_PV_IMG, LINK_DL, "Dự án STEM ứng dụng"),
        item("Code mẫu lớp 5 - bài 6", THUMB_CODE, LINK_PV_IMG, LINK_DL, "Dự án STEM ứng dụng"),
    ],
    videos: [
        item("Video Kết quả - Bài 1", THUMB_VID, VIDEO_5, LINK_DL, "Dự án STEM ứng dụng"),
        item("Video Kết quả - Bài 2", THUMB_VID, VIDEO_5, LINK_DL, "Dự án STEM ứng dụng"),
        item("Video Kết quả - Bài 3", THUMB_VID, VIDEO_5, LINK_DL, "Dự án STEM ứng dụng"),
        item("Video Kết quả - Bài 4", THUMB_VID, VIDEO_5, LINK_DL, "Dự án STEM ứng dụng"),
        item("Video Kết quả - Bài 5", THUMB_VID, VIDEO_5, LINK_DL, "Dự án STEM ứng dụng"),
    ],
    ppt: [
        item("Slide Bài giảng lớp 5 - Bài 1", THUMB_BOOK5, PPT_5, LINK_DL, "Dự án STEM ứng dụng"),
        item("Slide Bài giảng lớp 5 - Bài 2", THUMB_BOOK5, PPT_5, LINK_DL, "Dự án STEM ứng dụng"),
        item("Slide Bài giảng lớp 5 - Bài 3", THUMB_BOOK5, PPT_5, LINK_DL, "Dự án STEM ứng dụng"),
        item("Slide Bài giảng lớp 5 - Bài 4", THUMB_BOOK5, PPT_5, LINK_DL, "Dự án STEM ứng dụng"),
        item("Slide Bài giảng lớp 5 - Bài 5", THUMB_BOOK5, PPT_5, LINK_DL, "Dự án STEM ứng dụng"),
        item("Slide Bài giảng lớp 5 - Bài 6", THUMB_BOOK5, PPT_5, LINK_DL, "Dự án STEM ứng dụng"),
        item("Slide Bài giảng lớp 5 - Bài 7", THUMB_BOOK5, PPT_5, LINK_DL, "Dự án STEM ứng dụng"),
        item("Slide Bài giảng lớp 5 - Bài 8", THUMB_BOOK5, PPT_5, LINK_DL, "Dự án STEM ứng dụng"),
        item("Slide Bài giảng lớp 5 - Bài 9", THUMB_BOOK5, PPT_5, LINK_DL, "Dự án STEM ứng dụng"),
        item("Slide Bài giảng lớp 5 - Bài 10", THUMB_BOOK5, PPT_5, LINK_DL, "Dự án STEM ứng dụng"),
        item("Slide Bài giảng lớp 5 - Bài 11", THUMB_BOOK5, PPT_5, LINK_DL, "Dự án STEM ứng dụng"),
        item("Slide Bài giảng lớp 5 - Bài 12", THUMB_BOOK5, PPT_5, LINK_DL, "Dự án STEM ứng dụng"),
        item("Slide Bài giảng lớp 5 - Bài 13", THUMB_BOOK5, PPT_5, LINK_DL, "Dự án STEM ứng dụng"),
        item("Slide Bài giảng lớp 5 - Bài 14", THUMB_BOOK5, PPT_5, LINK_DL, "Dự án STEM ứng dụng"),
        item("Slide Bài giảng lớp 5 - Bài 15", THUMB_BOOK5, PPT_5, LINK_DL, "Dự án STEM ứng dụng"),
    ]
};

const SPECIAL_DATA = {
    video_demo: [
        item("Video Ứng dụng Scratch", THUMB_VID, VIDEO_UNG_DUNG, LINK_DL, "Video ứng dụng thực tế"),
    ],
    robotics: [
        item("Dự án Robotics", THUMB_CODE, ROBOTICS, LINK_DL, "Lập trình Robotics cơ bản"),
    ]
};

const DATA = {
    '6-8': GRADE_3_DATA,
    '9-11': GRADE_4_DATA,
    '12-14': GRADE_5_DATA,
    'teacher': {}, // Will be populated dynamically below
    'others': SPECIAL_DATA
};

// =============================================================================
// LOGIC (KHÔNG SỬA)
// =============================================================================

export const resources: ResourceItem[] = [];

const add = (cat: AgeCategory, type: ResourceType, cfg: ItemConfig, idx: number, gr?: GradeLevel) => {
    let grade: GradeLevel | undefined = gr;
    if (!grade) {
        if (cat === '6-8') grade = '3';
        else if (cat === '9-11') grade = '4';
        else if (cat === '12-14') grade = '5';
        else if (cat === 'teacher' || cat === 'others') grade = '3';
    }

    resources.push({
        id: `${cat}-${type}-${idx}-${grade || '3'}`, // Added grade to ID to stay unique
        title: cfg.title,
        description: cfg.description || `Tài liệu ${cfg.title}`,
        thumbnail: cfg.thumb,
        previewUrl: cfg.preview,
        downloadUrl: cfg.download,
        type: type,
        category: cat,
        grade: grade,
    });
}

// Build standard categories
(['6-8', '9-11', '12-14', 'others'] as AgeCategory[]).forEach(cat => {
    const d = DATA[cat as keyof typeof DATA];
    if (d) {
        (['books', 'code', 'videos', 'ppt', 'video_demo', 'robotics'] as ResourceType[]).forEach(t => {
            // @ts-ignore
            if (d[t]) d[t].forEach((item, i) => add(cat, t, item, i));
        });
    }
});

// Build Teacher category explicitly to preserve grades
(['books', 'code', 'videos', 'ppt'] as ResourceType[]).forEach(type => {
    // @ts-ignore
    if (GRADE_3_DATA[type]) GRADE_3_DATA[type].forEach((item, i) => add('teacher', type, item, i, '3'));
    // @ts-ignore
    if (GRADE_4_DATA[type]) GRADE_4_DATA[type].forEach((item, i) => add('teacher', type, item, i, '4'));
    // @ts-ignore
    if (GRADE_5_DATA[type]) GRADE_5_DATA[type].forEach((item, i) => add('teacher', type, item, i, '5'));
});

export const categoryLabels: Record<string, string> = {
    '6-8': 'Lớp 3', '9-11': 'Lớp 4', '12-14': 'Lớp 5', 'teacher': 'Giáo viên',
};
export const typeLabels: Record<string, string> = {
    'books': 'Tài liệu', 'code': 'Code mẫu', 'videos': 'Video kết quả', 'ppt': 'PowerPoint bài giảng',
    'video_demo': 'Video ứng dụng', 'robotics': 'Robotics'
};
