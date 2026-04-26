<template>
    <div class="home-container">
        <AppHeader />

        <section class="hero-section">
            <div class="container hero-content slide-up-1">
                <h1 class="hero-title">
                    Nền tảng y tế<br /> <span class="highlight">Chăm sóc sức khỏe toàn diện</span>
                </h1>
                <p class="hero-subtitle">Đặt lịch khám với chuyên gia, bác sĩ hàng đầu nhanh chóng và bảo mật.</p>

                <div class="search-wrapper">
                    <div class="search-box">
                        <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <input type="text" placeholder="Tìm bác sĩ, chuyên khoa..." v-model="searchQuery" />
                        <button class="btn-search">Tìm kiếm</button>
                    </div>

                    <div class="search-dropdown" v-if="searchQuery && searchResults.length > 0">
                        <div class="search-item" v-for="item in searchResults" :key="item.Id"
                            @click="goToDetail(item.type, item.Id)">
                            <div class="search-item-img">
                                <img :src="item.ImageUrl || item.AvatarUrl" alt="" />
                            </div>
                            <div class="search-item-info">
                                <h4>{{ item.Name || item.FullName }}</h4>
                                <span>{{ item.type === 'doctor' ? 'Bác sĩ' : 'Chuyên khoa' }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="highlight-section bg-light">
            <div class="container slide-up-2">
                <div class="section-header">
                    <h2>Chuyên khoa phổ biến</h2>
                    <a href="#" class="view-all">Xem tất cả <span class="arrow">→</span></a>
                </div>

                <div class="slider-container">
                    <button class="slider-btn left" @click="scrollList('specialtyList', 'left')">‹</button>
                    <div class="item-list" ref="specialtyList">
                        <div class="specialty-card 3d-hover" v-for="spec in specialtiesData" :key="spec.Id"
                            @click="goToDetail('specialty', spec.Id)">
                            <div class="card-img">
                                <img :src="spec.ImageUrl" :alt="spec.Name" />
                            </div>
                            <h3 class="card-title">{{ spec.Name }}</h3>
                            <p class="card-desc">{{ spec.Description }}</p>
                        </div>
                    </div>
                    <button class="slider-btn right" @click="scrollList('specialtyList', 'right')">›</button>
                </div>
            </div>
        </section>

        <section class="highlight-section bg-light">
            <div class="container slide-up-4">
                <div class="section-header">
                    <h2>Dịch vụ y tế nổi bật</h2>
                    <a href="#" class="view-all">Xem tất cả <span class="arrow">→</span></a>
                </div>

                <div class="slider-container">
                    <button class="slider-btn left" @click="scrollList('serviceList', 'left')">‹</button>
                    <div class="item-list" ref="serviceList">
                        <div class="service-card 3d-hover" v-for="srv in servicesData" :key="srv.Id">
                            <div class="srv-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                                </svg>
                            </div>
                            <h3 class="srv-name">{{ srv.Name }}</h3>
                            <p class="srv-desc">{{ srv.Description }}</p>
                            <div class="srv-footer">
                                <span class="srv-price">{{ formatPrice(srv.Price) }}</span>
                                <span class="srv-time">{{ srv.DurationInMinutes }} phút</span>
                            </div>
                        </div>
                    </div>
                    <button class="slider-btn right" @click="scrollList('serviceList', 'right')">›</button>
                </div>
            </div>
        </section>

        <section class="highlight-section">
            <div class="container slide-up-3">
                <div class="section-header">
                    <h2>Bác sĩ nổi bật tuần qua</h2>
                    <a href="#" class="view-all">Xem tất cả <span class="arrow">→</span></a>
                </div>

                <div class="slider-container">
                    <button class="slider-btn left" @click="scrollList('doctorList', 'left')">‹</button>
                    <div class="item-list" ref="doctorList">
                        <div class="doctor-card 3d-hover" v-for="doc in doctorsData" :key="doc.Id"
                            @click="goToDetail('doctor', doc.Id)">
                            <div class="doc-avatar">
                                <img :src="doc.AvatarUrl" :alt="doc.FullName" />
                            </div>
                            <div class="doc-info">
                                <span class="doc-position">{{ translatePosition(doc.Position) }}</span>
                                <h3 class="doc-name">{{ doc.FullName }}</h3>
                                <span class="doc-specialty">{{ getSpecialtyName(doc.SpecialtyId) }}</span>
                                <button class="btn-book" @click.stop="goToBooking(doc.Id)">Đặt lịch khám</button>
                            </div>
                        </div>
                    </div>
                    <button class="slider-btn right" @click="scrollList('doctorList', 'right')">›</button>
                </div>
            </div>
        </section>

        <section class="highlight-section bg-light">
            <div class="container slide-up-4">
                <div class="section-header">
                    <h2>Cẩm nang sức khỏe & Tin tức</h2>
                    <a href="#" class="view-all">Xem tất cả bài viết <span class="arrow">→</span></a>
                </div>
                <div class="news-grid">
                    <div class="news-card" v-for="(news, index) in newsData" :key="index">
                        <div class="news-img">
                            <img :src="news.image" :alt="news.title" />
                            <span class="news-category">{{ news.category }}</span>
                        </div>
                        <div class="news-content">
                            <h3 class="news-title">{{ news.title }}</h3>
                            <p class="news-excerpt">{{ news.excerpt }}</p>
                            <div class="news-footer">
                                <span class="news-date">{{ news.date }}</span>
                                <a href="#" class="read-more">Đọc tiếp</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <footer class="footer">
            <div class="container">
                <p>&copy; 2026 Nền tảng y tế BookingCare. All rights reserved.</p>
            </div>
        </footer>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '@/views/system/AppHeader.vue'

const router = useRouter()

const searchQuery = ref('')
const specialtyList = ref(null)
const doctorList = ref(null)
const serviceList = ref(null)

const specialtiesData = [
    { "Id": "11111111-1111-1111-1111-111111111101", "Name": "Cơ Xương Khớp", "ImageUrl": "https://storage.googleapis.com/bookingcare-resources/static/specialty/CoXuongKhop.png", "Description": "Khám và điều trị các bệnh lý về hệ vận động, xương khớp." },
    { "Id": "11111111-1111-1111-1111-111111111102", "Name": "Tiêu hóa", "ImageUrl": "https://storage.googleapis.com/bookingcare-resources/static/specialty/TieuHoa.png", "Description": "Chuyên khoa dạ dày, đại tràng, gan mật và nội soi tiêu hóa." },
    { "Id": "11111111-1111-1111-1111-111111111103", "Name": "Tim mạch", "ImageUrl": "https://storage.googleapis.com/bookingcare-resources/static/specialty/TimMach.png", "Description": "Điều trị cao huyết áp, suy tim và các bệnh lý mạch vành." },
    { "Id": "11111111-1111-1111-1111-111111111104", "Name": "Sản Phụ khoa", "ImageUrl": "https://storage.googleapis.com/bookingcare-resources/static/specialty/SanPhuKhoa.png", "Description": "Chăm sóc thai kỳ, sinh sản và các bệnh lý phụ khoa." },
    { "Id": "11111111-1111-1111-1111-111111111105", "Name": "Nhi khoa", "ImageUrl": "https://storage.googleapis.com/bookingcare-resources/static/specialty/NhiKhoa.png", "Description": "Khám và điều trị các bệnh lý thường gặp ở trẻ sơ sinh và trẻ nhỏ." }
]

const doctorsData = [
    { "Id": "33333333-1111-1111-1111-111111111111", "SpecialtyId": "11111111-1111-1111-1111-111111111101", "AvatarUrl": "https://storage.googleapis.com/bookingcare-resources/static/doctor/Nam_BacSi_2.jpg", "FullName": "Nguyễn Trọng Hưng", "Position": "AssociateProfessor", "Description": "Chuyên gia hàng đầu về Cơ xương khớp." },
    { "Id": "33333333-2222-2222-2222-222222222222", "SpecialtyId": "11111111-1111-1111-1111-111111111102", "AvatarUrl": "https://storage.googleapis.com/bookingcare-resources/static/doctor/Nu_BacSi_1.jpg", "FullName": "Đỗ Thị Tường Vân", "Position": "Master", "Description": "Kinh nghiệm nội soi tiêu hóa không đau." },
    { "Id": "33333333-3333-3333-3333-333333333333", "SpecialtyId": "11111111-1111-1111-1111-111111111103", "AvatarUrl": "https://storage.googleapis.com/bookingcare-resources/static/doctor/Nam_BacSi_3.jpg", "FullName": "Lê Ngọc Thành", "Position": "DoctorOfPhilosophy", "Description": "Bác sĩ chuyên khoa sâu về can thiệp tim mạch." },
    { "Id": "33333333-5555-5555-5555-555555555555", "SpecialtyId": "11111111-1111-1111-1111-111111111105", "AvatarUrl": "https://storage.googleapis.com/bookingcare-resources/static/doctor/Nam_BacSi_4.jpg", "FullName": "Phạm Nhật An", "Position": "Professor", "Description": "Chuyên gia đầu ngành Nhi khoa." },
    { "Id": "33333333-6666-6666-6666-666666666666", "SpecialtyId": "11111111-1111-1111-1111-111111111106", "AvatarUrl": "https://storage.googleapis.com/bookingcare-resources/static/doctor/Nam_BacSi_5.jpg", "FullName": "Vũ Nguyệt Minh", "Position": "Master", "Description": "Chuyên gia da liễu thẩm mỹ." }
]

const servicesData = [
    { "Id": "22222222-3333-3333-3333-111111111101", "Name": "Tiêm chất nhờn khớp gối", "Price": 1500000, "DurationInMinutes": 30, "Description": "Bao gồm thuốc tiêm chính hãng, giúp bôi trơn và giảm đau khớp gối." },
    { "Id": "22222222-3333-3333-3333-111111111102", "Name": "Nội soi kép Dạ dày - Đại tràng", "Price": 2800000, "DurationInMinutes": 60, "Description": "Nội soi không đau, an toàn, có test vi khuẩn HP." },
    { "Id": "22222222-3333-3333-3333-111111111103", "Name": "Siêu âm tim Doppler màu", "Price": 600000, "DurationInMinutes": 30, "Description": "Đánh giá cấu trúc, chức năng tim và vận tốc dòng máu." },
    { "Id": "22222222-3333-3333-3333-111111111104", "Name": "Siêu âm thai 5D tầm soát", "Price": 650000, "DurationInMinutes": 30, "Description": "Siêu âm hình thái học thai nhi công nghệ 5D sắc nét." },
    { "Id": "22222222-3333-3333-3333-111111111110", "Name": "Nhổ răng khôn Piezotome", "Price": 2500000, "DurationInMinutes": 60, "Description": "Nhổ răng bằng sóng siêu âm không sưng, ít chảy máu." }
]

const newsData = [
    {
        title: "7 dấu hiệu cảnh báo vấn đề về xương khớp ở người trẻ",
        category: "Sống khỏe",
        excerpt: "Không chỉ người già, thoái hóa khớp đang ngày càng trẻ hóa do thói quen sinh hoạt và ngồi văn phòng sai tư thế...",
        date: "25/04/2026",
        image: "https://images.unsplash.com/photo-1597589827317-4c6d6e0a90bd?q=80&w=500"
    },
    {
        title: "Chế độ ăn uống tốt cho hệ tiêu hóa trong mùa hè",
        category: "Dinh dưỡng",
        excerpt: "Bổ sung lợi khuẩn và các loại rau xanh giải nhiệt giúp hệ tiêu hóa hoạt động trơn tru, tránh ngộ độc thực phẩm...",
        date: "23/04/2026",
        image: "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?q=80&w=500"
    },
    {
        title: "Tầm soát tim mạch định kỳ: Bước ngoặt bảo vệ sự sống",
        category: "Y khoa",
        excerpt: "Khám tầm soát giúp phát hiện sớm các nguy cơ đột quỵ và suy tim vốn phát triển âm thầm không triệu chứng...",
        date: "20/04/2026",
        image: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?q=80&w=500"
    }
];

// --- Computed & Functions ---
const searchResults = computed(() => {
    if (!searchQuery.value) return [];
    const q = searchQuery.value.toLowerCase();

    const docs = doctorsData
        .filter(d => d.FullName.toLowerCase().includes(q))
        .map(d => ({ ...d, type: 'doctor' }));

    const specs = specialtiesData
        .filter(s => s.Name.toLowerCase().includes(q))
        .map(s => ({ ...s, type: 'specialty' }));

    return [...docs, ...specs].slice(0, 5);
})

const scrollList = (listName, direction) => {
    let el = null;
    if (listName === 'specialtyList') el = specialtyList.value;
    else if (listName === 'doctorList') el = doctorList.value;
    else if (listName === 'serviceList') el = serviceList.value;

    if (el) {
        const scrollAmount = 350;
        el.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
}

const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
}

const goToDetail = (type, id) => {
    router.push({ path: `/detail/${type}/${id}` })
}

const goToBooking = (doctorId) => {
    router.push({ path: '/booking', query: { doctorId } })
}

const getSpecialtyName = (id) => {
    const spec = specialtiesData.find(s => s.Id === id)
    return spec ? spec.Name : 'Đa khoa'
}

const translatePosition = (pos) => {
    const dict = { 'Professor': 'Giáo sư', 'AssociateProfessor': 'Phó Giáo sư', 'DoctorOfPhilosophy': 'Tiến sĩ', 'Master': 'Thạc sĩ', 'Doctor': 'Bác sĩ' }
    return dict[pos] || 'Bác sĩ'
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

.home-container {
    --primary-color: #45C3D2;
    --primary-hover: #3ba3b0;
    --bg-white: #ffffff;
    --bg-light: #f3f6f9;
    --text-dark: #1f2937;
    --text-gray: #6b7280;
    --border-color: #e5e7eb;
    font-family: 'Inter', -apple-system, sans-serif;
    color: var(--text-dark);
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.hero-section {
    padding: 100px 0 80px;
    text-align: center;
    background: linear-gradient(180deg, #e0f7fa 0%, #ffffff 100%);
    position: relative;
    z-index: 10;
}

.hero-title {
    font-size: 42px;
    font-weight: 800;
    margin-bottom: 20px;
    line-height: 1.3;
}

.highlight {
    color: var(--primary-color);
}

.hero-subtitle {
    font-size: 18px;
    color: var(--text-gray);
    margin-bottom: 40px;
}

.search-wrapper {
    position: relative;
    max-width: 700px;
    margin: 0 auto;
}

.search-box {
    display: flex;
    align-items: center;
    background: var(--bg-white);
    border: 1px solid var(--border-color);
    border-radius: 50px;
    padding: 8px 8px 8px 24px;
    box-shadow: 0 10px 30px rgba(69, 195, 210, 0.1);
}

.search-icon {
    width: 22px;
    height: 22px;
    color: #9ca3af;
}

.search-box input {
    flex: 1;
    border: none;
    outline: none;
    padding: 12px 15px;
    font-size: 16px;
    background: transparent;
}

.btn-search {
    background-color: var(--primary-color);
    color: #fff;
    border: none;
    padding: 12px 30px;
    border-radius: 40px;
    font-weight: 600;
    font-size: 16px;
    cursor: pointer;
    transition: background 0.3s;
}

.btn-search:hover {
    background-color: var(--primary-hover);
}

.search-dropdown {
    position: absolute;
    top: 110%;
    left: 0;
    right: 0;
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    border: 1px solid var(--border-color);
    overflow: hidden;
    z-index: 1000;
    text-align: left;
}

.search-item {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px 20px;
    border-bottom: 1px solid #f3f4f6;
    cursor: pointer;
    transition: background 0.2s;
}

.search-item:hover {
    background: #f9fafb;
}

.search-item-img {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    background: #f3f4f6;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.search-item-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.search-item-info h4 {
    margin: 0 0 5px;
    font-size: 15px;
    font-weight: 600;
}

.search-item-info span {
    font-size: 12px;
    color: var(--primary-color);
    background: rgba(69, 195, 210, 0.1);
    padding: 2px 8px;
    border-radius: 10px;
}

.highlight-section {
    padding: 80px 0;
    isolation: isolate;
}

.bg-light {
    background-color: var(--bg-light);
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 30px;
}

.section-header h2 {
    font-size: 28px;
    font-weight: 800;
    margin: 0;
}

.view-all {
    color: var(--primary-color);
    text-decoration: none;
    font-weight: 600;
    display: flex;
    gap: 5px;
}

.slider-container {
    position: relative;
    display: flex;
    align-items: center;
}

.slider-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 40px;
    height: 40px;
    background: #fff;
    border: 1px solid var(--border-color);
    border-radius: 50%;
    font-size: 24px;
    color: var(--text-dark);
    cursor: pointer;
    z-index: 10;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    transition: all 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
}

.slider-btn:hover {
    background: var(--primary-color);
    color: #fff;
    border-color: var(--primary-color);
}

.slider-btn.left {
    left: -20px;
}

.slider-btn.right {
    right: -20px;
}

.item-list {
    display: flex;
    gap: 20px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    padding: 20px 0;
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.item-list::-webkit-scrollbar {
    display: none;
}

.specialty-card {
    min-width: 280px;
    scroll-snap-align: start;
    background: var(--bg-white);
    border-radius: 16px;
    border: 1px solid var(--border-color);
    text-align: center;
    padding-bottom: 25px;
    cursor: pointer;
    transition: all 0.3s;
}

.specialty-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(69, 195, 210, 0.1);
    border-color: var(--primary-color);
}

.specialty-card .card-img {
    height: 160px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #f3f4f6;
}

.specialty-card .card-img img {
    width: 65%;
    height: 65%;
    object-fit: contain;
}

.specialty-card .card-title {
    font-size: 18px;
    font-weight: 700;
    margin: 20px 0 10px;
}

.specialty-card .card-desc {
    font-size: 14px;
    color: var(--text-gray);
    padding: 0 15px;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.doctor-card {
    min-width: 280px;
    scroll-snap-align: start;
    background: var(--bg-white);
    border-radius: 16px;
    padding: 25px 20px;
    text-align: center;
    border: 1px solid var(--border-color);
    cursor: pointer;
    transition: all 0.3s;
}

.doctor-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(69, 195, 210, 0.1);
    border-color: var(--primary-color);
}

.doc-avatar {
    width: 100px;
    height: 100px;
    margin: 0 auto 15px;
    border-radius: 50%;
    padding: 3px;
    background: linear-gradient(45deg, var(--primary-color), #2563eb);
}

.doc-avatar img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #fff;
}

.doc-position {
    font-size: 12px;
    font-weight: 600;
    color: var(--primary-color);
    text-transform: uppercase;
}

.doc-name {
    font-size: 18px;
    font-weight: 700;
    margin: 5px 0;
}

.doc-specialty {
    display: block;
    font-size: 13px;
    color: var(--text-gray);
    margin-bottom: 20px;
}

.btn-book {
    width: 100%;
    padding: 12px;
    border-radius: 10px;
    background: rgba(69, 195, 210, 0.1);
    color: var(--primary-color);
    border: none;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.3s;
}

.btn-book:hover {
    background: var(--primary-color);
    color: #fff;
}

.footer {
    text-align: center;
    padding: 30px 0;
    font-size: 14px;
    color: var(--text-gray);
}

.news-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 25px;
}

.news-card {
    background: #fff;
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid #e5e7eb;
    transition: 0.3s;
}

.news-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
}

.news-img {
    height: 180px;
    position: relative;
}

.news-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.news-category {
    position: absolute;
    top: 15px;
    left: 15px;
    background: var(--primary-color);
    color: #fff;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
}

.news-content {
    padding: 20px;
}

.news-title {
    font-size: 17px;
    font-weight: 700;
    margin-bottom: 10px;
    line-height: 1.4;
    color: #111827;
}

.news-excerpt {
    font-size: 14px;
    color: #6b7280;
    line-height: 1.6;
    margin-bottom: 20px;
    height: 67px;
    overflow: hidden;
}

.news-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #f3f4f6;
    padding-top: 15px;
}

.news-date {
    font-size: 13px;
    color: #9ca3af;
}

.read-more {
    color: var(--primary-color);
    text-decoration: none;
    font-weight: 600;
    font-size: 14px;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.slide-up-1 {
    animation: fadeInUp 0.6s ease forwards 0.1s;
    opacity: 0;
}

.slide-up-2 {
    animation: fadeInUp 0.6s ease forwards 0.2s;
    opacity: 0;
}

.slide-up-3 {
    animation: fadeInUp 0.6s ease forwards 0.3s;
    opacity: 0;
}

.service-card {
    min-width: 300px;
    scroll-snap-align: start;
    background: var(--bg-white);
    border-radius: 16px;
    padding: 25px;
    border: 1px solid var(--border-color);
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    flex-direction: column;
    text-align: left;
}

.service-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(69, 195, 210, 0.1);
    border-color: var(--primary-color);
}

.srv-icon {
    width: 45px;
    height: 45px;
    background: rgba(69, 195, 210, 0.1);
    color: var(--primary-color);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
}

.srv-icon svg {
    width: 24px;
    height: 24px;
}

.srv-name {
    font-size: 17px;
    font-weight: 700;
    margin: 0 0 10px;
    line-height: 1.4;
    color: #1f2937;
}

.srv-desc {
    font-size: 14px;
    color: var(--text-gray);
    flex-grow: 1;
    margin-bottom: 20px;
    line-height: 1.5;
}

.srv-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 15px;
    border-top: 1px dashed var(--border-color);
}

.srv-price {
    font-weight: 800;
    color: #f59e0b;
    font-size: 18px;
}

.srv-time {
    font-size: 13px;
    color: var(--text-gray);
    background: #f3f4f6;
    padding: 4px 12px;
    border-radius: 20px;
    font-weight: 500;
}
</style>