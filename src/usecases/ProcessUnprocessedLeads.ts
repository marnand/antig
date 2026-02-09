import { SupabaseService } from '../services/SupabaseService';
import { Crm4cService } from '../services/Crm4cService';
import { EmailService } from '../services/EmailService';
import { Lead } from '../interfaces';

export class ProcessUnprocessedLeads {
    constructor(
        private supabase: SupabaseService,
        private crm: Crm4cService,
        private email: EmailService
    ) { }

    async execute(leads: Lead[]) {
        console.log(`Processing ${leads.length} leads...`);

        for (const lead of leads) {
            try {
                await this.processSingleLead(lead);
            } catch (error: any) {
                console.error(`Error processing lead ${lead.business.document}:`, error.message);
                // Continue to next lead even if one fails
            }
        }
    }

    private async processSingleLead(lead: Lead) {
        let saved = lead.crmStatus.saved;
        let addedFunnel = lead.crmStatus.addedFunnel;
        let uuidBusiness = lead.uuid;

        // Step 1: Save Customer if not saved
        if (!saved) {
            console.log(`Saving customer ${lead.name} (CNPJ: ${lead.business.document}) to CRM...`);
            try {
                uuidBusiness = await this.crm.createCustomer(lead);
                saved = true;
                // Update DB
                await this.supabase.updateCrmStatus(lead.business.document, saved, addedFunnel, uuidBusiness);
                console.log(`Customer saved. UUID: ${uuidBusiness}`);
            } catch (e: any) {
                console.error(`Failed to save customer for ${lead.business.document}: ${e.message}`);
                return; // If we can't save customer, we can't add to funnel
            }
        }

        // Step 2: Add to Funnel if not added (and if we have uuidBusiness)
        if (saved && !addedFunnel && uuidBusiness) {
            console.log(`Adding customer ${lead.name} to funnel...`);
            try {
                await this.crm.createCard(lead, uuidBusiness);
                addedFunnel = true;
                await this.supabase.updateCrmStatus(lead.business.document, saved, addedFunnel);
                console.log(`Added to funnel.`);

                // Step 3: Send Email
                console.log(`Sending email to ${lead.email}...`);
                const subject = "Assunto";
                const html = `<html><body style="color: red;"> Olá novamenre </body></html>`; // Typo from n8n preserved :P
                await this.email.sendEmail(lead.email, subject, html);
                console.log(`Email sent.`);

            } catch (e: any) {
                console.error(`Failed to add to funnel/send email for ${lead.business.document}: ${e.message}`);
            }
        }
    }
}
