import {
    PiggyBank,
    ShieldAlert,
    Gift,
    Receipt,
    Plane,
    ShoppingBag,
    Dumbbell,
    Tag
} from 'lucide-svelte';

// 1. Tus categorías principales con colores e íconos perfectos
export const categoryColorsMap: Record<string, string> = {
    'ahorro: compra grande': 'bg-cyan-700 text-white dark:bg-cyan-900 dark:text-cyan-300',
    'ahorro: fondo emergencia': 'bg-green-800 text-white dark:bg-green-950 dark:text-green-400',
    'salidas y caprichos': 'bg-blue-500 text-white dark:bg-blue-900/80 dark:text-blue-300',
    'suscripciones': 'bg-red-500 text-white dark:bg-red-900/80 dark:text-red-300',
    'ahorro: viaje': 'bg-teal-400 text-teal-950 dark:bg-teal-900/80 dark:text-teal-300',
    'compra timida': 'bg-orange-200 text-orange-950 dark:bg-orange-900/60 dark:text-orange-300',
    'gimnasio': 'bg-zinc-900 text-white dark:bg-zinc-200 dark:text-zinc-900',
};

// 2. Una paleta de colores de "Respaldo" para categorías nuevas que agregues en el futuro
const fallbackPalette = [
    'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/70 dark:text-indigo-300',
    'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/70 dark:text-fuchsia-300',
    'bg-lime-100 text-lime-800 dark:bg-lime-900/70 dark:text-lime-300',
    'bg-sky-100 text-sky-800 dark:bg-sky-900/70 dark:text-sky-300',
    'bg-pink-100 text-pink-800 dark:bg-pink-900/70 dark:text-pink-300',
    'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/70 dark:text-emerald-300',
    'bg-purple-100 text-purple-800 dark:bg-purple-900/70 dark:text-purple-300'
];

// Función matemática para generar siempre el mismo índice basado en un texto
function stringToHashIndex(str: string, maxIndex: number) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash) % maxIndex;
}

export function getIconoCategoria(categoria: string) {
    const cat = categoria.toLowerCase().trim();
    if (cat.includes('compra grande')) return PiggyBank;
    if (cat.includes('emergencia')) return ShieldAlert;
    if (cat.includes('salidas y caprichos')) return Gift;
    if (cat.includes('suscripciones')) return Receipt;
    if (cat.includes('viaje')) return Plane;
    if (cat.includes('compra timida') || cat.includes('tímida')) return ShoppingBag;
    if (cat.includes('gimnasio')) return Dumbbell;

    // Ícono genérico bonito para cualquier categoría nueva
    return Tag;
}

export function getEstiloCategoria(categoria: string) {
    if (!categoria) return 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-400';

    const cat = categoria.toLowerCase().trim();

    // Si la conocemos, damos su color exacto
    if (categoryColorsMap[cat]) {
        return categoryColorsMap[cat];
    }

    // Si es NUEVA, calculamos un color de la paleta de respaldo que SIEMPRE será el mismo para esa palabra
    const index = stringToHashIndex(cat, fallbackPalette.length);
    return fallbackPalette[index];
}

// --- DICCIONARIO HEXADECIMAL PARA GRÁFICOS (CHART.JS) ---

export const categoryHexMap: Record<string, string> = {
    'ahorro: compra grande': '#0e7490', // cyan-700
    'ahorro: fondo emergencia': '#166534', // green-800
    'salidas y caprichos': '#3b82f6', // blue-500
    'suscripciones': '#ef4444', // red-500
    'ahorro: viaje': '#2dd4bf', // teal-400
    'compra timida': '#fdba74', // orange-300 (Ligeramente más oscuro para que se lea bien en la dona)
    'gimnasio': '#27272a', // zinc-800
    'otros': '#a1a1aa' // zinc-400
};

// Paleta hexadecimal de respaldo que coincide exactamente con los colores fallback de Tailwind
const fallbackHexPalette = [
    '#818cf8', // indigo
    '#e879f9', // fuchsia
    '#a3e635', // lime
    '#38bdf8', // sky
    '#f472b6', // pink
    '#34d399', // emerald
    '#c084fc'  // purple
];

export function getHexCategoria(categoria: string) {
    if (!categoria) return categoryHexMap['otros'];

    const cat = categoria.toLowerCase().trim();

    // Si la conocemos, damos su color hexadecimal exacto
    if (categoryHexMap[cat]) {
        return categoryHexMap[cat];
    }

    // Si es NUEVA, calculamos el color de respaldo con la misma función matemática
    // Asegúrate de tener la función stringToHashIndex definida arriba en tu archivo
    const index = stringToHashIndex(cat, fallbackHexPalette.length);
    return fallbackHexPalette[index];
}
