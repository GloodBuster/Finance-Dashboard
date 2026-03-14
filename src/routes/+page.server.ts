import { env } from '$env/dynamic/private';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    try {
        // Armamos la URL inyectando el token secreto
        const apiUrl = `${env.PRIVATE_GOOGLE_SCRIPT_URL}?token=${env.PRIVATE_SHEETS_TOKEN}`;

        const response = await fetch(apiUrl);
        const result = await response.json();

        if (result.status === 'success') {
            return {
                financeData: result.data,
                error: null
            };
        } else {
            return {
                financeData: null,
                error: result.message || "Error desconocido en el script."
            };
        }
    } catch (error: any) {
        return {
            financeData: null,
            error: `Error de red o conexión: ${error.message}`
        };
    }
};