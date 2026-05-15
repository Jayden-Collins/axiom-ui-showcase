import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function DocsPage() {
    return (
        <div className="w-full text-black">
            <div className="sticky top-0 bg-white/80 backdrop-blur-md">
                <div className="max-w-3xl mx-auto px-6 pt-3 pb-1">
                    <Link href="/" className="inline-flex items-center w-fit">
                        <ChevronLeft strokeWidth={2} color="#9834c7" size={32}/>
                        <p className="font-semibold font-sans">Back</p>
                    </Link>
                </div>
            </div>
            <div className="flex flex-col max-w-2xl mx-auto gap-4 px-6 py-12 font-sans">
                <h1 className="text-4xl md:text-6xl font-black">Documentation</h1>
                <p>This library is designed to give you drop-in, high-fidelity 3D components that work across any modern React environment.</p>
                <p>Here is your quick-start guide to getting the components running in your project in under 2 minutes.</p>
                <h1 className="mt-2 text-2xl font-bold">1. Install Dependencies</h1>
                <p>Axiom relies on React Three Fiber and Three.js for native WebGL rendering.</p>
                <p>Run this in your {`project's`} terminal:</p>
                <pre
                    className="text-xs font-mono mx-0.5 text-gray-600 p-2 bg-gray-100 border border-gray-200 rounded-lg overflow-x-auto"
                >
                    npm install three @react-three/fiber @react-three/drei @react-spring/three
                    <br />npm install -D @types/three
                </pre>
                <p className="italic text-sm text-gray-500"><strong>Note:</strong> Ensure you have Tailwind CSS installed in your project, as Axiom uses standard Tailwind utility classes for layout and styling.</p>
                <h1 className="mt-2 text-2xl font-bold">2. Static 3D Assets</h1>
                <p>Next.js, Vite, and Create React App all require static assets to be served from a <code
                        className="bg-zinc-100 px-1 py-0.5 mx-0.5 rounded border border-zinc-200 text-zinc-700 font-mono text-xs"
                    >
                        public
                    </code> directory.</p>
                <p>Drag the entire contents of the Axiom <code
                        className="bg-zinc-100 px-1 py-0.5 mx-0.5 rounded border border-zinc-200 text-zinc-700 font-mono text-xs"
                    >
                        public/models
                    </code> folder directly into your {`project's`} <code
                        className="bg-zinc-100 px-1 py-0.5 mx-0.5 rounded border border-zinc-200 text-zinc-700 font-mono text-xs"
                    >
                        public/models
                    </code> directory.</p>
                <p>If you skip this step, the 3D components will fail to load their <code
                        className="bg-zinc-100 px-1 py-0.5 mx-0.5 rounded border border-zinc-200 text-zinc-700 font-mono text-xs"
                    >
                        .glb
                    </code> files and the canvas will remain blank.</p>
                <h1 className="mt-2 text-2xl font-bold">3. Adding Components</h1>
                <p>Axiom components are designed to be completely modular. You do not need to install the whole library — just copy the files you want into your {`project's`} components directory.</p>
                <h2 className="text-xl font-bold">Standard UI Components</h2>
                <p>Copy single files like <code
                        className="bg-zinc-100 px-1 py-0.5 mx-0.5 rounded border border-zinc-200 text-zinc-700 font-mono text-xs"
                    >
                        Button.tsx
                    </code> or <code
                        className="bg-zinc-100 px-1 py-0.5 mx-0.5 rounded border border-zinc-200 text-zinc-700 font-mono text-xs"
                    >
                        InputField.tsx
                    </code> and import them normally.</p>
                <h2 className="text-xl font-bold">3D Components</h2>
                <p>3D components like the Toggle are packaged in their own folders to handle Server-Side Rendering (SSR) safety automatically.</p>
                <p>Copy the entire <code
                        className="bg-zinc-100 px-1 py-0.5 mx-0.5 rounded border border-zinc-200 text-zinc-700 font-mono text-xs"
                    >
                        Toggle
                    </code> folder into your <code
                        className="bg-zinc-100 px-1 py-0.5 mx-0.5 rounded border border-zinc-200 text-zinc-700 font-mono text-xs"
                    >
                        components
                    </code> directory.</p>
                <p>Import it by referencing the folder (which automatically targets the universal <code
                        className="bg-zinc-100 px-1 py-0.5 mx-0.5 rounded border border-zinc-200 text-zinc-700 font-mono text-xs"
                    >
                        index.tsx
                    </code> wrapper):</p>
                <pre
                    className="text-xs font-mono text-gray-600 p-2 bg-gray-100 border border-gray-200 rounded-lg overflow-x-auto"
                >
                    {`/* Example Import */
import { Toggle } from "@/components/Toggle";

export default function MyPage() {
    return (
        <Toggle
            active={true}
            onClick={() => console.log('Toggled')}
        />
    )
}`}
                </pre>
                <h1 className="mt-2 text-2xl font-bold">4. Framework Compatibility</h1>
                <p>Axiom Pro is built with Universal React.</p>
                <p><strong>SSR & 3D:</strong> Our 3D component wrappers use standard synchronous imports guarded by React {`18's`} <code
                        className="bg-zinc-100 px-1 py-0.5 mx-0.5 rounded border border-zinc-200 text-zinc-700 font-mono text-xs"
                    >
                        useSyncExternalStore
                    </code>. They are completely safe for Server-Side Rendered environments (Next.js/Remix) and strictly Client-Side environments (Vite) out of the box.</p>
                <p><strong>Routing:</strong> Components use standard <code
                        className="bg-zinc-100 px-1 py-0.5 mx-0.5 rounded border border-zinc-200 text-zinc-700 font-mono text-xs"
                    >
                        {`<a>`}
                    </code> tags to ensure cross-framework compatibility. If you are exclusively using Next.js, feel free to swap these for <code
                        className="bg-zinc-100 px-1 py-0.5 mx-0.5 rounded border border-zinc-200 text-zinc-700 font-mono text-xs"
                    >
                        {`<Link>`}
                    </code>.</p>
                <h1 className="mt-2 text-2xl font-bold">5. Design Assets</h1>
                <p>In the <code
                        className="bg-zinc-100 px-1 py-0.5 mx-0.5 rounded border border-zinc-200 text-zinc-700 font-mono text-xs"
                    >
                        design-assets
                    </code> folder, you will find the raw <code
                        className="bg-zinc-100 px-1 py-0.5 mx-0.5 rounded border border-zinc-200 text-zinc-700 font-mono text-xs"
                    >
                        .blend
                    </code> files and unoptimized <code
                        className="bg-zinc-100 px-1 py-0.5 mx-0.5 rounded border border-zinc-200 text-zinc-700 font-mono text-xs"
                    >
                        .glb
                    </code> files. These are provided so you can modify materials, lighting, or base geometry in Blender if you wish to customize the aesthetic before exporting.</p>
                <h1 className="mt-2 text-2xl font-bold text-[#9834c7] border-l-4 border rounded-lg p-2 shadow-md bg-[#9834c7]/10">Enjoy Building! 🧑🏻‍💻</h1>
            </div>
        </div>
    )
}
