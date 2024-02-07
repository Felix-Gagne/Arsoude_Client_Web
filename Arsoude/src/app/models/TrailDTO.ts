import { Coordinates } from "./Coordinates";
import { Type } from "./enum/Type";

export class TrailDTO{
    constructor(
        public name : string,
        public description : string,
        public location : string,
        public type : Type,
        public imageUrl : string,
        public startingCoordinates? : Coordinates,
        public endingCoordinates? : Coordinates,
    ){}
}


