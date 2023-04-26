export interface SelectedSchemeType {
    normalCare: string;
    vipCare: string;
    premiumCare: string;
    set: (selectedScheme: SelectedSchemeType) => void;
    get: (key: string) => string;
}
