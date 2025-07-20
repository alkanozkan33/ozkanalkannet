# CapNote - Kişisel Takip Uygulaması

CapNote, notlarınızı ve ödemelerinizi takip etmek için tasarlanmış modern, mobil-uyumlu bir Progressive Web App (PWA) uygulamasıdır. Trello'nun kart tabanlı UX'inden ilham alarak, tek kullanıcı için optimize edilmiştir.

## ✨ Özellikler

### 📓 Notlar Modülü
- Kart tabanlı not görünümü (başlık, açıklama, etiket, renk)
- Filtreleme ve arama (etiket veya anahtar kelime ile)
- Checklist desteği (alt görevler)
- Emoji desteği
- Sabitleme özelliği
- Hatırlatma zamanı

### 💸 Ödemeler & Faturalar Modülü
- Ödeme takibi (başlık, tutar, vade tarihi, ödendi/ödenmedi)
- Tekrarlama seçenekleri (tek seferlik, aylık, yıllık)
- Hatırlatmalar (varsayılan + kullanıcı tanımlı)
- Fiş yükleme (PDF/JPG)
- OCR entegrasyonu (opsiyonel)

### 📆 Takvim Modülü
- FullCalendar.js ile tüm etkinlikleri görüntüleme
- Görünüm filtreleri (Bugün, Bu Hafta, Bu Ay)
- Etkinlik tıklama ile ilgili kart açma

### 🔔 Bildirimler & Hatırlatmalar
- OneSignal ile push bildirimleri
- Ödeme günü sabahı ve 30 dk öncesi tetikleme
- Özelleştirilebilir bildirim mesajları

### 🗂️ Etiket & Kategori Sistemi
- Renk kodlu etiketler (maksimum 10)
- Etiket ile filtreleme/gruplama
- Hızlı etiket oluşturma modal'ı

### 🌐 Google Takvim Senkronizasyonu
- OAuth2 ile kullanıcı bağlantısı
- Notlar ve ödemelerden etkinlik oluşturma
- Senkronize veri takibi

### 🌓 Tema & UX Tercihleri
- Açık/koyu tema değiştirici
- Kullanıcı başına varsayılan tema kaydetme
- Mikro animasyonlar (fade, slide, scale)
- Montserrat font ailesi

### 📤 WhatsApp'a Gönderme
- Kart içeriğini WhatsApp'ta paylaşma
- Önceden doldurulmuş mesaj formatı
- Opsiyonel varsayılan telefon numarası

### 📲 Android Ana Ekran Widget'ı
- PWA kısayolu üzerinden widget desteği
- Bugünün görevlerini widget'ta gösterme

## 🧱 Teknoloji Yığını

| Katman | Teknoloji/Servis |
|--------|------------------|
| Frontend | React.js + TypeScript + TailwindCSS + Framer Motion |
| Backend | Supabase (PostgreSQL, Auth, Storage) |
| Bildirimler | OneSignal (Push Notifications) |
| Takvim Sync | Google Calendar API v3 + OAuth2 |
| Mobil | Progressive Web App (PWA) |
| Hosting | Vercel veya Netlify |
| Font | Montserrat (Google Fonts) |

## 🚀 Kurulum

### Ön Gereksinimler
- Node.js (v16 veya üzeri)
- npm veya yarn
- Supabase hesabı
- Google Cloud Console hesabı (takvim senkronizasyonu için)
- OneSignal hesabı (bildirimler için)

### 1. Projeyi Klonlayın
```bash
git clone <repository-url>
cd capnote
npm install
```

### 2. Çevre Değişkenlerini Ayarlayın
`.env.example` dosyasını `.env` olarak kopyalayın ve gerekli değerleri doldurun:

```env
# Supabase Configuration
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google Calendar API (Opsiyonel)
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id

# OneSignal (Opsiyonel)
REACT_APP_ONESIGNAL_APP_ID=your_onesignal_app_id
```

### 3. Supabase Veritabanını Kurun
Supabase projenizde aşağıdaki tabloları oluşturun:

```sql
-- Notlar tablosu
CREATE TABLE notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  tag TEXT,
  tag_color TEXT,
  is_pinned BOOLEAN DEFAULT false,
  reminder_time TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Ödemeler tablosu
CREATE TABLE payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  due_date DATE NOT NULL,
  is_paid BOOLEAN DEFAULT false,
  recurrence TEXT DEFAULT 'once',
  reminder_time TIMESTAMP,
  notes TEXT,
  receipt_url TEXT
);

-- Takvim etkinlikleri tablosu
CREATE TABLE calendar_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  linked_note_id UUID REFERENCES notes(id),
  linked_payment_id UUID REFERENCES payments(id),
  event_type TEXT NOT NULL,
  event_date TIMESTAMP NOT NULL,
  is_synced_with_google BOOLEAN DEFAULT false,
  google_event_id TEXT
);

-- Checklist tablosu
CREATE TABLE checklists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  note_id UUID REFERENCES notes(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  is_done BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Kullanıcılar tablosu (gelecek ölçeklenebilirlik için)
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  pin_code TEXT,
  theme_preference TEXT DEFAULT 'system'
);
```

### 4. Uygulamayı Başlatın
```bash
npm start
```

Uygulama `http://localhost:3000` adresinde çalışacaktır.

### 5. Production Build
```bash
npm run build
```

## 📱 PWA Kurulumu

1. Uygulamayı desteklenen bir tarayıcıda açın
2. Adres çubuğundaki "Ana ekrana ekle" seçeneğini kullanın
3. Android'de widget desteği için ana ekrana eklenen kısayolu kullanın

## 🧪 Test Planı

### ✅ Temel Testler
- [ ] PWA kurulumu & ana ekran widget testi (Android + iOS)
- [ ] Push bildirim testi (izinler, tetikleyiciler)
- [ ] Google Takvim OAuth + senkronizasyon doğrulaması
- [ ] Açık/koyu tema geçiş testi
- [ ] PDF & resim yükleme kontrolü
- [ ] WhatsApp paylaşma davranışı
- [ ] Çevrimdışı not kaydetme & senkronizasyon kurtarma
- [ ] Yüklenen fişlerden OCR çıkarma
- [ ] Haftalık e-posta tetikleyici testi
- [ ] Mobil checklist etkileşim testi

## 🔐 Güvenlik

- Supabase Auth ile e-posta + şifre kimlik doğrulama
- 7 günlük oturum süresi (yenilenebilir)
- Opsiyonel mobil PIN kilidi
- KVKK/GDPR uyumlu (veri dışa aktarma, hesap silme)

## 🌟 Gelişmiş Özellikler

- **GPT destekli akıllı öneri motoru**: Not açıklamaları, önerilen etiketler, tekrarlayan kart tahmini
- **Haftalık e-posta özeti**: Her Pazartesi 08:00'de yaklaşan öğelerin özeti
- **Konum etiketleme desteği**: Kartlarda konum verisi saklama
- **Sesli notlar & kamera yükleme**: Sadece mobil
- **Zaman tabanlı otomasyonlar**: Örn. "her ayın 1'inde kart oluştur"

## 🤝 Katkıda Bulunma

1. Projeyi fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'i push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 Destek

Sorularınız için issue açabilir veya iletişime geçebilirsiniz.

---

**CapNote** - Modern, verimli, günlük kullanım için optimize edilmiş kişisel takip uygulaması 🚀