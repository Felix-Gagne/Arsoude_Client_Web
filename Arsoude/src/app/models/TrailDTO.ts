export class TrailDTO{
    constructor(
        public Id : number,
        public Name : string,
        public Description : string,
        public Location : string,
        public ImageUtl : string,
        public OwnerId : number
    ){}
}