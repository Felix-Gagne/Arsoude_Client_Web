export class InfoRegDTO{
    constructor(
        public Username : string,
        public HouseNo? : number,
        public Street? : string,
        public City? : string,
        public State? : string,
        public YearOfBirth? : number,
        public MonthOfBirth? : number
    ){}
}