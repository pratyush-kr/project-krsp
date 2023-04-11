import { SelectedSchemeType } from "./SelectedSchemeType";

export interface Scheme {
    id: number;
    name: string;
    cost: string;
    time: string;
    message: string;
    set: (scheme: Scheme) => void;
}
