<template>
    <div class="detail-container" v-if="doctor">
        <AppHeader />

        <div class="container">
            <nav class="breadcrumb">
            </nav>

            <div class="doctor-header-card">
                <div class="doc-main-info">
                    <div class="doc-avatar-large">
                        <img :src="doctor.AvatarUrl" :alt="doctor.FullName" />
                    </div>
                    <div class="doc-text">
                        <span class="badge">{{ translatePosition(doctor.Position) }}</span>
                        <h1>{{ doctor.FullName }}</h1>
                        <p class="doc-intro">{{ doctor.Description }}</p>
                        <div class="doc-stats">
                            <div class="stat-item">
                                <strong>{{ doctor.ExperienceYears }}+</strong>
                                <span>Năm kinh nghiệm</span>
                            </div>
                            <div class="stat-item">
                                <strong>1000+</strong>
                                <span>Bệnh nhân</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="detail-grid">
                <div class="main-column">
                    <section class="info-section">
                        <h2>Giới thiệu bác sĩ</h2>
                        <div class="biography-content" v-html="doctor.DetailedBiography"></div>
                    </section>

                    <section class="info-section">
                        <h2>Quá trình công tác</h2>
                        <div class="history-list">
                            <div v-for="(job, i) in doctor.WorkingHistory.split(';')" :key="i" class="history-item">
                                {{ job.trim() }}
                            </div>
                        </div>
                    </section>

                    <section class="info-section">
                        <h2>Chuyên khoa đảm nhiệm</h2>
                        <div class="specialty-tag">{{ getSpecialtyName(doctor.SpecialtyId) }}</div>
                    </section>
                </div>

                <div class="sidebar-column">
                    <div class="booking-widget">
                        <h3>Lịch khám & Giá dịch vụ</h3>
                        <div class="service-info" v-if="relatedService">
                            <p class="service-name">{{ relatedService.Name }}</p>
                            <p class="service-price">{{ formatPrice(relatedService.Price) }}</p>
                            <p class="service-note">*Giá đã bao gồm phí khám lâm sàng</p>
                        </div>
                        <button class="btn-book-now" @click="goToBooking">ĐẶT LỊCH KHÁM NGAY</button>
                        <p class="booking-tip">Hỗ trợ đặt lịch nhanh qua hotline: <strong>1900 1234</strong></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-else class="not-found">
        <p>Không tìm thấy thông tin bác sĩ.</p>
        <button @click="$router.push('/')">Quay lại</button>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppHeader from '@/views/system/AppHeader.vue'

const route = useRoute()
const router = useRouter()
const doctor = ref(null)
const relatedService = ref(null)

const doctorsData = [
    {
        "Id": "33333333-1111-1111-1111-111111111111",
        "SpecialtyId": "11111111-1111-1111-1111-111111111101",
        "ServiceId": "22222222-3333-3333-3333-111111111101",
        "AvatarUrl": "https://storage.googleapis.com/bookingcare-resources/static/doctor/Nam_BacSi_2.jpg",
        "FullName": "Nguyễn Trọng Hưng",
        "ExperienceYears": 25,
        "Position": "AssociateProfessor",
        "WorkingHistory": "Bệnh viện Bạch Mai (2000-2015); Bệnh viện Đại học Y Hà Nội (2015-Nay)",
        "Description": "Chuyên gia hàng đầu về các bệnh lý Cơ xương khớp. Nguyên Trưởng khoa Cơ xương khớp Bệnh viện Bạch Mai.",
        "DetailedBiography": `
        <p>Phó Giáo sư, Tiến sĩ, Bác sĩ <strong>Nguyễn Trọng Hưng</strong> là một trong những chuyên gia đầu ngành tại Việt Nam trong lĩnh vực Nội Cơ xương khớp. Với hơn 25 năm cống hiến, bác sĩ đã thăm khám và điều trị thành công cho hàng chục ngàn bệnh nhân mắc các bệnh lý xương khớp từ cơ bản đến phức tạp.</p>
        <p>Bên cạnh công tác khám chữa bệnh, ông còn là Giảng viên cao cấp tại Đại học Y Hà Nội, trực tiếp tham gia đào tạo nhiều thế hệ bác sĩ trẻ và đóng góp nhiều công trình nghiên cứu khoa học có giá trị cao.</p>
        <p><strong>Thế mạnh chuyên môn:</strong></p>
        <ul>
            <li>Khám, tư vấn và điều trị chuyên sâu các bệnh lý thoái hóa khớp, viêm khớp dạng thấp, gout.</li>
            <li>Điều trị các bệnh lý cột sống: thoái hóa cột sống cổ, thắt lưng, thoát vị đĩa đệm.</li>
            <li>Thực hiện an toàn các thủ thuật lâm sàng: tiêm chất nhờn khớp, hút dịch khớp, tiêm điểm bám gân.</li>
        </ul>
      `
    },
    {
        "Id": "33333333-2222-2222-2222-222222222222",
        "SpecialtyId": "11111111-1111-1111-1111-111111111102",
        "ServiceId": "22222222-3333-3333-3333-111111111102",
        "AvatarUrl": "https://storage.googleapis.com/bookingcare-resources/static/doctor/Nu_BacSi_1.jpg",
        "FullName": "Đỗ Thị Tường Vân",
        "ExperienceYears": 18,
        "Position": "Master",
        "WorkingHistory": "Bệnh viện Việt Đức (2006-Nay)",
        "Description": "Có nhiều năm kinh nghiệm trong lĩnh vực nội soi tiêu hóa không đau. Đã tu nghiệp chuyên sâu tại Nhật Bản.",
        "DetailedBiography": `
        <p>Thạc sĩ, Bác sĩ <strong>Đỗ Thị Tường Vân</strong> là bác sĩ chuyên khoa Nội Tiêu hóa - Gan mật với hơn 18 năm kinh nghiệm thực tiễn. Bác sĩ nổi tiếng với sự tận tâm, chu đáo và khả năng chẩn đoán hình ảnh nội soi chính xác.</p>
        <p>Bác sĩ Tường Vân từng có 3 năm tu nghiệp chuyên sâu về nội soi can thiệp đường tiêu hóa tại Bệnh viện Đại học Tokyo (Nhật Bản). Kể từ khi về nước, bác sĩ luôn ứng dụng các công nghệ tiên tiến nhất để mang lại trải nghiệm khám chữa bệnh nhẹ nhàng cho người bệnh.</p>
        <p><strong>Thế mạnh chuyên môn:</strong></p>
        <ul>
            <li>Thực hiện Nội soi dạ dày, đại tràng công nghệ NBI gây mê (không đau, không khó chịu).</li>
            <li>Tầm soát và phát hiện sớm ung thư thực quản, dạ dày, đại trực tràng.</li>
            <li>Khám và điều trị viêm loét dạ dày nhiễm vi khuẩn HP, trào ngược dạ dày thực quản (GERD).</li>
            <li>Can thiệp cắt polyp ống tiêu hóa qua nội soi an toàn.</li>
        </ul>
      `
    },
    {
        "Id": "33333333-3333-3333-3333-333333333333",
        "SpecialtyId": "11111111-1111-1111-1111-111111111103",
        "ServiceId": "22222222-3333-3333-3333-111111111103",
        "AvatarUrl": "https://storage.googleapis.com/bookingcare-resources/static/doctor/Nam_BacSi_3.jpg",
        "FullName": "Lê Ngọc Thành",
        "ExperienceYears": 20,
        "Position": "DoctorOfPhilosophy",
        "WorkingHistory": "Bệnh viện Tim Hà Nội (2005-Nay)",
        "Description": "Bác sĩ chuyên khoa sâu về can thiệp tim mạch và điều trị các bệnh lý tăng huyết áp, suy tim.",
        "DetailedBiography": `
        <p>Tiến sĩ, Bác sĩ <strong>Lê Ngọc Thành</strong> hiện là một trong những chuyên gia uy tín trong lĩnh vực chẩn đoán và điều trị các bệnh lý Tim mạch. Với 20 năm công tác tại Bệnh viện Tim Hà Nội, bác sĩ đã cứu sống vô số ca bệnh hiểm nghèo liên quan đến nhồi máu cơ tim và suy tim cấp.</p>
        <p>Phong cách làm việc khoa học, tỉ mỉ cùng y đức trong sáng giúp Tiến sĩ Lê Ngọc Thành luôn nhận được sự tin yêu tuyệt đối từ phía bệnh nhân và người nhà.</p>
        <p><strong>Thế mạnh chuyên môn:</strong></p>
        <ul>
            <li>Tầm soát, chẩn đoán sớm và điều trị các bệnh lý mạch vành, thiếu máu cơ tim.</li>
            <li>Điều trị chuyên sâu cao huyết áp, rối loạn nhịp tim và rối loạn mỡ máu.</li>
            <li>Siêu âm tim Doppler màu, đọc và phân tích điện tâm đồ phức tạp.</li>
            <li>Tư vấn phác đồ điều trị sau can thiệp đặt stent mạch vành.</li>
        </ul>
      `
    }
];

const specialtiesData = [
    { "Id": "11111111-1111-1111-1111-111111111101", "Name": "Cơ Xương Khớp" },
    { "Id": "11111111-1111-1111-1111-111111111102", "Name": "Tiêu hóa" },
    { "Id": "11111111-1111-1111-1111-111111111103", "Name": "Tim mạch" }
];

const servicesData = [
    { "Id": "22222222-3333-3333-3333-111111111101", "Name": "Tiêm chất nhờn khớp gối (Hyaluronic Acid)", "Price": 1500000 },
    { "Id": "22222222-3333-3333-3333-111111111102", "Name": "Gói Nội soi kép Dạ dày - Đại tràng Gây mê", "Price": 2800000 },
    { "Id": "22222222-3333-3333-3333-111111111103", "Name": "Siêu âm tim Doppler màu chuyên sâu", "Price": 600000 }
];

onMounted(() => {
    const id = route.params.id;
    doctor.value = doctorsData.find(d => d.Id === id);
    if (doctor.value) {
        relatedService.value = servicesData.find(s => s.Id === doctor.value.ServiceId);
    }
});

const getSpecialtyName = (id) => specialtiesData.find(s => s.Id === id)?.Name || 'Đa khoa';
const translatePosition = (pos) => ({ 'AssociateProfessor': 'Phó Giáo sư', 'DoctorOfPhilosophy': 'Tiến sĩ', 'Master': 'Thạc sĩ', 'Professor': 'Giáo sư' }[pos] || 'Bác sĩ');
const formatPrice = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);
const goToBooking = () => router.push({ path: '/booking', query: { doctorId: doctor.value.Id } });
</script>

<style scoped>
.detail-container {
    background: #f8fafc;
    min-height: 100vh;
    padding-bottom: 40px;
}

.container {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 20px;
}

.breadcrumb {
    margin-bottom: 30px;
    font-size: 14px;
    color: #64748b;
}

.breadcrumb span {
    cursor: pointer;
    transition: color 0.2s;
}

.breadcrumb span:hover {
    color: #45C3D2;
}

.breadcrumb .active {
    color: #45C3D2;
    font-weight: 600;
    cursor: default;
}

.doctor-header-card {
    background: #fff;
    border-radius: 24px;
    padding: 40px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
    margin-bottom: 30px;
}

.doc-main-info {
    display: flex;
    gap: 40px;
    align-items: center;
}

.doc-avatar-large {
    width: 220px;
    height: 220px;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    flex-shrink: 0;
}

.doc-avatar-large img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.badge {
    background: rgba(69, 195, 210, 0.1);
    color: #45C3D2;
    padding: 6px 16px;
    border-radius: 50px;
    font-weight: 700;
    font-size: 13px;
    text-transform: uppercase;
}

.doc-text h1 {
    font-size: 32px;
    margin: 15px 0;
    color: #1e293b;
}

.doc-intro {
    color: #475569;
    line-height: 1.6;
    font-size: 16px;
    margin-bottom: 25px;
}

.doc-stats {
    display: flex;
    gap: 40px;
}

.stat-item strong {
    display: block;
    font-size: 24px;
    color: #45C3D2;
}

.stat-item span {
    font-size: 13px;
    color: #94a3b8;
}

.detail-grid {
    display: grid;
    grid-template-columns: 1fr 350px;
    gap: 30px;
}

.info-section {
    background: #fff;
    padding: 35px;
    border-radius: 20px;
    margin-bottom: 25px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
}

.info-section h2 {
    font-size: 20px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
    color: #0f172a;
    border-bottom: 1px solid #f1f5f9;
    padding-bottom: 15px;
}

:deep(.biography-content) {
    color: #334155;
    line-height: 1.7;
    font-size: 15.5px;
}

:deep(.biography-content p) {
    margin-bottom: 15px;
}

:deep(.biography-content ul) {
    margin-left: 20px;
    margin-bottom: 15px;
}

:deep(.biography-content li) {
    margin-bottom: 8px;
    position: relative;
}

:deep(.biography-content li::marker) {
    color: #45C3D2;
}

:deep(.biography-content strong) {
    color: #1e293b;
}

.history-item {
    padding: 12px 0;
    border-bottom: 1px dashed #e2e8f0;
    color: #334155;
    position: relative;
    padding-left: 20px;
}

.history-item::before {
    content: "•";
    position: absolute;
    left: 0;
    color: #45C3D2;
    font-weight: bold;
}

.history-item:last-child {
    border-bottom: none;
}

.specialty-tag {
    display: inline-block;
    padding: 10px 24px;
    background: #f1f5f9;
    border-radius: 10px;
    font-weight: 600;
    color: #475569;
}

.booking-widget {
    background: #fff;
    padding: 30px;
    border-radius: 24px;
    position: sticky;
    top: 20px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
}

.booking-widget h3 {
    font-size: 18px;
    text-align: center;
    margin-bottom: 10px;
    color: #0f172a;
}

.service-info {
    margin: 20px 0;
    padding: 25px 20px;
    background: #f8fafc;
    border-radius: 15px;
    text-align: center;
    border: 1px dashed #cbd5e1;
}

.service-name {
    font-weight: 600;
    margin-bottom: 15px;
    font-size: 15px;
    color: #334155;
    line-height: 1.5;
}

.service-price {
    font-size: 26px;
    font-weight: 800;
    color: #f59e0b;
    margin-bottom: 10px;
}

.service-note {
    font-size: 12px;
    color: #94a3b8;
    font-style: italic;
}

.btn-book-now {
    font-family: 'Inter', sans-serif;
    width: 100%;
    background: #45C3D2;
    color: #fff;
    border: none;
    padding: 18px;
    border-radius: 15px;
    font-weight: 800;
    font-size: 16px;
    cursor: pointer;
    transition: 0.3s;
    box-shadow: 0 10px 20px rgba(69, 195, 210, 0.2);
}

.btn-book-now:hover {
    background: #3ba3b0;
    transform: translateY(-3px);
    box-shadow: 0 15px 25px rgba(69, 195, 210, 0.3);
}

.booking-tip {
    margin-top: 20px;
    font-size: 14px;
    color: #64748b;
    text-align: center;
}

@media (max-width: 900px) {
    .detail-grid {
        grid-template-columns: 1fr;
    }

    .doc-main-info {
        flex-direction: column;
        text-align: center;
    }

    .doc-stats {
        justify-content: center;
    }

    .booking-widget {
        position: static;
    }
}
</style>