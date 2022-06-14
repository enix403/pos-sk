import { ISystemBackendAPI } from '@shared/system_api';

declare global {
    interface Window {
        SystemBackend: ISystemBackendAPI
    }
}
