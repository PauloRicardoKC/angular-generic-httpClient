import { Base } from './base';

export interface Car extends Base {    
    model: string;
    color: string;
    price: number;
}