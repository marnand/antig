import { CnpjaResponseItem, Lead } from '../interfaces';

export function formatCnpjaResponse(items: CnpjaResponseItem[]): Lead[] {
    return items.map(item => {
        // n8n logic:
        // name: (item.company?.members?.[0]?.person?.name ?? item.company.name)?.replace(/[0-9.\-\/]+/g, '').trim()
        const memberName = item.company?.members?.[0]?.person?.name;
        const companyName = item.company.name; // assuming this exists based on n8n
        const rawName = memberName ?? companyName ?? '';
        const name = rawName.replace(/[0-9.\-\/]+/g, '').trim();

        // email: item.emails?.[0]?.address ?? ''
        const email = item.emails?.[0]?.address ?? '';

        // cellphone: (item.phones?.[0]?.area ?? '') + '9' + (item.phones?.[0]?.number ?? '')
        const area = item.phones?.[0]?.area ?? '';
        const number = item.phones?.[0]?.number ?? '';
        const cellphone = `${area}9${number}`;

        // business name: (item.company?.name ?? '').replace(/[^a-zA-Z0-9\s]/g, '')
        const businessName = (item.company?.name ?? '').replace(/[^a-zA-Z0-9\s]/g, '');

        // document: item.taxId ?? ''
        const document = item.taxId ?? '';

        // initialDateRecurrence: item.founded -> LocaleString pt-BR -> replace / with \/
        let initialDateRecurrence = '';
        if (item.founded) {
            // Create date at noon to avoid timezone issues shifting it back a day
            const date = new Date(item.founded + 'T12:00:00Z');
            // Node.js toLocaleDateString might behave differently depending on env locale support
            // Let's manually format DD/MM/YYYY
            const day = String(date.getUTCDate()).padStart(2, '0');
            const month = String(date.getUTCMonth() + 1).padStart(2, '0');
            const year = date.getUTCFullYear();
            initialDateRecurrence = `${day}/${month}/${year}`; // n8n used /g, we keep standard /
        }

        // Address
        const zipCode = item.address?.zip ?? '';
        const street = item.address?.street ?? '';
        let addressNumber = item.address?.number === 'S/N' ? item.address?.number : '0' + (item.address?.number ?? '0');
        // Ensure number logic matches n8n exactly if important, otherwise this looks like prepending 0

        const district = item.address?.district ?? '';
        const city = item.address?.city ?? '';
        const uf = item.address?.state ?? '';

        return {
            name,
            email,
            cellphone,
            isLead: 1,
            crmStatus: {
                saved: false,
                addedFunnel: false
            },
            business: {
                name: businessName,
                document,
                initialDateRecurrence,
                taxRegime: 'SIMPLES NACIONAL',
                address: {
                    zipCode,
                    street,
                    number: addressNumber,
                    district,
                    city,
                    uf
                }
            }
        };
    });
}
