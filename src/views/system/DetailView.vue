<template>
    <div class="detail-container bg-light">
        <AppHeader />

        <section class="detail-main">
            <div class="container">
                <div class="content-grid">

                    <div class="main-column">

                        <div class="header-card box-style">
                            <div class="header-image" :class="{ 'is-service': pageType === 'service' }">
                                <img v-if="pageType === 'specialty'" :src="pageData.ImageUrl" :alt="pageData.Name" />
                                <div v-else class="srv-icon-large">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                                    </svg>
                                </div>
                            </div>
                            <div class="header-info">
                                <h1 class="title">{{ pageData.Name }}</h1>
                                <p class="short-desc">{{ pageData.ShortDescription }}</p>

                                <div class="service-meta" v-if="pageType === 'service'">
                                    <div class="meta-item">
                                        <span class="meta-label">Giá dịch vụ:</span>
                                        <span class="meta-value price">{{ formatPrice(pageData.Price) }}</span>
                                    </div>
                                    <div class="meta-item">
                                        <span class="meta-label">Thời gian thực hiện:</span>
                                        <span class="meta-value time">{{ pageData.DurationInMinutes }} phút</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="article-box box-style mt-30">
                            <h2 class="section-title">Thông tin chi tiết</h2>

                            <div class="rich-text" v-html="pageData.FullDescription"></div>

                            <div v-if="pageType === 'service'" class="process-section">
                                <h3>Quy trình thực hiện</h3>
                                <ul class="process-list">
                                    <li v-for="(step, index) in pageData.ProcessSteps" :key="index">
                                        <div class="step-number">{{ index + 1 }}</div>
                                        <div class="step-content">{{ step }}</div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div class="sidebar">
                        <div class="sticky-box box-style">
                            <h3 class="sidebar-title">Bác sĩ phụ trách</h3>
                            <p class="sidebar-subtitle">Chọn bác sĩ để đặt lịch khám nhanh chóng</p>

                            <div class="doctor-list">
                                <div class="doctor-item" v-for="doc in relatedDoctors" :key="doc.Id">
                                    <div class="doc-item-header">
                                        <img :src="doc.AvatarUrl" :alt="doc.FullName" class="doc-avt" />
                                        <div class="doc-basic-info">
                                            <span class="doc-pos">{{ translatePosition(doc.Position) }}</span>
                                            <h4 class="doc-name">{{ doc.FullName }}</h4>
                                        </div>
                                    </div>
                                    <div class="doc-schedule">
                                        <span class="schedule-title"><i class="far fa-calendar-alt"></i> Lịch khám sắp
                                            tới:</span>
                                        <div class="time-slots">
                                            <button class="time-slot" v-for="time in doc.AvailableTimes" :key="time"
                                                @click="goToBooking(doc.Id, time)">
                                                {{ time }}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button v-if="pageType === 'service'" class="btn-book-large"
                                @click="goToBooking(null, null)">
                                Đặt lịch dịch vụ này ngay
                            </button>
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
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppHeader from '@/views/system/AppHeader.vue'

const route = useRoute()
const router = useRouter()

const pageType = ref(route.params.type || 'specialty')
const detailId = ref(route.params.id)

const specialtiesList = [
    { "Id": "11111111-1111-1111-1111-111111111101", "SpecialtyCode": "CK-001", "Name": "Cơ Xương Khớp", "ImageUrl": "https://storage.googleapis.com/bookingcare-resources/static/specialty/CoXuongKhop.png", "Description": "Khám và điều trị các bệnh lý về hệ vận động, xương khớp." },
    { "Id": "11111111-1111-1111-1111-111111111102", "SpecialtyCode": "CK-002", "Name": "Tiêu hóa", "ImageUrl": "https://storage.googleapis.com/bookingcare-resources/static/specialty/TieuHoa.png", "Description": "Chuyên khoa dạ dày, đại tràng, gan mật và nội soi tiêu hóa." },
    { "Id": "11111111-1111-1111-1111-111111111103", "SpecialtyCode": "CK-003", "Name": "Tim mạch", "ImageUrl": "https://storage.googleapis.com/bookingcare-resources/static/specialty/TimMach.png", "Description": "Điều trị cao huyết áp, suy tim và các bệnh lý mạch vành." },
    { "Id": "11111111-1111-1111-1111-111111111104", "SpecialtyCode": "CK-004", "Name": "Sản Phụ khoa", "ImageUrl": "https://storage.googleapis.com/bookingcare-resources/static/specialty/SanPhuKhoa.png", "Description": "Chăm sóc thai kỳ, sinh sản và các bệnh lý phụ khoa nữ giới." },
    { "Id": "11111111-1111-1111-1111-111111111105", "SpecialtyCode": "CK-005", "Name": "Nhi khoa", "ImageUrl": "https://storage.googleapis.com/bookingcare-resources/static/specialty/NhiKhoa.png", "Description": "Khám và điều trị các bệnh lý thường gặp ở trẻ sơ sinh và trẻ nhỏ." },
    { "Id": "11111111-1111-1111-1111-111111111106", "SpecialtyCode": "CK-006", "Name": "Da liễu", "ImageUrl": "https://storage.googleapis.com/bookingcare-resources/static/specialty/DaLieu.png", "Description": "Điều trị mụn, nám, dị ứng da và thẩm mỹ công nghệ cao." },
    { "Id": "11111111-1111-1111-1111-111111111107", "SpecialtyCode": "CK-007", "Name": "Tai Mũi Họng", "ImageUrl": "https://storage.googleapis.com/bookingcare-resources/static/specialty/TaiMuiHong.png", "Description": "Khám và điều trị viêm xoang, viêm họng, các bệnh lý tai mũi họng." },
    { "Id": "11111111-1111-1111-1111-111111111108", "SpecialtyCode": "CK-008", "Name": "Mắt", "ImageUrl": "https://storage.googleapis.com/bookingcare-resources/static/specialty/Mat.png", "Description": "Khám mắt tổng quát, đo thị lực và điều trị tật khúc xạ." },
    { "Id": "11111111-1111-1111-1111-111111111109", "SpecialtyCode": "CK-009", "Name": "Thần kinh", "ImageUrl": "https://storage.googleapis.com/bookingcare-resources/static/specialty/ThanKinh.png", "Description": "Chẩn đoán rối loạn thần kinh, đau đầu, tiền đình và não bộ." },
    { "Id": "11111111-1111-1111-1111-111111111110", "SpecialtyCode": "CK-010", "Name": "Răng Hàm Mặt", "ImageUrl": "https://storage.googleapis.com/bookingcare-resources/static/specialty/RangHamMat.png", "Description": "Nha khoa tổng quát, nhổ răng khôn và thẩm mỹ răng sứ." }
];

const detailedContentMap = {
    "CK-001": `
        <p>Chuyên khoa <strong>Cơ Xương Khớp</strong> chuyên tiếp nhận khám, chẩn đoán và điều trị các bệnh lý liên quan đến hệ thống cơ, xương, khớp và dây chằng. Việc phát hiện sớm sẽ giúp hạn chế tối đa nguy cơ tàn phế và cải thiện chất lượng cuộc sống.</p>
        <h3>Các bệnh lý thường gặp:</h3>
        <ul>
            <li><strong>Bệnh lý về khớp:</strong> Thoái hóa khớp gối/háng, viêm khớp dạng thấp, viêm cột sống dính khớp, bệnh Gout (gút).</li>
            <li><strong>Bệnh lý cột sống:</strong> Thoát vị đĩa đệm, thoái hóa cột sống cổ, đau thần kinh tọa, vẹo cột sống.</li>
            <li><strong>Bệnh lý xương và cơ:</strong> Loãng xương, viêm gân, hội chứng ống cổ tay, đứt dây chằng chéo.</li>
        </ul>
        <h3>Trang thiết bị hỗ trợ chẩn đoán:</h3>
        <p>Cơ sở y tế được trang bị hệ thống chụp X-quang kỹ thuật số, Máy đo mật độ xương DEXA, và Máy cộng hưởng từ (MRI) 1.5 - 3.0 Tesla giúp phát hiện chính xác các tổn thương sụn khớp và dây chằng ẩn sâu.</p>
    `,
    "CK-002": `
        <p>Chuyên khoa <strong>Tiêu hóa - Gan Mật</strong> chuyên chẩn đoán và điều trị các bệnh lý đường tiêu hóa trên (thực quản, dạ dày), đường tiêu hóa dưới (đại trực tràng) và các bệnh lý về gan, mật, tụy.</p>
        <h3>Các dịch vụ và bệnh lý chuyên sâu:</h3>
        <ul>
            <li>Khám và điều trị trào ngược dạ dày thực quản (GERD), viêm loét dạ dày tá tràng.</li>
            <li>Tầm soát và diệt vi khuẩn HP (Helicobacter Pylori) gây viêm loét và ung thư dạ dày.</li>
            <li>Điều trị hội chứng ruột kích thích (IBS), viêm đại tràng mãn tính, trĩ nội/ngoại.</li>
            <li>Tầm soát ung thư đường tiêu hóa sớm bằng kỹ thuật nội soi hiện đại.</li>
        </ul>
        <h3>Hệ thống nội soi công nghệ cao:</h3>
        <p>Ứng dụng công nghệ Nội soi NBI (Narrow Band Imaging) phóng đại, nội soi không đau (tiền mê), giúp bệnh nhân trải qua quá trình thăm khám nhẹ nhàng và an toàn nhất.</p>
    `,
    "CK-003": `
        <p>Chuyên khoa <strong>Tim mạch</strong> là nơi quy tụ các chuyên gia hàng đầu trong việc phòng ngừa, chẩn đoán và điều trị các bệnh lý liên quan đến hệ tuần hoàn và tim mạch.</p>
        <h3>Các bệnh lý trọng điểm:</h3>
        <ul>
            <li>Quản lý và điều trị bệnh Tăng huyết áp (Cao huyết áp) nguyên phát và thứ phát.</li>
            <li>Bệnh lý mạch vành: Thiếu máu cơ tim, cơn đau thắt ngực, nhồi máu cơ tim.</li>
            <li>Các bệnh lý van tim, suy tim, và rối loạn nhịp tim (nhịp nhanh, nhịp chậm, ngoại tâm thu).</li>
        </ul>
        <h3>Quy trình thăm khám tiêu chuẩn:</h3>
        <p>Bệnh nhân sẽ được thực hiện Đo điện tâm đồ (ECG), Siêu âm tim Doppler màu, Đeo máy Holter điện tâm đồ/huyết áp 24h và Nghiệm pháp gắng sức để đánh giá toàn diện chức năng tim mạch.</p>
    `,
    "CK-004": `
        <p>Chuyên khoa <strong>Sản Phụ khoa</strong> cung cấp dịch vụ chăm sóc sức khỏe toàn diện cho phụ nữ ở mọi lứa tuổi, từ tuổi dậy thì, tiền hôn nhân, thai kỳ cho đến giai đoạn tiền mãn kinh và mãn kinh.</p>
        <h3>Dịch vụ nổi bật:</h3>
        <ul>
            <li><strong>Sản khoa:</strong> Khám thai định kỳ, siêu âm thai 4D/5D, sàng lọc dị tật thai nhi (Double Test, NIPT), theo dõi và quản lý thai kỳ nguy cơ cao.</li>
            <li><strong>Phụ khoa:</strong> Khám và điều trị viêm nhiễm phụ khoa, rối loạn kinh nguyệt, u xơ tử cung, u nang buồng trứng.</li>
            <li><strong>Tầm soát:</strong> Tầm soát ung thư cổ tử cung (Pap smear, HPV), tầm soát ung thư vú.</li>
        </ul>
        <p>Đội ngũ bác sĩ tâm lý, nhẹ nhàng, đảm bảo tính riêng tư tuyệt đối cho khách hàng trong suốt quá trình thăm khám.</p>
    `,
    "CK-005": `
        <p>Chuyên khoa <strong>Nhi khoa</strong> tự hào mang đến môi trường thăm khám thân thiện, không lạm dụng kháng sinh và ưu tiên tăng cường miễn dịch tự nhiên cho trẻ từ sơ sinh đến 16 tuổi.</p>
        <h3>Danh mục khám chữa bệnh:</h3>
        <ul>
            <li><strong>Khám nội nhi tổng quát:</strong> Điều trị các bệnh lý hô hấp (viêm họng, viêm phế quản, hen suyễn), tiêu hóa (tiêu chảy, táo bón), bệnh truyền nhiễm (tay chân miệng, sốt xuất huyết).</li>
            <li><strong>Khám dinh dưỡng:</strong> Tư vấn chế độ ăn cho trẻ biếng ăn, suy dinh dưỡng, thấp còi hoặc thừa cân béo phì.</li>
            <li><strong>Khám phát triển:</strong> Đánh giá các mốc phát triển tâm thần, vận động của trẻ nhỏ.</li>
        </ul>
        <p><em>* Không gian phòng khám được thiết kế với nhiều màu sắc, đồ chơi giúp trẻ giảm bớt lo âu và sợ hãi khi gặp bác sĩ.</em></p>
    `
}

const getFallbackContent = (specialty) => {
    return `
        <p>Chào mừng bạn đến với chuyên khoa <strong>${specialty.Name}</strong>.</p>
        <p>${specialty.Description}</p>
        <h3>Các dịch vụ chính tại chuyên khoa:</h3>
        <ul>
            <li>Khám, chẩn đoán và tư vấn chuyên sâu cùng các bác sĩ, chuyên gia giàu kinh nghiệm.</li>
            <li>Phác đồ điều trị được cá nhân hóa theo từng tình trạng bệnh và cơ địa của bệnh nhân.</li>
            <li>Trang thiết bị chẩn đoán đồng bộ, hiện đại, đảm bảo kết quả chính xác, nhanh chóng.</li>
        </ul>
        <p><em>* Lưu ý khi đi khám: Vui lòng mang theo các kết quả xét nghiệm, đơn thuốc hoặc phim chụp cũ (trong vòng 6 tháng) nếu có. Nếu có chỉ định xét nghiệm máu, quý khách vui lòng nhịn ăn sáng.</em></p>
    `
}

const mockServiceDetail = {
    Id: "22222222-3333-3333-3333-111111111101",
    Name: "Tiêm chất nhờn khớp gối (Hyaluronic Acid)",
    ShortDescription: "Giải pháp hiệu quả cho bệnh nhân thoái hóa khớp gối, giúp bôi trơn sụn khớp, giảm đau và cải thiện khả năng vận động nhanh chóng.",
    Price: 1500000,
    DurationInMinutes: 30,
    ProcessSteps: [
        "Bác sĩ thăm khám lâm sàng, đánh giá mức độ thoái hóa khớp gối.",
        "Siêu âm khớp gối để xác định chính xác vị trí tiêm và tình trạng dịch khớp.",
        "Sát khuẩn vô trùng kỹ lưỡng vùng đầu gối cần tiêm.",
        "Tiến hành tiêm chất nhờn (Acid Hyaluronic) vào ổ khớp dưới sự hướng dẫn của siêu âm.",
        "Băng ép vô khuẩn, bệnh nhân nghỉ ngơi tại chỗ 15 phút và nhận hướng dẫn chăm sóc tại nhà."
    ],
    FullDescription: `
        <p><strong>Tiêm chất nhờn khớp gối</strong> là thủ thuật y khoa đưa Acid Hyaluronic (một thành phần tự nhiên có trong dịch khớp khỏe mạnh) trực tiếp vào không gian ổ khớp.</p>
        <h3>Ưu điểm của dịch vụ:</h3>
        <ul>
            <li><strong>Hiệu quả kéo dài:</strong> Tác dụng giảm đau và bôi trơn có thể kéo dài từ 6 tháng đến 1 năm tùy cơ địa.</li>
            <li><strong>Trì hoãn phẫu thuật:</strong> Là giải pháp cứu cánh giúp bệnh nhân chưa đủ điều kiện sức khỏe hoặc chưa muốn phẫu thuật thay khớp.</li>
        </ul>
    `
}

const relatedDoctors = ref([
    { Id: "33333333-1111-1111-1111-111111111111", AvatarUrl: "https://storage.googleapis.com/bookingcare-resources/static/doctor/Nam_BacSi_2.jpg", FullName: "Nguyễn Trọng Hưng", Position: "AssociateProfessor", AvailableTimes: ["08:00 - 08:30", "09:30 - 10:00", "14:00 - 14:30"] },
    { Id: "33333333-2222-2222-2222-222222222222", AvatarUrl: "https://storage.googleapis.com/bookingcare-resources/static/doctor/Nu_BacSi_1.jpg", FullName: "Trần Thị Mai Phương", Position: "Master", AvailableTimes: ["10:00 - 10:30", "15:30 - 16:00"] }
])

const pageData = ref({})

const formatPrice = (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
const translatePosition = (pos) => ({ 'Professor': 'Giáo sư', 'AssociateProfessor': 'Phó Giáo sư', 'DoctorOfPhilosophy': 'Tiến sĩ', 'Master': 'Thạc sĩ', 'Doctor': 'Bác sĩ' }[pos] || 'Bác sĩ')

const goToBooking = (doctorId, timeSlot) => {
    const query = {}
    if (doctorId) query.doctorId = doctorId
    if (timeSlot) query.time = timeSlot
    if (pageType.value === 'service') query.serviceId = detailId.value
    router.push({ path: '/booking', query })
}

const loadData = () => {
    if (pageType.value === 'specialty') {
        const foundSpecialty = specialtiesList.find(s => s.Id === detailId.value);

        if (foundSpecialty) {
            const fullDesc = detailedContentMap[foundSpecialty.SpecialtyCode] || getFallbackContent(foundSpecialty);

            pageData.value = {
                ...foundSpecialty,
                ShortDescription: foundSpecialty.Description,
                FullDescription: fullDesc
            }
        } else {
            console.error("Không tìm thấy chuyên khoa!");
        }
    } else {
        pageData.value = mockServiceDetail
    }
}

onMounted(() => {
    loadData();
})

watch(
    () => route.params.id,
    (newId) => {
        if (newId) {
            detailId.value = newId;
            pageType.value = route.params.type;
            loadData();
        }
    }
)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

.detail-container {
    --primary-color: #45C3D2;
    --primary-hover: #3ba3b0;
    --bg-white: #ffffff;
    --bg-light: #f3f6f9;
    --text-dark: #1f2937;
    --text-gray: #4b5563;
    --border-color: #e5e7eb;
    font-family: 'Inter', -apple-system, sans-serif;
    color: var(--text-dark);
}

.bg-light {
    background-color: var(--bg-light);
    min-height: 100vh;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.box-style {
    background: var(--bg-white);
    border-radius: 16px;
    padding: 30px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);
    border: 1px solid var(--border-color);
}

.mt-30 {
    margin-top: 30px;
}

.detail-main {
    padding: 40px 0 80px;
}

.content-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 30px;
    align-items: start;
}

.header-card {
    display: flex;
    gap: 30px;
    align-items: flex-start;
}

.header-image {
    width: 200px;
    height: 200px;
    border-radius: 12px;
    border: 1px solid var(--border-color);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background: var(--bg-white);
    flex-shrink: 0;
}

.header-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.header-image.is-service {
    background: rgba(69, 195, 210, 0.1);
    border: none;
}

.srv-icon-large {
    width: 80px;
    height: 80px;
    color: var(--primary-color);
}

.header-info {
    flex-grow: 1;
}

.header-info .title {
    font-size: 32px;
    font-weight: 800;
    margin: 0 0 15px;
    line-height: 1.3;
}

.header-info .short-desc {
    font-size: 16px;
    color: var(--text-gray);
    line-height: 1.6;
    margin: 0;
}

.service-meta {
    display: flex;
    gap: 30px;
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px dashed var(--border-color);
}

.meta-item {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.meta-label {
    font-size: 13px;
    color: var(--text-gray);
    text-transform: uppercase;
    font-weight: 600;
    letter-spacing: 0.5px;
}

.meta-value {
    font-size: 20px;
    font-weight: 800;
}

.meta-value.price {
    color: #f59e0b;
}

.meta-value.time {
    color: var(--primary-color);
}

.section-title {
    font-size: 22px;
    font-weight: 700;
    margin: 0 0 25px;
    padding-bottom: 15px;
    border-bottom: 2px solid var(--primary-color);
    display: inline-block;
}

.rich-text {
    font-size: 16px;
    line-height: 1.8;
    color: var(--text-gray);
}

.rich-text :deep(h3) {
    font-size: 18px;
    font-weight: 700;
    color: var(--text-dark);
    margin: 30px 0 15px;
}

.rich-text :deep(ul) {
    padding-left: 20px;
    margin-bottom: 20px;
}

.rich-text :deep(li) {
    margin-bottom: 10px;
}

.rich-text :deep(p) {
    margin-bottom: 15px;
}

.process-section {
    margin-top: 40px;
    padding-top: 30px;
    border-top: 1px solid var(--border-color);
}

.process-section h3 {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 20px;
}

.process-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.process-list li {
    display: flex;
    align-items: flex-start;
    gap: 15px;
}

.step-number {
    width: 32px;
    height: 32px;
    background: rgba(69, 195, 210, 0.1);
    color: var(--primary-color);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    flex-shrink: 0;
}

.step-content {
    padding-top: 5px;
    font-size: 15px;
    line-height: 1.6;
    color: var(--text-gray);
}

.sidebar {
    position: sticky;
    top: 20px;
}

.sidebar-title {
    font-size: 20px;
    font-weight: 700;
    margin: 0 0 5px;
}

.sidebar-subtitle {
    font-size: 14px;
    color: #9ca3af;
    margin: 0 0 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--border-color);
}

.doctor-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.doctor-item {
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 15px;
    background: #fafafa;
    transition: border 0.3s;
}

.doctor-item:hover {
    border-color: var(--primary-color);
    background: #fff;
}

.doc-item-header {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 15px;
}

.doc-avt {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    object-fit: cover;
}

.doc-basic-info {
    flex: 1;
}

.doc-pos {
    font-size: 12px;
    font-weight: 600;
    color: var(--primary-color);
    text-transform: uppercase;
}

.doc-name {
    font-size: 16px;
    font-weight: 700;
    margin: 2px 0 0;
    color: var(--text-dark);
}

.doc-schedule {
    border-top: 1px dashed var(--border-color);
    padding-top: 12px;
}

.schedule-title {
    display: block;
    font-size: 13px;
    color: var(--text-dark);
    font-weight: 600;
    margin-bottom: 10px;
}

.schedule-title i {
    color: var(--primary-color);
}

.time-slots {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.time-slot {
    background: #fff;
    border: 1px solid var(--border-color);
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    color: var(--text-dark);
    cursor: pointer;
    transition: all 0.2s;
}

.time-slot:hover {
    background: var(--primary-color);
    color: #fff;
    border-color: var(--primary-color);
}

.btn-book-large {
    width: 100%;
    margin-top: 20px;
    padding: 14px;
    border-radius: 10px;
    background: var(--primary-color);
    color: #fff;
    border: none;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.3s;
    box-shadow: 0 4px 12px rgba(69, 195, 210, 0.3);
}

.btn-book-large:hover {
    background: var(--primary-hover);
}

@media (max-width: 992px) {
    .content-grid {
        grid-template-columns: 1fr;
    }

    .header-card {
        flex-direction: column;
        align-items: flex-start;
    }

    .header-image {
        width: 100%;
        max-width: 300px;
        height: auto;
        aspect-ratio: 1;
    }

    .sidebar {
        position: static;
    }
}
</style>