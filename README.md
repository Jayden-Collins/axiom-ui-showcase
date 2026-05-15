# Axiom UI 

An experimental 3D component library built to bring tactile physics to React interfaces.

**[View Live Demo](https://axiom-ui-pink.vercel.app/)**

## ⚙ The Architecture ️
My goal with this project was to create an abstraction layer that allows 3D interactions to be used as simple, copy-paste React components, similar to Shadcn.

* **Framework:** Next.js / React
* **3D Engine:** Three.js / React Three Fiber
* **Physics & Animation:** React Spring
* **Telemetry:** PostHog

**[View Docs](https://axiom-ui-pink.vercel.app/docs)**

## 📖 The Story & Post-Mortem 
I originally built and launched Axiom UI as a premium, commercial UI kit. While the interactive playground showed a **74%+ engagement rate**, which validated the core architectural concept, the launch gave me a much-needed reality check.

* **Open-Source Culture:** The community rightfully pointed out that developers expect foundational component libraries to be open-source and collaborative from day one. Gating a small set of foundational components behind a paywall violated that trust and standard. 
* **The Performance Reality:** While the 3D components look highly polished, the technical reality of shipping `.glb` payloads and a Three.js bundle introduces heavy load times, especially on mobile networks. Ultimately, modern UI libraries must prioritize millisecond render times over visual flair.

Axiom UI now serves as an open-source technical showcase, and a sandbox for anyone interested in integrating 3D physics into standard React applications.

## 🚀 Getting Started
To run the live demo locally:

```bash
npm install
npm run dev
```

## 📄 License
This project is licensed under the MIT License. See the LICENSE.txt file for details. Feel free to use, fork, and experiment.
