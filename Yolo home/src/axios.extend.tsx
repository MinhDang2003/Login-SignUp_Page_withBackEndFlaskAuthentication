
// axios.d.ts
import 'axios';

declare module 'axios' {
    export interface AxiosInstance {
        _retry?: boolean;
    }
}