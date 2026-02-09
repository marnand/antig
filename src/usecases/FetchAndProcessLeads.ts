import { SupabaseService } from '../services/SupabaseService';
import { CnpjaService } from '../services/CnpjaService';
import { ProcessUnprocessedLeads } from './ProcessUnprocessedLeads';
import { formatCnpjaResponse } from '../utils/formatters';

export class FetchAndProcessLeads {
    constructor(
        private supabase: SupabaseService,
        private cnpja: CnpjaService,
        private processor: ProcessUnprocessedLeads
    ) { }

    async execute() {
        console.log('Starting execution cycle...');

        // 1. Check if DB is empty (or has rows)
        const allCompanies = await this.supabase.getCompanies();
        console.log(`Found ${allCompanies.length} companies in DB.`);

        if (allCompanies.length === 0) {
            console.log('DB is empty. Fetching from CNPJA...');
            // 2. Fetch from CNPJA
            const rawData = await this.cnpja.fetchNewCompanies();
            console.log(`Fetched ${rawData.length} records from CNPJA.`);

            if (rawData.length > 0) {
                // 3. Format
                const formattedLeads = formatCnpjaResponse(rawData);

                // 4. Save to DB
                console.log('Saving to DB...');
                await this.supabase.saveCompanies(formattedLeads);

                // 5. Process them immediately (as per n8n flow "return_items_no_process" -> "execute_unprocessed")
                // Note: returning from formatCnpjaResponse doesn't have UUIDs yet, but execute_unprocessed handles !saved logic
                // which will call createCustomer -> get UUID -> update DB.

                // We pass the formatted leads to the processor. 
                // NOTE: The processor expects them to be in the interface format.
                await this.processor.execute(formattedLeads);
            }
        } else {
            console.log('DB is not empty. Checking for unprocessed items...');
            // 6. Filter unprocessed
            // n8n: saved=false OR addedFunnel=false
            // The `allCompanies` from getCompanies() are likely raw DB rows.
            // We assumed structure: row has `dados` column (JSON) based on previous analysis.
            // We need to map them back to Lead objects.

            const unprocessed = allCompanies
                .map((row: any) => row.dados) // Extract JSON content
                .filter((lead: any) => !lead.crmStatus.saved || !lead.crmStatus.addedFunnel);

            console.log(`Found ${unprocessed.length} unprocessed leads.`);

            if (unprocessed.length > 0) {
                await this.processor.execute(unprocessed);
            }
        }

        console.log('Execution cycle finished.');
    }
}
