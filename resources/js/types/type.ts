export interface Product {
    uuid: string;
    name: string;
    sku: string;
    dosage_form: DosageForm;
}

export interface DosageForm {
    uuid: string;
    name: string;
}
