# Sejal Soni - Developer Portfolio 🚀

Welcome to my personal developer portfolio! This project is a fully responsive, modern web application designed to showcase my skills, projects, and experiences as a Full-Stack Web Developer specializing in the MERN stack.

![Portfolio Preview](assets/og-image.jpg) <!-- Update this path if you add a real screenshot later -->

## ✨ Features

- **Interactive UI/UX**: Built with fluid micro-animations, scroll reveals, and a clean glassmorphism aesthetic.
- **Dynamic Firebase Backend**: The contact form is integrated directly with Firebase Firestore, allowing real-time global message delivery without a local Node server.
- **Dark/Light Mode**: Fully integrated theme toggling to respect user preferences.
- **Custom Cursor & Particle Physics**: A constellation-style particle system on the hero canvas that reacts to mouse movements.
- **Performance Optimized**: Zero heavy frontend frameworks used for the core UI, resulting in near-instant load times. SEO and accessibility best practices implemented.

## 🛠️ Technology Stack

- **Frontend**: HTML5, Vanilla CSS3 (Custom Variables, Flexbox, Grid), Vanilla JavaScript (ES6+)
- **Backend/Database**: Firebase (Cloud Firestore SDK v10)
- **Icons & Typography**: FontAwesome, Google Fonts (Inter, Outfit, Fira Code)
- **Deployment**: Vercel & GitHub Pages ready.

## 🚀 Quick Start (Local Development)

To run this project locally on your machine:

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sejalsoni30/sejal-portfolio.git
   cd sejal-portfolio
   ```

2. **Configure Firebase (Required for Contact Form)**
   Open `script.js` and locate the `firebaseConfig` block at the top of the file. Update the variables with your own Firebase project configuration:
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     projectId: "YOUR_PROJECT_ID",
     ...
   };
   ```

3. **Serve the Application**
   Since this uses ES Modules for Firebase, it must be served over `http://` or `https://` (not `file://`).
   Use any local server tool, such as Node's `serve`:
   ```bash
   npx serve -l 3000
   ```
   Open `http://localhost:3000` in your browser.

## 📬 Contact & Links

- **GitHub**: [@Sejalsoni30](https://github.com/Sejalsoni30)
- **LinkedIn**: [Sejal Soni](https://www.linkedin.com/in/sejal-soni-361897303)
- **Email**: sejalsoni372@gmail.com

---
*Designed & Built with passion by Sejal Soni.*
