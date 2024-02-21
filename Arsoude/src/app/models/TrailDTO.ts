import { Coordinates } from "./Coordinates";
import { TrailType } from "./enum/Type";

export class TrailDTO{
    constructor(
        public name : string,
        public description : string,
        public location : string,
        public type : TrailType,
        public imageUrl : string,
        public startingCoordinates? : Coordinates,
        public endingCoordinates? : Coordinates,
        public id? : number,
        public isPublic? : boolean,
        
    ){}
}


