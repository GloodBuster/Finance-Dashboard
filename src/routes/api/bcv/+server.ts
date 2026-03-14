import { json } from '@sveltejs/kit';
import * as cheerio from 'cheerio';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export async function GET() {
    try {
        const response = await fetch('https://www.bcv.org.ve/', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122.0.0.0 Safari/537.36'
            }
        });

        const html = await response.text();
        const $ = cheerio.load(html);

        const rateText = $('#dolar strong').text().trim().replace(',', '.');
        const rate = parseFloat(rateText);

        if (isNaN(rate)) {
            throw new Error('No se pudo interpretar la tasa');
        }

        return json({ rate, status: 'success' });
    } catch (error) {
        console.error('Error haciendo scraping al BCV:', error);
        return json({ status: 'error', message: 'No se pudo obtener la tasa' }, { status: 500 });
    }
}