# NutriLens AI 

NutriLens AI is a modern, web-based nutrition assistant that uses the power of Google's Gemini AI to help you understand your meals and get personalized dietary advice. Simply upload a photo of your food to get an instant nutritional breakdown, or generate a full day's diet plan tailored to your specific health needs.

## App Screenshots

### Home Screen
![Home Scree](https://raw.githubusercontent.com/sugar-spice-12/NUTRILENS-AI/main/home_page.png)

### Food Detection Example
![Food Detection](https://raw.githubusercontent.com/sugar-spice-12/NUTRILENS-AI/main/food_detection_result.png)

### Personalized Diet Advice
![Diet Advice](https://raw.githubusercontent.com/sugar-spice-12/NUTRILENS-AI/main/diet_advice.png)


---

## Core Features

*   **AI Meal Analysis:** Upload a picture of your meal, and the AI will identify the food items (with a focus on Indian cuisine) and estimate their nutritional content (calories, protein, carbs, and fats).
*   **Personalized Diet Plans:** Based on your selected health conditions (like Diabetes, PCOS, High Blood Pressure, etc.), the app generates a complete one-day Indian diet plan.
*   **Nutrition Dashboard:** A clean dashboard summarizes your daily intake, tracks your logged meals, and provides easy navigation.
*   **Modern & Responsive UI:** Built with Tailwind CSS, the interface is clean, intuitive, and works beautifully on both desktop and mobile devices.
*   **Zero-Build Setup:** Runs directly in the browser using modern JavaScript features like ES Modules and `importmap`, requiring no complex build tools like Webpack or Vite.

---

## Tech Stack

*   **Frontend:** React 19 (with TypeScript & JSX)
*   **AI Engine:** Google Gemini API (`gemini-2.5-flash`) via `@google/genai` SDK
*   **Styling:** Tailwind CSS (via CDN)
*   **Local Development:** `npx serve` (a simple, zero-configuration static server)

---

## Getting Started

Follow these instructions to get the project running on your local machine.

### Prerequisites

You need to have [Node.js](https://nodejs.org/) installed on your computer. This is only required to use `npx`, which is a tool that comes with `npm` (Node Package Manager) to run the local web server.

### Installation & Setup

**1. Clone the Repository**

First, clone the project to your local machine using Git:
```bash
git clone <repository-url>
cd <project-directory>
```

**2. Configure Your API Key**

This project requires a Google Gemini API key to function.

*   Get your free API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
*   In the project's root directory, you will find a file named `env.js`. Open it.
*   Replace the placeholder text `"YOUR_API_KEY_HERE"` with your actual API key.

```javascript
// env.js

window.process = {
  env: {
    // IMPORTANT: Replace "YOUR_API_KEY_HERE" with your actual Google AI API key.
    API_KEY: 'YOUR_API_KEY_HERE',
  }
};
```
**Important:** Do not commit your API key to a public repository. The `.gitignore` file should be configured to ignore `env.js` if this were a larger project.

**3. Run the Local Server**

Open your terminal in the project's root directory and run the following command:

```bash
npx serve
```

This command starts a simple web server. You should see output similar to this in your terminal:

```
   ┌──────────────────────────────────────────────────┐
   │                                                  │
   │   Serving!                                       │
   │                                                  │
   │   - Local:    http://localhost:3000              │
   │   - Network:  http://192.168.1.100:3000          │
   │                                                  │
   │   Copied local address to clipboard!             │
   │                                                  │
   └──────────────────────────────────────────────────┘
```

**4. Open the App**

Open your web browser and navigate to the "Local" address shown in the terminal, which is usually **[http://localhost:3000](http://localhost:3000)**.

You should now see the NutriLens AI application running!

---

## 📂 Project Structure

```
.
├── components/           # Reusable React components
│   ├── common/           # Basic UI elements (Button, Card, etc.)
│   ├── Dashboard.tsx       # Main dashboard view
│   ├── DietPlan.tsx        # AI diet plan view
│   ├── HealthProfileForm.tsx # Initial health setup screen
│   └── MealScanner.tsx     # Meal image upload and analysis view
├── services/             # Modules for external API calls
│   └── geminiService.ts    # All interaction with the Gemini API
├── App.tsx               # Main application component, handles routing and state
├── constants.ts          # Application-wide constants (e.g., health conditions)
├── env.js                # Environment configuration (API Key)
├── index.html            # The single HTML page entry point (with importmap)
├── index.tsx             # The root of the React application
├── metadata.json         # App metadata
├── README.md             # You are here!
└── types.ts              # Core TypeScript type definitions
```

