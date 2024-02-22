export class ModifUserDTO{
    constructor(
        public lastName? : string,
        public firstName? : string,
        public areaCode? : string,
        public houseNo? : number,
        public street? : string,
        public city? : string,
        public state? : string,
        public yearOfBirth? : number,
        public monthOfBirth? : number,
        public avatarUrl? : string,
        public username? : string
    ){}
}