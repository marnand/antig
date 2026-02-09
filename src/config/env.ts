import dotenv from 'dotenv';
dotenv.config();

export const config = {
    port: process.env.PORT || 3000,
    supabase: {
        url: process.env.SUPABASE_URL || '',
        key: process.env.SUPABASE_KEY || '',
    },
    cnpja: {
        url: process.env.CNPJA_API_URL || 'https://api.cnpja.com/office',
        key: process.env.CNPJA_API_KEY || '',
    },
    crm4c: {
        url: process.env.CRM_API_URL || 'https://app.4c.tec.br/api/v1',
        token: process.env.CRM_API_TOKEN || '',
        userUuid: process.env.CRM_USER_UUID || '',
    },
    smtp: {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
    },
};
