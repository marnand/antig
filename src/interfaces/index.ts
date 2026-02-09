export interface Address {
    zipCode: string;
    street: string;
    number: string;
    district: string;
    city: string;
    uf: string;
}

export interface Business {
    name: string;
    document: string;
    initialDateRecurrence: string;
    taxRegime: string;
    address: Address;
}

export interface CrmStatus {
    saved: boolean;
    addedFunnel: boolean;
}

export interface Lead {
    name: string;
    email: string;
    cellphone: string;
    isLead: number;
    crmStatus: CrmStatus;
    business: Business;
    uuid?: string; // Added after saving to DB
}

export interface CnpjaResponseItem {
    company: {
        name: string;
        members?: Array<{ person: { name: string } }>;
    };
    emails?: Array<{ address: string }>;
    phones?: Array<{ area: string; number: string }>;
    taxId: string; // CNPJ
    founded: string;
    address?: {
        zip: string;
        street: string;
        number: string;
        district: string;
        city: string;
        state: string;
    };
}
