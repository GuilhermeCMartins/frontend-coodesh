export interface Product {
    Id: number;
    Name: string;
    Description: string;
    Quantity: number;
    Price: string;
}

export interface TransactionType {
    Id: number;
    Description: string;
    Inbound: boolean;
}

export interface Vendor {
    Id: number;
    Name: string;
    Password: string;
    Type: string;
}

export interface Transaction {
    Id: number;
    MadeAt: string;
    Price: string;
    TransactionTypeId: number;
    ProductId: number;
    VendorId: number;
    Product: Product;
    TransactionType: TransactionType;
    Vendor: Vendor;
}
