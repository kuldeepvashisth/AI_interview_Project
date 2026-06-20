# InterviewVerse AI — Dependency & Libraries Guide

This document lists every external library used in this project, explaining why it was chosen, the problems we would face without it, how it solves those problems, and what the alternatives would be.

---

## Frontend Libraries

### 1. Tailwind CSS v4 (`tailwindcss` & `@tailwindcss/vite`)
* **Why we used it (Kyu use kiya):** React components ko style karne aur application ko ek modern, professional UI/UX dene ke liye.
* **Problem without it (Bina iske kya dikkat aati):** Hamein har page ke styles manually vanilla CSS files mein likhne padte. Responsive layouts (mobile/tablet sizes) ke liye complex media queries likhni padtin, jisse CSS file bohot lambi aur mushkil ho jati.
* **How it resolves the problem (Ye problem kaise door karta hai):** Ye utility-first classes deta hai (jaise `flex`, `grid`, `p-4`, `rounded-xl`). Hum bina koi extra CSS file likhe direct HTML tags ke andar styling kar sakte hain. Tailwind v4 direct Vite plugin ke roop mein integrate ho jata hai, jisse config file ki load khatam ho jati hai.
* **Alternative (Iska alternative kya ho sakta tha):** Custom Vanilla CSS classes, Bootstrap, ya Styled Components (CSS-in-JS).

### 2. Lucide React (`lucide-react`)
* **Why we used it (Kyu use kiya):** Dashboard aur landing page par lightweight, clean aur responsive icons (jaise checking/alert/arrow icons) use karne ke liye.
* **Problem without it (Bina iske kya dikkat aati):** Icons ke liye ya to custom SVG code manually copy-paste karna padta jo JSX code ko messy bana deta, ya fir images upload karni padtin jo web page loading speed ko slow kar detin.
* **How it resolves the problem (Ye problem kaise door karta hai):** Ye lightweight, clean SVGs ko simple React components ke form mein provide karta hai (jaise `<ArrowRight />` ya `<CheckCircle />`), jinhe hum Tailwind classes se directly size aur color de sakte hain.
* **Alternative (Iska alternative kya ho sakta tha):** FontAwesome, Heroicons, ya material icons.

### 3. Recharts (`recharts`)
* **Why we used it (Kyu use kiya):** User ke interview performance analytics (jaise score trends aur strengths/weaknesses graphs) ko dashboard par dynamically render karne ke liye.
* **Problem without it (Bina iske kya dikkat aati):** Charts aur graphs ko raw HTML/CSS/JS canvas par scratch se build karna bohot complex math aur SVG drawing logic demand karta hai. Bina iske user apne statistics visually nahi dekh pata.
* **How it resolves the problem (Ye problem kaise door karta hai):** Ye standard responsive charts (LineChart, BarChart, PieChart) ko React components ke roop mein deta hai, jismein direct MongoDB data array pass karke beautiful graphs ban jate hain.
* **Alternative (Iska alternative kya ho sakta tha):** Chart.js (via react-chartjs-2) ya D3.js (bohot complex/advanced).

---

## Backend Core Libraries

### 4. Express.js (`express`)
* **Why we used it (Kyu use kiya):** HTTP request endpoints (jaise APIs for login, upload, interview) generate karne aur backend application routing manage karne ke liye.
* **Problem without it (Bina iske kya dikkat aati):** Node.js ka inbuilt native `http` server module use karna padta, jismein routing, parsing, headers handling aur middleware structure likhne ke liye hazaron lines ka boilerplate code manually likhna padta.
* **How it resolves the problem (Ye problem kaise door karta hai):** Express routing, middleware pipelines aur request/response management ko simple functions (jaise `app.get()`, `app.post()`) ke through seamless kar deta hai.
* **Alternative (Iska alternative kya ho sakta tha):** Fastify, NestJS (enterprise-heavy), ya raw Node.js HTTP server.

### 5. Mongoose (`mongoose`)
* **Why we used it (Kyu use kiya):** MongoDB Database ke sath collections schema design, relations aur queries manage karne ke liye.
* **Problem without it (Bina iske kya dikkat aati):** Raw MongoDB driver use karne par database mein kisi bhi type ka unstructured format ka data bina input verification ke chala jata. Validation code manually har endpoint par likhna padta.
* **How it resolves the problem (Ye problem kaise door karta hai):** Ye schema-based approach deta hai. Hum define kar sakte hain ki User database document mein `email` strict string aur `password` strict string hi hona chahiye. Mongoose hooks aur helper database queries (jaise `find()`, `create()`) bhi simplify kar deta hai.
* **Alternative (Iska alternative kya ho sakta tha):** MongoDB Native Driver, Prisma ORM.

### 6. Dotenv (`dotenv`)
* **Why we used it (Kyu use kiya):** Port configuration, database password, AI API key aur secrets ko safe environment variables ke through handle karne ke liye.
* **Problem without it (Bina iske kya dikkat aati):** Credentials ko code files mein hardcode karna padta. Jab hum code GitHub par push karte, to secret keys bhi leak ho jatin, jo security ke liye bada risk hai.
* **How it resolves the problem (Ye problem kaise door karta hai):** Ye `.env` files se variables read karke runtime environment variables (`process.env.VARIABLE_NAME`) mein inject kar deta hai. Hamein bas `.env` file ko `.gitignore` mein rakhna hota hai, jisse keys local tak simit rehti hain.
* **Alternative (Iska alternative kya ho sakta tha):** Terminal commands ke throw environment set karna (development mein cumbersome hai).

---

## Authentication & Security Libraries

### 7. JSON Web Token (`jsonwebtoken`)
* **Why we used it (Kyu use kiya):** Session management aur secure, stateless route authentication tokens issue karne ke liye.
* **Problem without it (Bina iske kya dikkat aati):** Agar hum cookie-sessions use karte, to server-memory par load aata. Bina kisi token ke hum login hone ke baad secure routes (jaise profile page) ko access nahi kar paate.
* **How it resolves the problem (Ye problem kaise door karta hai):** Login hone par ek cryptographically signed token browser ko milta hai. Browser is token ke sath request bhejta hai aur backend simple check (verify signature) karke user identity confirm kar leta hai.
* **Alternative (Iska alternative kya ho sakta tha):** Session-cookies database storage ke sath (Redis/Express-Session).

### 8. BcryptJS (`bcryptjs`)
* **Why we used it (Kyu use kiya):** Passwords ko cryptographically hash karne ke liye taaki database secure rahe.
* **Problem without it (Bina iske kya dikkat aati):** Passwords plain text format mein database mein jate, jo high-security failure hai. Agar database access ho gaya, to users ke passwords compromise ho jate.
* **How it resolves the problem (Ye problem kaise door karta hai):** Password ko mathematical salt lagakar strong irreversible hash (encryption) mein convert kar deta hai (jaise `$2b$10$...`).
* **Alternative (Iska alternative kya ho sakta tha):** Node.js native `crypto` module (comparatively complex custom salt codes), `bcrypt` (C++ dependent, install hone mein error aa sakte hain).

### 9. Cookie Parser (`cookie-parser`)
* **Why we used it (Kyu use kiya):** HTTP-only cookie-based tokens ko read karne ke liye taaki access aur refresh token automatically verify ho sakein.
* **Problem without it (Bina iske kya dikkat aati):** Browsers jab secure request header ke through cookies bhejte hain, tab backend par hume `req.headers.cookie` ko complex string parsing logic laga kar verify karna padta.
* **How it resolves the problem (Ye problem kaise door karta hai):** Ye simple parses karke custom object format (`req.cookies`) deta hai, jisse cookies read karna extremely simple ho jata hai.
* **Alternative (Iska alternative kya ho sakta tha):** Manually headers split code likhna.

### 10. Helmet (`helmet`)
* **Why we used it (Kyu use kiya):** Backend Express server ko basic security vulnerabilities (jaise cross-site scripting, clickjacking, aur identity leaks) se bachane ke liye.
* **Problem without it (Bina iske kya dikkat aati):** Express server by default response headers mein `X-Powered-By: Express` header bhejta hai, jisse attackers ko server framework ka pata chal jata hai. Browser bina check kiye kisi file format ko scripts ki tarah run kar sakta hai, jo dangerous ho sakta hai.
* **How it resolves the problem (Ye problem kaise door karta hai):** Helmet response mein 15+ standard HTTP security headers automatically inject kar deta hai, jo server details ko hide karte hain aur browsers ko content secure limits mein execute karne ke instructions dete hain.
* **Alternative (Iska alternative kya ho sakta tha):** Express middleware mein `res.setHeader()` likh kar manually standard security headers configure karna.

### 11. Express Rate Limit (`express-rate-limit`)
* **Why we used it (Kyu use kiya):** API endpoints aur server ko abuse, brute-force attempts aur request overloading se bachane ke liye.
* **Problem without it (Bina iske kya dikkat aati):** Koi bhi user/script looping requests lagakar backend server crash kar sakta hai. Free Google Gemini API requests ka standard quota seconds mein exhaust ho sakta hai.
* **How it resolves the problem (Ye problem kaise door karta hai):** Har client IP par request count metrics set kar deta hai. Agar defined limits (jaise: 15 minutes mein maximum 100 requests) cross hoti hain, to ye aage calls block karke `429 Too Many Requests` error code response return kar deta hai.
* **Alternative (Iska alternative kya ho sakta tha):** Memory caches ya database mein logs update karke custom requests rate control implementation.

---

## Upload & AI Parsing Libraries

### 12. Multer (`multer`)
* **Why we used it (Kyu use kiya):** Frontend form-data request se incoming binary resume files (PDF) upload aur buffer read karne ke liye.
* **Problem without it (Bina iske kya dikkat aati):** Express body parser standard JSON/URL-encoded data read karta hai. Binary stream data body parse nahi kar pata, isliye files read nahi ho patin.
* **How it resolves the problem (Ye problem kaise door karta hai):** Multer binary file chunk parser implement karta hai aur use router handlers ko `req.file` utility format mein pass kar deta hai.
* **Alternative (Iska alternative kya ho sakta tha):** `formidable` ya `express-fileupload`.

### 13. PDF Parse (`pdf-parse`)
* **Why we used it (Kyu use kiya):** PDF document se pure textual formatting read karke string data extract karne ke liye.
* **Problem without it (Bina iske kya dikkat aati):** PDF binary compressed buffer file structure hoti hai. Hamein AI processing ke liye raw string text chahiye hota hai, jo bina read layers ke nahi milta.
* **How it resolves the problem (Ye problem kaise door karta hai):** PDF structure streams ko analyze karta hai aur use readable plain text block strings array mein return karta hai.
* **Alternative (Iska alternative kya ho sakta tha):** `pdf2json` ya cloud-based parsers (jaise Adobe API, Tesseract OCR).

### 14. Google GenAI (`@google/genai`)
* **Why we used it (Kyu use kiya):** Google Gemini API ko clean SDK methods ke throw access karne ke liye (AI interview dynamic question generation aur scoring engine ke liye).
* **Problem without it (Bina iske kya dikkat aati):** Manual REST fetch request URL endpoints aur bodies payloads structure format mein likhne padte, jo hard ho jata aur API update hone par fail ho jata.
* **How it resolves the problem (Ye problem kaise door karta hai):** Inbuilt function SDK tools library deta hai (`ai.models.generateContent`), jisse prompt calls verify aur process simple lines mein ho jati hain.
* **Alternative (Iska alternative kya ho sakta tha):** OpenAI API Client, LangChain framework.

---

## Email & Validation Services

### 15. Zod (`zod`)
* **Why we used it (Kyu use kiya):** Request inputs (e.g. signup data formats, schemas) validate karne ke liye.
* **Problem without it (Bina iske kya dikkat aati):** Nested manually check functions `if(!req.body.email || typeof req.body.email !== 'string')` likhne se backend code messy ho jata aur security loopholes bachte.
* **How it resolves the problem (Ye problem kaise door karta hai):** Ek predefined strict structure schema validation run karta hai aur failure hone par customizable formatted errors auto-response bhej deta hai.
* **Alternative (Iska alternative kya ho sakta tha):** Joi, Express-Validator.

### 16. Nodemailer & Resend (`nodemailer` & `resend`)
* **Why we used it (Kyu use kiya):** Email verification codes aur Password resets transaction updates trigger karne ke liye.
* **Problem without it (Bina iske kya dikkat aati):** User identities, email confirmations check, aur validation link flows trigger nahi ho pate.
* **How it resolves the problem (Ye problem kaise door karta hai):** `resend` library directly SMTP credentials aur verification pipelines interface implement karti hai aur Nodemailer mail send trigger easy formats mein handle karta hai.
* **Alternative (Iska alternative kya ho sakta tha):** SendGrid SDK, Mailgun API.
