import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from '../config/env';
import { Lead } from '../interfaces';

export class SupabaseService {
    private client: SupabaseClient;

    constructor() {
        this.client = createClient(config.supabase.url, config.supabase.key);
    }

    async getCompanies(): Promise<any[]> {
        const { data, error } = await this.client
            .from('companies')
            .select('*');

        if (error) {
            throw new Error(`Supabase error: ${error.message}`);
        }
        return data || [];
    }

    async saveCompanies(leads: Lead[]): Promise<void> {
        if (leads.length === 0) return;

        // Mapping match n8n logic: input is Lead, saved to 'companies' table
        // The n8n node 'save_items_db' maps `dados` -> `$json`.
        // It seems the table 'companies' has a 'dados' column which is JSONB?
        // Let's assume based on n8n (fieldId: "dados", fieldValue: "={{ $json }}")
        // that we insert records where `dados` is the Lead object.

        const rows = leads.map(lead => ({
            dados: lead,
        }));

        const { error } = await this.client
            .from('companies')
            .insert(rows);

        if (error) {
            throw new Error(`Error saving companies: ${error.message}`);
        }
    }

    async updateCrmStatus(document: string, saved: boolean, addedFunnel: boolean, businessUuid?: string): Promise<void> {
        // n8n uses RPC: update_crm_status
        // Params: p_document, p_saved, p_added_funnel, p_uuid_business
        const rpcParams = {
            p_document: document,
            p_saved: saved,
            p_added_funnel: addedFunnel,
            ...(businessUuid && { p_uuid_business: businessUuid }),
        };

        const { error } = await this.client.rpc('update_crm_status', rpcParams);

        if (error) {
            // If RPC fails, try generic update if consistent with "companies" table structure,
            // but RPC likely handles finding the row inside the JSONB 'dados' or similar.
            // Since we don't know the exact internal SQL of the RPC, we stick to RPC.
            // However, looking at leads_ikasa.json, the 'update_db_crm_status' also call RPC.
            throw new Error(`Error updating CRM status: ${error.message}`);
        }
    }
}
