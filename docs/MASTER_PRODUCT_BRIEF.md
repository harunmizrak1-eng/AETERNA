# ÆTERNA OS — Master Product Brief ve Yol Planı

Status: long-term reference document, adopted 2026-07-16 — see
`docs/DECISIONS.md` for the adoption decision and the Product Alignment
Gate resolution. This document does not by itself authorize implementation,
does not retroactively rewrite UX-01–UX-10, and does not change
`docs/ROADMAP.md`'s stage gates. It has the same status as
`docs/UX_TRANSFORMATION_REVIEW.md` and `docs/COMPETITIVE_PARITY_BLUEPRINT.md`
— planning input, reconciled with the canonical plan only after explicit
owner approval per item.

> Bu metin araştırma ve yönlendirme içindir. Kod, kaynak dosyalar ve
> kanonik dokümanlar bu belge nedeniyle otomatik değiştirilmemelidir.

---

## 0. Belgenin amacı ve güncel durum

ÆTERNA OS, SparkyFitness altyapısı üzerinde geliştirilen kapsamlı bir
biohacking ve longevity operating system'dir.

Owner'ın bildirdiği güncel duruma göre:

- UX-01 ile UX-10 arasındaki çalışmalar tamamlanmıştır.
- Tamamlanan işler silinmemeli veya baştan yazılmamalıdır.
- Bir sonraki geliştirme başlamadan önce mevcut UX-01–UX-10 çıktıları
  incelenmeli ve korunması gereken parçalar belirlenmelidir.
- Bu brief, mevcut UX çalışmalarının üzerine kurulacak uzun vadeli ürün
  yönünü tanımlar.
- Bu metin kanonik roadmap'i kendiliğinden değiştirmez.
- Yeni kapsam, owner onayından sonra kanonik planla uzlaştırılmalıdır.
- Uygulama kaynağı, backend, API, Expo, Gradle veya dokümantasyon bu brief
  hazırlanırken değiştirilmemelidir.

### Kanonik uygulama

Repository: `C:\Users\harun\Documents\New project\AETERNA\aeterna-os`
Mobil uygulama: `C:\Users\harun\Documents\New project\AETERNA\aeterna-os\SparkyFitnessMobile`

Arşivlenmiş eski root prototype dikkate alınmamalıdır.

---

## 1. Ürünün temel amacı

ÆTERNA yalnızca fitness uygulaması, peptide tracker, kalori sayacı, ilaç
hatırlatıcısı, laboratuvar dashboard'u, antrenman uygulaması, AI sağlık
sohbeti veya sosyal ağ değildir. Bunların tamamını ortak bir kişisel sağlık
zaman çizgisinde birleştiren bir operating system olmalıdır.

### Ana ürün tanımı

ÆTERNA, kişisel protokolleri, intervention'ları, beslenmeyi, antrenmanı,
biomarker'ları, wearable verilerini, semptomları, araştırmayı ve topluluğu
zaman içinde birleştiren protocol-led biohacking ve longevity operating
system'dir.

### Ana ürün döngüsü

```
Protocol → Action → Track → Observation → Response → Review → Informed adjustment
```

Her özellik bu döngünün en az bir bölümünü desteklemelidir. Bir özellik
protokole, kullanıcının günlük davranışlarına, gözlemlere, sağlık
verilerine, review sürecine veya kaynaklı bilgiye bağlanamıyorsa ana üründe
neden bulunduğu sorgulanmalıdır.

### Ürünün kişiliği

ÆTERNA: bilimsel, premium, sakin, güvenilir, veri kaynağını açıkça
gösteren, biohacker'lara hitap eden, günlük kullanıma uygun, uzun vadeli
değişimi anlamlandıran, fitness uygulaması gibi görünmeyen, klinik yazılım
kadar soğuk olmayan, kanıt ile kişisel deneyimi birbirinden ayıran bir
ürün olmalıdır.

### Ne olmamalı?

- SparkyFitness'ın üzerine peptide ekranları eklenmiş hali.
- Underground peptide marketplace.
- Otomatik reçete veya doz belirleme sistemi.
- Opaque health score dashboard'u.
- Sürekli boş kart gösteren component gallery.
- Sadece wearable metriklerini gösteren pasif health dashboard.
- Her özelliğin ayrı modül gibi davrandığı dağınık super-app.
- Kullanıcıyı yalnızca ekran süresini artırmak için manipüle eden sosyal
  ürün.

---

## 2. Ürünün yedi ana motoru

### 2.1 Protocol Engine

Protocol, ÆTERNA'nın ana organizasyon nesnesidir. Bir protokol yalnızca ilaç
veya peptide programı değildir; peptides, hormone therapies, TRT/HRT, GLP-1
ve metabolik ilaçlar, diğer ilaçlar, supplements, nutrition targets,
hydration, caffeine limits, fasting, workout plan, sleep targets, recovery
routines, habits, monitoring requirements, lab/retest plan ve review
schedule'ın tümünü bir araya getirebilir.

Örnek:

```
Metabolic Reset — Version 3

INTERVENTIONS
Tirzepatide schedule
Protein target
Strength training 3x/week
Daily movement target
Sleep-consistency target
Hydration target

MONITORING
Weight weekly
Blood pressure twice weekly
Symptoms after dose
Lab panel after 8 weeks

REVIEW
Weekly self-review
Formal review: 28 August
```

Protocol kuralları:

- Her aktif protocol açık bir versiyona bağlı olmalıdır.
- Yapılan değişiklikler eski geçmişi değiştirmemelidir.
- Schedule değişiklikleri gerektiğinde yeni version oluşturmalıdır.
- Geçmiş dose/action kayıtları, kaydedildikleri protocol version ile
  ilişkisini korumalıdır.
- Protocol item ile genel Library monograph birbirine karıştırılmamalıdır.
- Kullanıcı mevcut planını manuel olarak girebilmelidir.
- Template kullanımı, otomatik reçete anlamına gelmemelidir.
- Template önce taslak oluşturmalı, ardından açık review ve confirmation
  istemelidir.
- ÆTERNA sessizce protocol değiştirmemelidir.
- AI tarafından oluşturulan her protocol önerisi taslak olmalıdır.

### 2.2 Nutrition Engine

Kalori ve beslenme takibi ikincil veya yüzeysel bir özellik olmamalıdır.
SparkyFitness'ın mevcut nutrition altyapısı korunmalı ve ciddi bir nutrition
experience'a dönüştürülmelidir.

Temel yetenekler: food search, barcode scanning, gram ve porsiyon bazlı
kayıt, quick calories, recent foods, favorites, saved meals, copy
yesterday, meal builder, recipe builder, meal planning, restaurant ve
brand search, food-label scan, fotoğraftan tahmin, kullanıcı düzeltmesi,
macros, micronutrients, fiber, caffeine, water, supplements, meal timing,
fasting window, daily/weekly averages, protocol targets, food provenance,
correction history.

Veri kaynakları (önerilen çok kaynaklı sistem): kullanıcının doğruladığı
kişisel yiyecekler; kayıtlı tarifler ve öğünler; Open Food Facts; USDA
FoodData Central; lisansı onaylanırsa FatSecret veya başka ticari
kaynaklar; gelecekte yerel/bölgesel veri kaynakları.

Veri güveni: her yiyecek source, last updated, verified/unverified, user
corrected, serving basis, portion confidence, estimated/manual/imported
gösterebilmelidir. Open Food Facts kullanıcı katkılı olduğundan kesin kabul
edilmemeli; ODbL/share-alike lisansı nedeniyle USDA veya özel verilerle tek
bir kapalı veri tabanına kontrolsüz biçimde birleştirilmemelidir.

Fotoğraf tahmini kesin veri gibi kaydedilmemelidir:

```
Estimated calories: 520–680 kcal

Chicken breast · estimated 160–200 g
Rice · estimated 180–240 g
Oil · uncertain

Review portions before saving.
```

AI tahmini kullanıcının onayından önce log'a yazılmamalıdır.

Today entegrasyonu — kullanıcı nutrition'ı pinlediyse Today'de kompakt özet
(`1,420 / 2,350 kcal`, `Protein 92 / 160 g`, `Water 1.6 / 2.5 L`); detay
Track → Nutrition içinde bulunmalıdır.

### 2.3 Training Engine

Hedef, Hevy benzeri ciddi bir workout builder ve logging deneyimidir.
Sparky'nin mevcut workout domain'i korunmalı ve genişletilmelidir.

Temel yetenekler: exercise search, muscle-group/equipment filter, custom
exercise, routine builder, workout folders/templates, sets/reps/weight,
duration/distance, RPE/RIR, warm-up sets, drop sets, supersets, rest timer,
exercise notes, previous performance, personal records, plate calculator,
progression history, workout calendar, shareable routine, protocol
linkage, recovery context, volume by muscle group, weekly training review,
active workout mode, offline workout logging.

wger yaklaşımı — wger doğrudan Sparky'nin yerine geçirilmemelidir. Ürün
referansı, exercise/muscle/equipment veri adayı, eksik katalog içeriği için
potansiyel API, lisans incelemesinden sonra veri kaynağı olarak kullanılır.
Dikkat: wger uygulama kodu AGPL 3+, ilk exercise/ingredient verileri
CC-BY-SA 3.0, her egzersiz görselinin lisansı ayrıca takip edilmeli, kod
veya veri kontrolsüz biçimde kopyalanmamalı, Sparky workout domain'i ana
domain olarak kalmalıdır.

### 2.4 Biomarker Engine

Biomarkers yalnızca laboratuvar sonuçlarının listesi değildir. Ana soru:
kullanıcının bedeni protokole, günlük davranışlara ve zamana nasıl yanıt
veriyor?

Kapsam: laboratory results, hormonal/metabolic/cardiovascular markers,
inflammation, hematology, liver, kidney, thyroid, nutrients, body
composition, blood pressure, sleep, HRV, resting heart rate, SpO₂,
respiration, activity, CGM (ileride), symptoms, side effects, manual
observations, documents, wearables, source conflicts, Response Timeline.

Biomarker sunum kuralları — her veri observation, unit, timestamp, source,
freshness, coverage, verification status, confidence, protocol relevance,
related events, next review gösterebilmelidir.

Yasak yaklaşım — health score, longevity score, readiness score, recovery
score, biological-age score (doğrulanmış ayrı bir ürün kararı olmadan)
üretilmemelidir.

Nedensellik — sistem "bu değişiklik protocol version 3 başladıktan sonra
gözlendi" diyebilir, ancak yeterli kanıt olmadan "bu değişikliğe kesinlikle
bu peptide neden oldu" dememelidir. Zaman ilişkisi ile nedensellik açıkça
ayrılmalıdır.

### 2.5 Tracking Engine

Track gerçek bir ana destination'dır. Global quick log onun yerine geçmez.

Track kapsamı: dose/action, symptoms, side effects, weight, body
measurements, blood pressure, journal, mood, energy, stress, libido, pain,
sleep, nutrition, caffeine, hydration, fasting, workouts, habits, progress
photos, medication, supplements, history, trends, corrections.

Önerilen Track Home:

```
Track

[Quick log]

PINNED
Nutrition · Water · Workout · Dose · Weight · Symptoms

TODAY
08:10  Dose logged
09:05  Breakfast · 540 kcal
11:30  Water · 350 ml
18:10  Upper Body workout

ALL CATEGORIES
Nutrition · Training · Sleep
Hydration · Caffeine · Fasting
Symptoms · Journal · Measurements
Mood · Energy · Pain · Habits
Photos · Medication

HISTORY
Calendar · Trends · Corrections
```

Kişiselleştirme — kullanıcı Track kategorilerini pinleyebilmeli,
sıralayabilmeli, kullanmadığı kategorileri gizleyebilmeli, kendi
measurement/habit türünü oluşturabilmeli, son kullanılan kayıt türlerine
hızla erişebilmelidir.

### 2.6 Knowledge ve Body Atlas Engine

Bu alan ürünün bilimsel ve keşif katmanıdır.

Knowledge kapsamı: compounds, peptides, hormone therapies, medications,
supplements, nutraceuticals, biomarkers, monographs, evidence, references,
guides, protocol templates, saved research, FAQs, editorial journal.

Compound taxonomy — her intervention "peptide" olarak sınıflandırılmamalı.
Ana sınıflar: peptide, hormone therapy, GLP-1/metabolic medication, other
medication, supplement, nutraceutical, nutrition intervention, training
intervention, sleep/recovery intervention. TRT, `Hormone Therapy` altında
bulunmalıdır.

Monograph içeriği: name, synonyms, category, mechanism, investigated uses,
regulatory/approval state, evidence tier, common administration routes,
kaynaklı regimen bilgileri, monitoring requirements, contraindications,
warnings, side effects, related biomarkers/systems, references, last
editorial review.

Kritik ayrım — Knowledge: genel ve kaynaklı bilgi. Protocol: kullanıcının
kişisel planı. Reminder: kullanıcının mevcut planını hatırlatır. AI:
açıklama ve taslak sağlayabilir. ÆTERNA: kendiliğinden kişisel doz
belirlemez.

---

## 3. Body Atlas

Body Atlas, ÆTERNA'yı sıradan bir tracker'dan ayırabilecek özel
deneyimdir.

Atlas katmanları: muscles, skin, skeletal, endocrine, cardiovascular,
metabolic, nervous system, symptoms, biomarkers, interventions.

Workout kullanımı — kas seçildiğinde: kas adı, anatomik bölümleri, primary/
secondary exercises, son antrenman tarihi, haftalık set hacmi, kullanıcının
ilgili semptomları, son performans, add to workout. Exercise detail:
primary/secondary muscles, movement animation, form cues, equipment
alternatives, previous performance, add to routine/current workout.

Compound kullanımı — bir compound seçildiğinde body map üzerinde yalnızca
kaynakla ilişkilendirilebilen sistemler gösterilmelidir. Evidence sunumu:
established (düz vurgu), investigational (kesik sınır), preclinical
(noktalı alan), insufficient evidence (gri), no known relationship
(gösterilmez). Görsel bir bölgenin parlaması "bu intervention kesinlikle
burayı geliştirir" anlamına gelmemelidir.

Uygulama aşamaları:

- **Atlas V1**: ön/arka 2D SVG, kas seçimi, primary/secondary muscle
  renklendirme, erişilebilir liste alternatifi, workout entegrasyonu.
- **Atlas V2**: optimize edilmiş 3D glTF, rotate/zoom, katman açma/kapatma,
  tek kas/sistem seçimi, exercise animations, compound/biomarker/symptom
  overlay.

Z-Anatomy yalnızca aday kaynaktır. Mobil performans, model boyutu, mesh
ayrımı ve lisanslar incelenmeden kullanılmamalıdır.

---

## 4. AI Engine

Ask Sparky altyapısı silinmemeli; ÆTERNA ürününe uygun biçimde
dönüştürülmelidir.

Çalışma adı — önerilen: **ÆON**. Alternatifler: Ask ÆTERNA, ÆTERNA Guide,
Navigator. ÆON kullanılmadan önce isim ve trademark araştırması gerekir
(henüz onaylanmadı — bkz. `docs/DECISIONS.md` açık kararlar).

AI navigasyonu — ayrı tab olmamalı; Today'de görünür bir giriş
(`Ask ÆON about your protocol, nutrition, training, biomarkers or
research…`) artı her ekranda bağlamsal giriş.

AI'ın yapabilecekleri: kullanıcı verilerini özetlemek, protocol açıklamak,
kaynaklı compound bilgisi vermek, biomarker trendlerini açıklamak, yemek/
workout kaydı taslağı hazırlamak, fotoğraftan yemek tahmini yapmak, weekly
review taslağı oluşturmak, hatırlatıcı taslağı hazırlamak, Knowledge/
Community içinde arama yapmak, kaynak göstermek, eksik verileri açıklamak,
kullanıcının onayına sunulan tool actions hazırlamak.

AI'ın yapamayacakları: kendi başına doz belirlemek, TRT/peptide reçete
etmek, protocol'ü sessizce değiştirmek, kullanıcı onayı olmadan kayıt
oluşturmak, community yorumunu bilimsel kanıt gibi sunmak, health/
longevity/readiness score üretmek, nedensellik uydurmak, kaynaksız tıbbi
iddia üretmek, insan verisiyle preclinical veriyi karıştırmak, safety
event'i yalnızca chat cevabıyla kapatmak.

Tool-action confirmation — her yazma işlemi önce preview göstermelidir:

```
Add to today's log?

Chicken breast · 180 g
Rice · 220 g
Estimated total · 640 kcal

Source: AI estimate
Confidence: Medium

[Confirm] [Edit] [Cancel]
```

---

## 5. Community Engine

Reddit benzeri sosyal alan uzun vadeli ürünün önemli bir parçası olabilir,
ancak düz Reddit klonu olmamalıdır.

Topluluklar: Peptides, TRT & Hormones, GLP-1 & Metabolic, Biomarkers,
Nutrition, Training, Sleep & Recovery, Skin & Hair, Supplements, Longevity
Research, Beginners, Women's Health, Men's Health.

Gönderi türleri: question, personal experience, protocol journal,
research, evidence discussion, progress update, training routine, meal
strategy, side-effect discussion, news. Her post türü görünür etiket
taşımalıdır; `Personal experience` evidence olarak sunulmamalıdır.

Güvenlik ve gizlilik: health data varsayılan olarak private; paylaşım açık
onay gerektirir; pseudonymous profil seçeneği; report/block; moderator
araçları; spam kontrolü; ürün satışı/tedarik paylaşımı kuralları; doz
tavsiyesi için safety labeling; edit history; professional verification;
anecdotal-experience/AI-generated etiketi; kriz ve safety escalation
metinleri; silinen/düzeltilen içerik için denetlenebilir davranış;
kullanıcının kişisel Protocol/Biomarker verisi otomatik paylaşılmaz.

Reputation — karma/follower yerine: Helpful, Well sourced, Clear personal
experience, Moderator reviewed, Professional verified gibi sinyaller;
bunlar klinik doğruluk sertifikası gibi gösterilmemeli.

Knowledge ayrımı — bir monograph sayfasında official evidence, related
studies, community discussions birbirinden açıkça ayrılmalı; Community
içeriği Knowledge içeriğinin içine karıştırılmamalıdır.

---

## 6. Navigasyon sistemi

**Mobil** — beş ana destination: Today, Protocol, Biomarkers, Track,
Library. **Adopted 2026-07-16: Library adını korur, Explore'a
değiştirilmedi** (bkz. `docs/DECISIONS.md`). İç segmentasyon (istenirse
ileride): `Knowledge · Community · Atlas`.

**Tablet ve web** — ~700–800dp ve üzeri ekranlarda sol sidebar/navigation
rail + orta ana içerik + sağ context/detail paneli. Telefon için sidebar
kullanılmamalı.

**Ana tablar arasında swipe olmamalı.** Swipe yalnızca ekran içi
filtrelerde (`Biomarkers: Overview · Labs · Vitals · Body · Hormones ·
Metabolic · Recovery`, `Track: All · Nutrition · Training · Symptoms ·
Sleep · Journal · Measurements`).

**Track ikonu** — `+` kullanılmamalı; logbook/journal/checklist/activity
history anlamına gelen bir ikon. Global quick log ayrı `+` ile açılmalı.

---

## 7. Today — Longevity Command Center

Today'in temel sorusu: şu anda dikkat etmem gereken ne var ve bugün ne
yapmalıyım?

Onaylı sıralama: attention/safety → ÆON girişi → next protocol action →
due/overdue items → günlük timeline → requested monitoring/check-in →
nutrition → training → meaningful change → review/retest → source
freshness/coverage → pinned health metrics → recent history. Attention
yoksa boş alan gösterilmemelidir.

(Bkz. brief'in tam örnek layout'ları için orijinal Türkçe metin — bu
belgeye kısaltılmadan taşınmıştır, aşağıdaki örnekler dahil.)

Aktif protocol örneği:

```
Good morning, Harun

Thursday, 16 July
Protocol day 18 · Review in 12 days

[Ask ÆON…]

NEXT UP
09:00 · Scheduled protocol action
[Log completed] [Skip] [Details]

TODAY
09:00 Protocol action
12:30 Nutrition check
18:00 Upper Body workout
22:30 Sleep routine

NUTRITION
1,420 / 2,350 kcal
Protein 92 / 160 g
Water 1.6 / 2.5 L

TRAINING
Upper Body · 7 exercises
[Start workout]

CURRENT PICTURE
Sleep       6 h 48 m
RHR         58 bpm
Weight      78.4 kg
Steps       4,820

WHAT CHANGED
Resting heart rate has been above
the recent range for three nights.

Source · coverage · confidence

COMING UP
Lab retest · 28 July
Weekly review · Sunday
```

Protocol olmayan kullanıcı:

```
Welcome to ÆTERNA

Build your longevity workspace.

1. Add your baseline
2. Add or import your current plan
3. Connect a health source
4. Choose what you want to monitor
```

Bağlantı sorunu — Health Sync çalışmadığında Today tamamen çökmemeli;
manuel Protocol ve Track çalışmalı; tek bir sakin bağlantı bildirimi
gösterilmeli; yalnızca etkilenen metric bölümü stale/disconnected olmalı;
aynı hata birden fazla kartta tekrarlanmamalı.

---

## 8. Today ve Biomarkers dashboard farkı

**Today**: zaman ölçeği şimdi/bugün/yaklaşan birkaç gün; odak action,
attention, schedule, daily progress, short snapshot, next review.

**Biomarkers**: zaman ölçeği haftalar/aylar/yıllar; odak trends, labs,
wearables, source provenance, coverage, protocol response, longitudinal
record.

İki ekran birbirinin kopyası olmamalıdır.

---

## 9. Görsel tasarım yönü

Mevcut yön (warm ivory, charcoal, bronze) tamamen silinmemeli — ÆTERNA'nın
marka karakterinin parçası. Fakat mevcut uygulama fazla monokrom,
serif-ağırlıklı, büyük-boşluklu, büyük-boş-kartlı, statik, editorial
landing-page benzeri hale gelmiştir.

**Tasarım formülü** (birebir kopyalama değil, yönsel oran):
%50 Apple Health (bilgi mimarisi/okunabilirlik) + %20 Huawei Health
(modülerlik/günlük canlılık) + %20 OneTwenty (protocol/dashboard döngüsü) +
%10 ÆTERNA editorial (marka/bilimsel yayın hissi).

**Operational mode** (Today, Track, Biomarkers): daha fazla sans-serif,
daha kompakt bilgi, timeline, grafikler, tarih, source, küçük semantik
renkler, daha az büyük boş kart, daha fazla liste/bölümlendirilmiş yüzey.

**Editorial mode** (Protocol rationale, Library, monographs, Weekly
Review): serif başlık, ivory yüzey, daha geniş whitespace, kaynaklar,
evidence badge'leri, uzun-form içerik.

Serif: ana ekran başlıkları, protocol rationale, weekly review,
monographs, editorial içerik. Sans: günlük action, button, status, log,
metric, form, navigation, dense list.

Kart kullanımı — her bölüm aynı beyaz büyük-radius kart olmamalı;
bordersız editorial blok, timeline, compact row, split summary, section
list, inline chart, status strip, expandable detail kullanılabilir; büyük
kart yalnızca gerçekten önemli bir nesne için.

Alt navigasyon — mevcut sorunlar: çok gri, aktif tab zayıf, ince bronze
çizgi yetersiz, Track `+` ikonu belirsiz, ikonların karakteri birbirine
çok yakın. Aktif tab: daha güçlü charcoal, daha görünür bronze accent,
belirgin label, erişilebilir contrast.

Development gear — yüzen gri gear production görselinin parçası olmamalı;
development-only ise normal screenshot ve production modunda gizlenmeli;
settings erişimiyse profile/header içine taşınmalı.

---

## 10. Güçlü state language

Never recorded, waiting for observation, not enough data, calibrating,
source disconnected, permission denied, syncing, partial coverage, stale,
offline, temporarily unavailable, conflicting data, queued, actual zero —
birbirine karıştırılmamalıdır. `Activity: 0` yalnızca gerçekten doğrulanmış
sıfır olduğunda gösterilmeli; okunamadıysa "Not available" / "Never
synced" / "Permission required" / "Partial coverage" gösterilmelidir.

Hata davranışı — bir bölümün hatası tüm ekranı çökertmemeli; Track geçmişi
yüklenemese bile quick log çalışmalı; Health Sync bozulsa bile manual
logging çalışmalı; Protocol schedule yüklenemese bile mevcut local/manual
bilgiler korunmalı; aynı hata birden çok kartta tekrarlanmamalı; kullanıcıya
yalnızca gerçekleştirebileceği bir recovery action gösterilmelidir.

---

## 11. SparkyFitness'tan korunacaklar

SparkyFitness yalnızca geçici bir UI değildir; önemli bir teknik ve domain
temelidir.

Korunacak altyapı: authentication, backend, APIs, database, settings,
notifications, error handling, query/cache, Health Sync foundations,
reports, charts, logging, offline/retry davranışları, navigation guards,
bottom sheets, form utilities.

Nutrition: foods, food entries, meals, meal templates/plans, barcode, Open
Food Facts, USDA, FatSecret, macros, micronutrients, water, fasting.

Training: exercises, exercise entries, sets, strength/cardio history,
workout presets/templates, activity details.

Tracking: weight, height, body fat, body measurements, sleep, sleep
stages, HRV, SpO₂, resting heart rate, mood, symptoms, progress photos,
fasting.

Medication/injection: injection entries, oral medication entries,
taken/skipped, scheduled vs actual time, medication schedules, day-of-week/
interval schedules, cycle on/off, medication pens, concentration, volume,
total/used doses, opened/expiry dates, beyond-use dates, reorder
threshold, titration steps.

AI altyapısı: chat routes, chat history, nutrition/fitness tool-calling
temelleri.

**Kural**: çalışan domain sırf görünür UX'te kullanılmıyor diye
silinmemeli; önce gizlenebilir, yeniden organize edilebilir, refine
edilebilir, yeni ÆTERNA ekranlarının arkasında tekrar kullanılabilir.
Fiziksel kod silme, yalnızca migration kanıtlandıktan sonra
değerlendirilmelidir.

---

## 12. Sparky'de olmayan veya yeni yapılacaklar

Gerçek Protocol Engine, Protocol versions, protocol-item taxonomy,
protocol linkage, Peptide/Compound Registry, Knowledge Library, Biomarkers
UX, manual blood pressure, general journal, general libido logging, manual
stress/energy, habits, Response Timeline UI, evidence governance, Body
Atlas, Oura, WHOOP, CGM, ÆON product experience, Community, moderation,
social privacy, kaynaklı compound-body relationships.

---

## 13. Entegrasyon yönü

Mevcut veya kısmen mevcut: Apple Health/HealthKit, Android Health Connect,
Fitbit, Garmin, Withings, Polar, Strava, Hevy ile ilgili bazı altyapılar.
Kodun bulunması production-ready olduğu anlamına gelmez — permission,
revocation, background sync, duplicate handling, stable source
identifiers, unit conversion, timezone, partial coverage, stale data,
conflict resolution, writeback loops, offline queue doğrulanmalıdır.

Yeni entegrasyon gerektirenler: Oura, WHOOP, Dexcom/Libre CGM, doğrudan
Bluetooth scale/device entegrasyonları.

Manual Protocol ve Track, hiçbir sağlık bağlantısına bağımlı olmamalıdır.

---

## 14. Kullanıcı uygulamada nerede uzun vakit geçirir?

Today sonsuz feed olmamalı — hızlı, net, aksiyon odaklı olmalı. Uzun ve
anlamlı kullanım alanları: Explore/Library (community, research,
monographs, Body Atlas, saved collections, editorial series), Training
(program oluşturma, exercise seçme, kas inceleme, aktif workout, progress
review, routine paylaşımı), Nutrition (recipe oluşturma, meal planning,
makro/mikro analiz, weekly review, community recipes), ÆON (kişisel veri
analizi, research, draft planning, weekly review, community summaries).

Başarı metriği yalnızca "time spent" olmamalı. Daha doğru metrikler:
protocol-action completion, logging speed, weekly review completion, data
coverage, returning-user retention, connected-source reliability, useful
community contribution, saved research, workout completion, nutrition
logging consistency, correction rate, AI suggestion acceptance/edit rate.

---

## 15. UX-01–UX-10 sonrası önerilen yol

Owner'a göre UX-01–UX-10 tamamlanmıştır. AI şunları yapmamalıdır:
UX-01–UX-10'u baştan yazmak; mevcut çalışan domain'leri kaldırmak; sırf
yeni vizyon geldi diye tamamlanmış akışları silmek; canonical slice
numaralarını otomatik değiştirmek; roadmap veya Decisions dosyasını owner
onayı olmadan düzenlemek.

### Product Alignment Gate

UX-11 başlamadan veya geniş kapsamlı yeni ekranlar yapılmadan önce
aşağıdaki kararlar owner tarafından netleştirilmelidir. **Durum
(2026-07-16), bkz. `docs/DECISIONS.md`:**

1. `Library` adı kalacak mı, `Explore` olacak mı? → **Karar: Library
   kalıyor.**
2. ÆON çalışma adı onaylanıyor mu? → **Açık.**
3. Nutrition ve Training Core daha erken aşamaya alınacak mı? → **Karar:
   Hayır, mevcut Stage sırası korunuyor.**
4. Protocol template kullanım sınırı nedir? → **Açık.**
5. Compound içeriklerini kim yönetecek? → **Açık.**
6. Safety ve escalation içeriğini kim onaylayacak? → **Açık.**
7. Community için moderasyon modeli nedir? → **Açık.**
8. Kullanıcı manuel protocol oluşturabilecek mi? → **Karar: Henüz değil.**
9. Self-directed wellness ve practitioner-guided modları ayrılacak mı? →
   **Açık.**
10. Body Atlas önce 2D olarak başlatılacak mı? → **Açık (brief 2D-önce
    öneriyor, henüz resmi karar yok).**

Bu gate bir kodlama işi değildir.

---

## 16. Önerilen geliştirme aşamaları

### Faz A — Mevcut Core OS'yi tamamla

Mevcut slice dizisini bozmayacak şekilde: Biomarkers Home, manual result
flow, Biomarker detail, longitudinal record, Track Home, global quick log,
Logbook, correction history, Weekly review, Adherence.

Başarı kriteri: kullanıcı protocol görebilir, action tamamlayabilir, dose
kaydedebilir, symptom kaydedebilir, manual biomarker girebilir, Track
geçmişini görebilir, correction yapabilir, weekly review tamamlayabilir.

**Adopted 2026-07-16: bu fazın hiçbir open gate kararına bağlı olmayan
parçalarına (Track Home, global quick log, Logbook/correction history,
Weekly review, Adherence, Biomarkers detail/longitudinal record) devam
edilmesi onaylandı** — bkz. `docs/DECISIONS.md`.

### Faz B — Lifestyle Core'u erkene çek

Owner onayıyla, ileri Stage 3 kapsamının ince ama ciddi çekirdeği daha
erken getirilebilir: Nutrition Core (food search, barcode, calories,
macros, water, caffeine, meals, saved meals, recipe builder, daily/weekly
review), Training Core (exercise catalog, routine builder, active
workout, sets/reps/weight, rest timer, history, basic muscle mapping,
protocol linkage), Sleep ve fasting (manual/imported sleep, fasting timer,
history, Today integration).

**Adopted 2026-07-16: reddedildi — mevcut Stage 3 sırası korunuyor,** bkz.
`docs/DECISIONS.md`.

### Faz C — Today Command Center yeniden kompozisyonu

Today, gerçek domain verileri (Protocol, dose/action, Nutrition, Training,
Sleep, Monitoring, Biomarkers, Review, Health Sync, ÆON) geldikten sonra
son haline getirilmelidir. Bu aşama daha fazla kart eklemek değil, veri
önceliğini düzenlemektir.

### Faz D — Biomarkers ve Health Sync genişlemesi

HealthKit, Health Connect, provenance, coverage, conflicts, manual/
imported ayrımı, wearables, Response Timeline, Oura/WHOOP/CGM için
geleceğe hazır connector modeli.

### Faz E — Knowledge ve Body Atlas

Knowledge V1: Compound Registry, peptide monographs, hormone therapies,
biomarker monographs, evidence, references, search, saved research.
Atlas V1: 2D front/back body, muscle map, exercise/symptom links. Atlas
V2: 3D anatomy, system layers, compound/evidence overlays, exercise
animation.

### Faz F — ÆON

ÆON V1 (read-only, source-grounded): explain, search, summarize, compare,
missing-data explanation. ÆON V2 (onaylı tool actions): draft food log/
workout/reminder/journal entry/weekly review, schedule proposal. ÆON V3
(longitudinal analysis): protocol-period comparison, coverage-aware
summaries, evidence-grounded research assistant, Community/Knowledge
synthesis. Her aşamada confirmation zorunludur.

### Faz G — Community

Ancak authentication, privacy, pseudonymous profiles, moderation, report/
block, content labels, evidence separation, safety rules, anti-spam,
audit/edit history, community guidelines, ilk içerik ve moderator ekibi
hazır olduğunda açılmalıdır. Boş community açılmamalıdır.

---

## 17. AI geliştirici için çalışma kuralları

1. Önce canonical dokümanları ve mevcut kaynak kodunu okumalıdır.
2. UX-01–UX-10 tamamlanmış kabul edilmeli, yeniden yapılmamalıdır.
3. Owner onayı olmadan roadmap veya decisions değiştirmemelidir.
4. Bir slice başlamadan önce mevcut Sparky asset'lerini listelemelidir.
5. Yeni domain oluşturmadan önce benzer mevcut service, hook, route ve
   table aramalıdır.
6. Working Sparky functionality'yi silmemelidir.
7. Legacy dashboard normal navigasyondan gizli kalmalı, development route
   korunmalıdır.
8. Fake health data üretmemelidir.
9. Fake score üretmemelidir.
10. Fake reference range üretmemelidir.
11. Fake compound claim üretmemelidir.
12. "Zero" ile "No data"yı karıştırmamalıdır.
13. Health Sync hatası manual product experience'ı çökertmemelidir.
14. AI tool action'ları kullanıcı onayı olmadan çalıştırmamalıdır.
15. Community içeriğini scientific evidence olarak kullanmamalıdır.
16. Her chart source, range ve coverage göstermelidir.
17. Her yeni slice bağımsız doğrulanabilir olmalıdır.
18. Final visual polish, gerçek veri ve interaction tamamlanmadan
    yapılmamalıdır.
19. Mobile navigation telefonlarda bottom tabs olarak korunmalıdır.
20. Tablet/web için adaptif sidebar planlanmalıdır.
21. Ana destination'lar arasında swipe navigasyonu eklenmemelidir.
22. Accessibility, light mode ve dark mode aynı slice içinde ele
    alınmalıdır.
23. Error, offline, stale, denied ve partial durumları ayrı ele
    alınmalıdır.
24. Tıbbi bilgi ile kişisel plan açıkça ayrılmalıdır.
25. Peptide, TRT, medication ve supplement aynı kategori olarak
    modellenmemelidir.

---

## 18. Onay bekleyen ürün kararları

Aşağıdaki kararlar henüz otomatik olarak canonical kabul edilmemelidir
(4'ü 2026-07-16'da resolved oldu, bkz. §15 ve `docs/DECISIONS.md`):

1. **Library → Explore** — resolved: Library kalıyor.
2. **AI adı (`ÆON`)** — açık, trademark/isim araştırması gerekir.
3. **Lifestyle Core zamanlaması** — resolved: erkene çekilmiyor.
4. **Community kapsamı** — açık (launch kapsamı, moderasyon modeli,
   kimlik yapısı, profesyonel hesaplar, içerik sınırları).
5. **Compound governance** — açık (içerik yazarı, review süreci, evidence
   tier atama, ülkeye göre regulatory status, regimen kaynakları).
6. **Eligibility authority** — açık (yalnızca bilgilendirme mi, self-
   assessment mı, practitioner approval mı, "unknown" ne zaman denir).
7. **Body Atlas kapsamı** — açık (brief 2D-önce, sonra 3D öneriyor; ağır
   3D implementation'a doğrudan başlanmamalı).

---

## 19. Nihai yön

ÆTERNA'nın nihai deneyimi şu birleşimin sonucu olmalı: Apple Health'in
bilgi mimarisi, Huawei Health'in günlük modüler canlılığı, OneTwenty'nin
protocol/lab/retest döngüsü, Cronometer seviyesinde ciddi nutrition, Hevy
seviyesinde workout planning ve logging, Reddit benzeri fakat
health-specific güvenlik katmanlı Community, kaynaklı ve kontrollü ÆON AI,
interaktif Body Atlas, ÆTERNA'nın warm/editorial/bilimsel marka dili —
fakat bunlar ayrı ürünler gibi görünmemeli.

Kullanıcı: Library'de bir compound öğrenebilmeli, onu mevcut kişisel
planıyla karşılaştırabilmeli, Protocol'de kendi planını görebilmeli,
Today'de sıradaki aksiyonu tamamlayabilmeli, Track'te semptom/yemek/
workout kaydedebilmeli, Biomarkers'ta zaman içindeki yanıtı görebilmeli,
Weekly Review'da değişimi değerlendirebilmeli, ÆON'a verileri hakkında
soru sorabilmeli, Community'de deneyimleri okuyabilmeli, evidence ile
anecdote arasındaki farkı anlayabilmelidir.

ÆTERNA'yı "OS" yapan şey özellik sayısı değil, bütün bu deneyimlerin aynı
kullanıcı, aynı zaman çizgisi, aynı protocol version ve aynı evidence
sistemi çevresinde birleşmesidir.

### Kısa yürütme emri

UX-01–UX-10'u koru. Yeni kod yazmadan önce ürün kararlarını doğrula. Core
Protocol ve Track bütünlüğünü tamamla. Sparky'nin çalışan nutrition,
workout, medication, logging ve sync varlıklarını yeniden kullan.
Lifestyle Core'u owner onayıyla erkene çek. Today'i gerçek verilerle
Longevity Command Center'a dönüştür. Daha sonra Knowledge, Body Atlas, ÆON
ve güvenli Community katmanlarını aşamalı olarak ekle. Sahte veri, opaque
score, otomatik doz, sessiz protocol değişikliği veya kaynakla kişisel
deneyimi karıştıran bir sistem oluşturma.
