<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/leaf.svg" width="80" height="80" alt="EcoTrack Logo" style="margin-bottom: 20px" />
  
  # 🌱 EcoTrack (new-eco-track)

  **An AI-Powered Sustainability & Eco-Tracking Dashboard**

  [![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat&logo=next.js)](https://nextjs.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-8.2-316192?style=flat&logo=postgresql)](https://postgresql.org/)
  [![Drizzle ORM](https://img.shields.io/badge/Drizzle-ORM-C5F74F?style=flat&logo=drizzle)](https://orm.drizzle.team/)
  [![Gemini AI](https://img.shields.io/badge/Google-Gemini_AI-4285F4?style=flat&logo=google)](https://ai.google.dev/)
</div>

<br />

Welcome to **EcoTrack**, a modern, highly interactive web application designed to help you monitor, analyze, and optimize your environmental footprint. Built with a cutting-edge tech stack, it provides real-time insights, stunning visualizations, and AI-driven recommendations.

---

## ✨ Key Features

- **📊 Beautiful Visualizations**: Interactive charts powered by **Recharts** to track your carbon footprint over time.
- **🤖 AI Insights**: Get personalized eco-friendly tips and data analysis using **Google Gemini AI**.
- **⚡ Blazing Fast**: Built on **Next.js 16** with React 19 for maximum performance and SEO readiness.
- **🎨 Stunning UI**: Modern, glassmorphism-inspired design crafted with **TailwindCSS 4** and animated fluidly via **Framer Motion**.
- **💾 Robust Database**: Type-safe database interactions with **Drizzle ORM** and **PostgreSQL**.
- **🛠️ State Management**: Seamless and predictable state management using **Zustand**.

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js (v18+) and PostgreSQL installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/new-eco-track.git
   cd new-eco-track
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory and configure your database and API keys:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/ecotrack
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run Database Migrations:**
   ```bash
   npm run typecheck
   npx drizzle-kit push
   ```

5. **Start the Development Server:**
   ```bash
   npm run dev
   ```

6. **Open the App:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Tech Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | Next.js 16 (React 19) |
| **Styling** | TailwindCSS 4.1 |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **Database** | PostgreSQL |
| **ORM** | Drizzle ORM |
| **State Management** | Zustand |
| **Charts** | Recharts |
| **AI Integration** | Google Generative AI (Gemini) |
| **Validation** | Zod |

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](#) if you want to contribute.

## 📄 License

This project is licensed under the MIT License.

---
<div align="center">
  <i>Built with ❤️ for a greener future.</i>
</div>