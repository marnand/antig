import axios from 'axios';
import { config } from '../config/env';
import { CnpjaResponseItem } from '../interfaces';

export class CnpjaService {
    private baseUrl: string;
    private apiKey: string;

    constructor() {
        this.baseUrl = config.cnpja.url;
        this.apiKey = config.cnpja.key;
    }

    async fetchNewCompanies(): Promise<CnpjaResponseItem[]> {
        // Logic from n8n:
        // founded.gte: yesterday
        // founded.lte: today
        // address.state.in: "MA"
        // limit: 20

        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const formatDate = (date: Date) => date.toISOString().split('T')[0];

        const query = {
            'founded.gte': formatDate(yesterday),
            'founded.lte': formatDate(today),
            'address.state.in': 'MA',
            'limit': 20,
        };

        try {
            const response = await axios.get(this.baseUrl, {
                headers: {
                    'Authorization': this.apiKey, // Type: httpHeaderAuth in n8n usually means custom header or Auth header
                    'Content-Type': 'application/json',
                    'User-Agent': 'Ikasa-Leads-Automation/1.0',
                },
                params: query,
            });

            return response.data.records || [];
        } catch (error: any) {
            console.error('Error fetching from CNPJA:', error.message);
            return [];
        }
    }
}
