import { Type } from "./enum/Type";

export class FilterDTO {
constructor(public Keyword? : string , public type? : Type, public coordinates? : number, public distance? : number ){}



}