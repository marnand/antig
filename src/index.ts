import cron from 'node-cron';
import { SupabaseService } from './services/SupabaseService';
import { CnpjaService } from './services/CnpjaService';
import { Crm4cService } from './services/Crm4cService';
import { EmailService } from './services/EmailService';
import { ProcessUnprocessedLeads } from './usecases/ProcessUnprocessedLeads';
import { FetchAndProcessLeads } from './usecases/FetchAndProcessLeads';
import { config } from './config/env';

// Initialize Services
const supabaseService = new SupabaseService();
const cnpjaService = new CnpjaService();
const crm4cService = new Crm4cService();
const emailService = new EmailService();

// Initialize Use Cases
const processUnprocessedLeads = new ProcessUnprocessedLeads(
    supabaseService,
    crm4cService,
    emailService
);

const fetchAndProcessLeads = new FetchAndProcessLeads(
    supabaseService,
    cnpjaService,
    processUnprocessedLeads
);

async function run() {
    console.log(`[${new Date().toISOString()}] Job started.`);

    try {
        await fetchAndProcessLeads.execute();
        console.log(`[${new Date().toISOString()}] Job completed successfully.`);
    } catch (error: any) {
        console.error(`[${new Date().toISOString()}] Job failed:`, error.message);
    }
}

// Schedule: 7 AM every day
// n8n schedule: interval: [{ triggerAtHour: 7 }]
console.log('Scheduler initialized. Waiting for 7:00 AM trigger...');
cron.schedule('0 7 * * *', () => {
    run();
});

// Run immediately if START_NOW=true is passed (for testing/manual run)
if (process.env.START_NOW === 'true') {
    console.log('Manual trigger detected.');
    run();
}
