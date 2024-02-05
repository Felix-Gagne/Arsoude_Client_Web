import { Coordinates } from "./Coordinates";
import { Type } from "./enum/Type";

export class FilterDTO {
constructor(public Keyword? : string , public type? : Type, public coordinates? : Coordinates, public distance? : number ){}



}