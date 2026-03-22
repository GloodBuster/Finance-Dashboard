import { env } from '$env/dynamic/private';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    try {
        // Le pedimos específicamente el historial a tu script
        const apiUrl = `${env.PRIVATE_GOOGLE_SCRIPT_URL}?token=${env.PRIVATE_SHEETS_TOKEN}&action=historial`;

        const response = await fetch(apiUrl);
        const result = await response.json();

        if (result.status === 'success') {
            return {
                movimientos: result.data,
                error: null
            };
        } else {
            return {
                movimientos: [],
                error: result.message || "Error al cargar el historial."
            };
        }
    } catch (error: any) {
        return {
            movimientos: [],
            error: `Error de red o conexión: ${error.message}`
        };
    }
};