import { ContactProvider } from "@/types/webhooks";
import { AuthCustomer } from "@/lib/auth";
import { getIntegrationClient } from "@/lib/integration-app-client";

export async function useIntegrationAppActions(auth: AuthCustomer) {
    if (!auth?.customerId || !auth?.customerName) throw new Error('Unauthorized');
    const integrationApp = await getIntegrationClient(auth);

    const findByIdContacts = async (platformType: ContactProvider, id: string) => {
        const validPlatforms: ContactProvider[] = ['hubspot', 'pipedrive'];
        if (!validPlatforms.includes(platformType)) throw new Error('Invalid platform type');

        return await integrationApp
            .connection(platformType.toLowerCase())
            .action('find-by-id-contacts')
            .run({ id });
    }

    const deleteByIdContacts = async (platformType: ContactProvider, id: string) => {
        const validPlatforms: ContactProvider[] = ['hubspot', 'pipedrive'];
        if (!validPlatforms.includes(platformType)) throw new Error('Invalid platform type');

        return await integrationApp
            .connection(platformType.toLowerCase())
            .action('delete-contacts')
            .run({ id });
    }

    return {
        findByIdContacts,
        deleteByIdContacts
    }
}