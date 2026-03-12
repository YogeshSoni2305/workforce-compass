import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIRS_TO_CHECK = [
    path.join(__dirname, "src/components"),
    path.join(__dirname, "src/pages"),
    path.join(__dirname, "src/hooks"),
    path.join(__dirname, "src/store"),
];

const TRIGGERS = [
    "useState",
    "useEffect",
    "useRef",
    "useCallback",
    "useMemo",
    "useContext",
    "useReducer",
    "useLayoutEffect",
    "react-hook-form",
    "framer-motion",
    "reactflow",
    "recharts",
    "@tanstack/react-query",
    "zustand",
    "useSimulationStore", // custom hook from store
    "useParams",
    "usePathname",
    "useRouter",
    "useSearchParams",
    "next/navigation",
    "useToast",
    "useMobile",
    "sonner", // typically toast uses client
    "react-day-picker",
    "embla-carousel-react",
];

function processDirectory(directory) {
    if (!fs.existsSync(directory)) return;

    const files = fs.readdirSync(directory);
    for (const file of files) {
        const fullPath = path.join(directory, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith(".tsx") || fullPath.endsWith(".ts")) {
            const content = fs.readFileSync(fullPath, "utf-8");

            // if already has "use client", skip
            if (content.startsWith('"use client"') || content.startsWith("'use client'")) {
                continue;
            }

            // Check if it matches any triggers
            let needsClient = false;
            for (const trigger of TRIGGERS) {
                if (content.includes(trigger)) {
                    needsClient = true;
                    break;
                }
            }

            // All shadcn ui components inside components/ui that use React things generally need use client
            if (fullPath.includes("/components/ui/") && (content.includes("React.") || content.includes("@radix-ui"))) {
                needsClient = true;
            }

            if (needsClient) {
                fs.writeFileSync(fullPath, `"use client"\n\n${content}`);
                console.log(`Added "use client" to ${fullPath}`);
            }
        }
    }
}

for (const dir of DIRS_TO_CHECK) {
    processDirectory(dir);
}
console.log("Done adding use client directives.");
