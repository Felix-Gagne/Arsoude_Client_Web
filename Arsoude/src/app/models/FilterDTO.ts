import { Coordinates } from "./Coordinates";
import { TrailType } from "./enum/Type";

export class FilterDTO {
constructor(public Keyword? : string , public type? : TrailType, public coordinates? : Coordinates, public distance? : number ){}



}