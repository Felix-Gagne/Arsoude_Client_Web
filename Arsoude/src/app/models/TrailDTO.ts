import { Coordinates } from "./Coordinates";
import { Type } from "./enum/Type";

export class TrailDTO{
    constructor(
        public Name : string,
        public Description : string,
        public Location : string,
        public Type : Type,
        public ImageUrl : string,
        public StartingCoordinates? : Coordinates,
        public EndingCoordinates? : Coordinates,
    ){}
}


