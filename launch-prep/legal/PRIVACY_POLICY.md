# ÆTERNA Privacy Policy

**Effective date:** 26 July 2026
**Last updated:** 26 July 2026
**Languages:** English / Türkçe (below)

ÆTERNA is a longevity and biology operating system. This policy explains, in
plain language, what data the app collects, where it goes, and the choices you
have. It reflects what the code actually does — verified by an internal audit
on 2026-07-26.

---

## The short version

- **No advertising. No analytics. No tracking. No third-party ad or analytics
  SDKs** ship in the app. We do not collect device identifiers for profiling
  (no IDFA/IDFV/Android advertising ID/install referrer).
- **The app works without an account.** A "local-only" mode stores your data
  only on your device. Nothing leaves it.
- **Your biology data is yours.** When you do connect to a server (your own,
  or one we operate), it is stored to be useful to *you* — not sold, not
  shared, not aggregated into a profile about you.
- **AI (AEON) is opt-in and uses your own key** (or a key your administrator
  configured). When AEON runs, the messages you send and any health context it
  reads may be transmitted to the AI provider you chose. You can disable it.
- **Health data from wearables/Apple Health/Health Connect syncs only if you
  link a source and grant permission.** We never read it in the background
  without your opt-in.

---

## 1. Who we are

ÆTERNA is published by the repository owner ("we", "us"). For questions about
this policy or your data, contact: **[support email — to be filled before
public release]**.

This policy covers:
- the ÆTERNA mobile application ("the app"), and
- the reference server deployment at `aeterna-os.fly.dev` when you connect to
  it ("the server").

If you connect the app to **your own** self-hosted server, that server's
operator (which may be you) is the data controller for the data stored there.
This policy describes the reference deployment; your self-hosted instance may
differ.

---

## 2. What we do **not** do

Verified absent from the app's code and dependencies as of 2026-07-26:

| Category | Status |
|---|---|
| Advertising SDKs (AdMob, Facebook Audience, AppLovin, ironSource, Unity Ads) | **None** |
| Analytics / telemetry (Firebase Analytics, Amplitude, Mixpanel, PostHog, Segment, GA, Datadog, Bugsnag, Crashlytics, Sentry, Matomo, Plausible, Fathom, Heap, LogRocket) | **None** |
| Device fingerprinting for profiling (IDFA, IDFV, advertisingId, AndroidID, installReferrer) | **None** |
| Background location tracking | **None** (foreground-only, user-initiated outdoor-activity mode) |
| "Phone-home" startup pings to a vendor | **None** |
| Selling or sharing data with third parties | **Never** |

---

## 3. Data the app stores **on your device**

In local-only mode (no server connected), everything below stays on your
device and is never transmitted.

- **Health records you enter or sync**: protocols, doses, lab results,
  biomarkers, symptoms, food/exercise entries, body measurements, water.
- **Health data synced from Apple Health / Health Connect**: sleep, HRV,
  resting heart rate, steps, workouts, weight, and others you grant — stored
  in a local SQLite database (`aeterna.db`).
- **Server configuration**: the URL, auth token, and any proxy headers for a
  server you connect to. Tokens are stored in the OS keychain/keystore
  (SecureStore), not plaintext preferences.
- **Outdoor activity routes** (optional, foreground-only): latitude,
  longitude, altitude, timestamp — held in memory during the activity, not
  sent anywhere by the tracker itself.

**Device encryption**: the local SQLite database relies on the operating
system's full-disk / file-based encryption (iOS Data Protection, Android
file-based encryption). On a non-jailbroken device with a passcode, this is
protected at rest. If you need stronger protection against device forensic
access, let us know — field-level encryption is on the roadmap.

---

## 4. Data the **server** stores when you connect

When you create an account or connect to a server, the following is stored
server-side, scoped to your user account via database row-level security:

- **Account**: your name, email, and a password hash (or passkey credential).
  Email verification is required only if the server has email configured.
- **All health records** listed in §3 — protocols, doses, labs, biomarkers,
  symptoms, food, exercise, measurements, water.
- **Wearable/health-source data** synced from providers you explicitly linked
  (Apple Health, Health Connect, Withings, Fitbit, Garmin, Polar, Strava,
  Google Health, Hevy).
- **Food/exercise lookups** you perform (e.g. barcode scans against Open Food
  Facts, USDA, FatSecret, Nutritionix) are sent to those services to fulfill
  your request and discarded server-side once stored in your records.
- **Sessions**: each login creates a session row recording the IP address and
  user agent, retained for **30 days** then automatically deleted. This is
  for security (rate limiting, abuse prevention) — not profiling.
- **Operational logs**: the server logs error messages to standard output for
  debugging. Logs may include user IDs and, on rare error paths, the email
  being looked up. **Logs never contain request bodies, lab values, or health
  data.** Logs are retained briefly by the hosting platform and are not
  shared with third parties.

**WHOOP and Oura**: not integrated. Recovery/readiness scores are computed
locally from HRV and sleep debt you provide via Apple Health / Health Connect.

---

## 5. AI (AEON) — what is shared, and only when you choose

ÆTERNA includes an optional AI assistant, AEON. **AEON never runs unless an
AI service is configured.**

- **Bring-your-own-key**: you (or your administrator) provide an AI provider
  account — OpenAI, Anthropic, Google, Mistral, Groq, OpenRouter, xAI, Meta,
  or a self-hosted Ollama/compatible endpoint. Your API key is encrypted at
  rest (AES-256-GCM) and never returned in API responses.
- **What is sent to the provider**: the messages you type in the AEON chat,
  and — when AEON uses a tool to answer your question — the specific health
  records that tool reads (e.g. recent sleep, weight, a biomarker). Tool
  calls are scoped to your account.
- **No ambient AI calls**: AEON does not send data in the background. Every
  call is initiated by you asking a question.
- **Self-hosted option**: you can point AEON at a self-hosted model
  (Ollama/compatible) so data never leaves infrastructure you control. The
  server blocks private-internal-network AI URLs unless you explicitly opt in.
- **Your choice**: if you do not want any data sent to a third-party AI
  provider, do not configure AEON, or configure a self-hosted provider. The
  rest of the app works fully without it.

We are working on a per-category "data shared with AI" toggle and an
in-app audit trail of what each AEON turn transmitted. Until then, the
scope is governed by which tools the configured provider enables.

---

## 6. Your rights

Depending on where you live, you have rights over your personal data. We
honor them regardless of location:

- **Access**: request a copy of your data (also available via the in-app
  account-export feature).
- **Rectification**: edit any record in the app at any time.
- **Erasure**: delete your account and all associated data; the app's
  "delete account" flow removes your records server-side.
- **Portability**: export your data (in-app export).
- **Object / restrict**: disconnect any wearable, disable AEON, switch to
  local-only mode, or stop using the server entirely — at any time.
- **No automated decision-making** is performed about you. The app surfaces
  your own data to you; it never makes decisions about you.

To exercise these rights, email **[support email]**. We respond within 30
days. We do not charge a fee unless requests are manifestly unfounded.

---

## 7. Data retention

- **On your device**: until you delete the app or the record.
- **On the server**: until you delete your account or the specific record.
- **Sessions**: 30 days, then auto-deleted.
- **Operational logs**: retained briefly by the hosting platform; we do not
  set a long-term log archive.
- **Backups**: the server database may be backed up by its operator; backups
  inherit the same deletion when they rotate.

---

## 8. Children

ÆTERNA is not directed at children under 16 and we do not knowingly collect
their data. The app references peptides and compounds for adults conducting
their own health research; it is not a medical device and does not provide
medical advice to anyone, including minors.

---

## 9. International transfers

If you connect to the reference server (`aeterna-os.fly.dev`, hosted in
Frankfurt), your data is processed in the EU. AI provider calls (if enabled)
may transfer message content outside the EU to the provider's region — this
is governed by your chosen provider's terms. If you self-host, no
international transfer occurs beyond what your infrastructure causes.

---

## 10. Security

- **In transit**: HTTPS is enforced for server connections; the app refuses
  plain HTTP in production. Apple App Transport Security is locked down.
- **Credentials**: tokens in OS keychain/keystore, never plaintext. Passwords
  hashed server-side (bcrypt). Passkeys supported.
- **Authorization**: every server query is scoped to your account via
  Postgres row-level security. Other users cannot read your records.
- **Open source**: the application code is auditable. Security issues can be
  reported to **[security email]**; please do not open public issues for
  vulnerabilities.
- **Known limitations** (disclosed honestly): the local SQLite database is
  not field-encrypted (relies on OS-level protection); the server-to-database
  TLS connection does not pin a certificate authority. We are working on
  both.

---

## 11. Changes to this policy

Material changes will be announced in the app and dated above. Continued use
after the effective date constitutes acceptance.

---

## Türkçe özet

ÆTERNA bir uzun ömür ve biyoloji işletim sistemidir. Bu gizlilik politikası,
uygulamanın gerçekte ne yaptığını açıkça anlatır — kod, 2026-07-26'da
yapılan bir denetimle doğrulanmıştır.

**Kısa versiyon:**
- **Reklam yok. Analitik yok. Takip yok.** Uygulama içinde hiçbir reklam veya
  analitik SDK bulunmaz. Profilleme için cihaz tanımlayıcısı toplamayız.
- **Hesapsız çalışır.** "Yalnızca yerel" modu verilerinizi sadece cihazınızda
  tutar; hiçbir şey dışarı çıkmaz.
- **Biyoloji veriniz sizindir.** Bir sunucuya bağlandığınızda (kendi
  sunucunuz veya bizim referans sunucumuz), veriler size faydalı olmak için
  saklanır — satılmaz, paylaşılmaz, sizin hakkınızda bir profil oluşturmak
  için birleştirilmez.
- **AEON yapay zekası opsiyoneldir ve kendi anahtarınızı kullanır** (veya
  yöneticinizin yapılandırdığı anahtarı). AEON çalıştığında, gönderdiğiniz
  mesajlar ve okuduğu sağlık verileri, seçtiğiniz AI sağlayıcısına
  iletilebilir. Kapatabilirsiniz.
- **Sağlık verisi** yalnızca siz bir kaynak bağladığınızda ve izin
  verdiğinizde senkronize edilir. Arka planda izniniz olmadan okunmaz.

KVKK (Kişisel Verilerin Korunması Kanunu) ve GDPR kapsamındaki haklarınız
için (erişim, düzeltme, silme, taşıma, itiraz) **[destek e-postası]**'na
yazın. Taleplerinizi 30 gün içinde yanıtlarız. ÆTERNA hiçbir otomatik
karar verme işlemi yapmaz — uygulama size kendi verilerinizi sunar, sizin
hakkınızda karar vermez.

Tıbbi tavsiye vermez. Teşhis koymaz. Reçete yazmaz. Buradaki içerik eğitim
ve araştırma amaçlıdır; doktorunuzun yerini tutmaz.
