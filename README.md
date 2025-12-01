# 📊 Sales Dashboard – Frontend Engineer Assessment

A responsive **Sales Analytics Dashboard** built with **React.js**.  
The dashboard fetches sales data from a backend API and includes filtering, sorting, charting, and pagination features.

---

## 🚀 Tech Stack

- **React.js** – UI framework
- **SWR** – Data fetching & caching
- **Fetch API** – HTTP requests
- **Recharts** – Data visualization
- **Tailwind CSS** – Styling

---

## ✅ Features

### 🔐 Authorization
- Uses `POST /getAuthorize` to obtain the authorization token before fetching sales data

### 🔍 Filters
All API-powered filters with automatic data reload:
- **Start Date** – Filter sales from a specific date
- **End Date** – Filter sales until a specific date
- **Minimum Price** – Filter by price threshold
- **Customer Email** – Search by customer email
- **Phone Number** – Search by phone number

### 📈 Time-Series Chart
- Responsive sales chart displaying **Total Sales Over Time**
- Visual representation of sales trends

### 📋 Sales Table
- Displays **50 items per page**
- API-powered pagination with tokens:
  - `before` – Previous page
  - `after` – Next page

### ↕️ Sorting
Dynamic sorting capabilities:
- **Date** – Chronological ordering
- **Price** – Value-based ordering

Both ascending and descending order supported.

### ⚡ Bonus Features
- **SWR Caching** – Instant loading when returning to previously viewed filters/pages
- **Full Responsiveness** – Optimized for desktop, tablet, and mobile devices
- **Clean Code Architecture** – Modular and maintainable component structure

---

## 🏗️ Project Structure
```
salesAnalytics/
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── postcss.config.js
├── README.md
├── sales.png
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   ├── vite-env.d.ts
│   ├── components/
│   │   ├── FilterPanel.tsx
│   │   ├── SalesChart.tsx
│   │   ├── SalesTable.tsx
│   │   └── styles/
│   │       └── FilterPanel.css
│   ├── hooks/
│   │   └── useSalesData.ts
│   ├── services/
│   │   └── api.ts
│   └── types/
│       └── index.ts
├── tailwind.config.js
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

---

## 🔧 Setup & Run

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/mahmudul-noman/salesAnalytics.git
cd salesAnalytics
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Start the Development Server
```bash
npm run dev
```

The application will run at **[http://localhost:5173](http://localhost:5173)**

---

## 🌐 Live Demo & Repository

### 🔗 Live Application
**[View Live Demo](https://sales-analytics-rho.vercel.app/)**

### 📦 GitHub Repository
**[View Source Code](https://github.com/mahmudul-noman/salesAnalytics)**

---

## 🧑‍💻 Developer Notes

- ⏱️ **Total Development Time:** ~4 hours
  - API integration & logic: 1.5–2 hours
  - UI/UX, responsiveness, and code refinement: 2–2.5 hours
- 🎯 **Focus Areas:**
  - Clean, reusable React component architecture
  - Responsive design for all screen sizes
  - Optimal code readability and maintainability
  - Efficient data fetching with SWR caching

---

## 📞 Contact

**Developer:** Mahmudul Hasan Noman
**LinkedIn:** [linkedin.com/in/mahmudul-noman](https://www.linkedin.com/in/mahmudul-noman/)  
**GitHub:** [github.com/mahmudul-noman](https://github.com/mahmudul-noman)

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---