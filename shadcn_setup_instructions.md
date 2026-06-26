# shadcn, Tailwind CSS & TypeScript Setup Guide

This guide explains how to migrate or set up a React/Next.js project that supports shadcn components like the interactive `flow-gradient-hero-section.tsx` component.

---

## 1. Project Initialization

If you don't have an existing React/Next.js codebase, the easiest way to start is using Next.js with TypeScript and Tailwind CSS configured automatically.

Run the following command in your terminal:
```bash
npx create-next-app@latest my-portfolio --typescript --tailwind --eslint
```

During the setup prompt, select these options:
- **Would you like to use src/ directory?** Yes (recommended) or No
- **Would you like to use App Router?** Yes (recommended)
- **Would you like to customize the default import alias?** Yes (recommended, set to `@/*`)

---

## 2. Setting Up shadcn/ui

Once your project is created and you are in the project folder, initialize shadcn:

```bash
npx shadcn@latest init
```

The CLI will ask you configuration questions:
- **Which style would you like to use?** Default
- **Which color would you like to use as base color?** Slate / Neutral / Zinc
- **Would you like to use CSS variables for colors?** Yes
- **Where is your global CSS file?** `src/app/globals.css` (or `app/globals.css`)
- **Where is your tailwind.config.js?** `tailwind.config.js` or `tailwind.config.ts`
- **Configure the import alias for components:** `@/components`
- **Configure the import alias for utils:** `@/lib/utils`

This will generate the required configuration files and folders, including the default component paths.

---

## 3. Why `/components/ui` is Important

When working with shadcn/ui:
- **Base UI Primitive Layer**: The `/components/ui` folder is designated as the place where the shadcn CLI installs all its low-level base primitives (e.g., buttons, inputs, dialogs, sliders, etc.).
- **Auto-managed by CLI**: When you run `npx shadcn@latest add button`, the CLI automatically downloads the button component code and places it directly into `/components/ui/button.tsx`.
- **Architectural Separation**: Keeping raw, reusable primitives in `/components/ui` separates them from your custom feature components (e.g., `components/sidebar.tsx`, `components/flow-gradient-hero-section.tsx`) and page-level layouts. This makes it easy to update base components via the CLI without risking breaking changes in your custom design elements.

---

## 4. Installing the Component & Dependencies

The Liquid Gradient section requires Three.js for WebGL shader rendering. Install Three.js and TypeScript types:

```bash
npm install three
npm install --save-dev @types/three
```

Since we have created the file at `/components/ui/flow-gradient-hero-section.tsx`, you can import it anywhere in your pages.

---

## 5. Usage Example

To render this hero section in your Next.js project, update your main page (e.g., `src/app/page.tsx`):

```tsx
import { Component as FlowGradientHero } from "@/components/ui/flow-gradient-hero-section";

export default function Home() {
  const handleCtaClick = () => {
    console.log("CTA Clicked!");
  };

  return (
    <main className="relative min-h-screen w-full bg-slate-950 overflow-hidden">
      <FlowGradientHero 
        title="Rudrant Joshi"
        ctaText="View My Work"
        onCtaClick={handleCtaClick}
        showPauseButton={true}
      />
    </main>
  );
}
```
