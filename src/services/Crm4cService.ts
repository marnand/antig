import axios from 'axios';
import { config } from '../config/env';
import { Lead } from '../interfaces';

export class Crm4cService {
    private baseUrl: string;
    private token: string;
    private userUuid: string;

    // Hardcoded IDs from n8n - consider moving to config if they change often
    private readonly PIPELINE_ID = '48fbb126-0129-42c4-824d-97d5511a3330';
    private readonly STAGE_ID = '0375d939-66fb-4b46-9514-4a0b787d3d00';

    constructor() {
        this.baseUrl = config.crm4c.url;
        this.token = config.crm4c.token;
        this.userUuid = config.crm4c.userUuid;
    }

    private get headers() {
        return {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json',
            'User-Agent': 'Ikasa-Leads-Automation/1.0',
            'X-User-Uuid': this.userUuid,
        };
    }

    async createCustomer(lead: Lead): Promise<string> {
        const body = {
            name: lead.name,
            email: lead.email,
            cellphone: lead.cellphone,
            isLead: 1,
            business: {
                name: lead.business.name,
                document: lead.business.document,
                initialDateRecurrence: lead.business.initialDateRecurrence,
                taxRegime: "SIMPLES NACIONAL",
                address: {
                    zipCode: lead.business.address.zipCode,
                    street: lead.business.address.street,
                    number: lead.business.address.number,
                    district: lead.business.address.district,
                    city: lead.business.address.city,
                    uf: lead.business.address.uf,
                }
            }
        };

        try {
            const response = await axios.post(`${this.baseUrl}/customers/store`, body, {
                headers: this.headers,
            });

            // Based on n8n usage: $json.data.uuid
            if (response.data && response.data.data && response.data.data.uuid) {
                return response.data.data.uuid;
            }
            throw new Error('UUID not found in CRM response');
        } catch (error: any) {
            throw new Error(`Error creating customer in 4C: ${error.message} - ${JSON.stringify(error.response?.data)}`);
        }
    }

    async createCard(lead: Lead, customerUuid: string): Promise<void> {
        const url = `${this.baseUrl}/cards/${this.PIPELINE_ID}/${this.STAGE_ID}/store`;

        const body = {
            title: lead.business.name,
            value: "0.00",
            customerUuid: customerUuid,
            responsibleUuid: this.userUuid,
            origin: "AUTOMAÇÃO",
            indicatedBy: "",
            sdr: "",
            temperature: "FRIO"
        };

        try {
            await axios.post(url, body, {
                headers: this.headers,
            });
        } catch (error: any) {
            throw new Error(`Error creating card in 4C: ${error.message}`);
        }
    }
}
