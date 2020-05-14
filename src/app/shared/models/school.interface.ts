import { Address } from "./address.interface";

export interface School {
    schoolId: number
    name: string,
    typeId: number,
    address: Address
}