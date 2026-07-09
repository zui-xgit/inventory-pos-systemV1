export interface Product {
    uuid: string;
    name: string;
    sku: string;
    dosage_form: DosageForm;
    package_unit: PackageUnit;
}

export interface PackageUnit {
    uuid: string;
    name: string;
}
export interface DosageForm {
    uuid: string;
    name: string;
}
