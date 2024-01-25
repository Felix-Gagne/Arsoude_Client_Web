export class RegisterDTO{
    constructor(
        public FirstName : string,
        public LastName : string,
        public Username : string,
        public Email : string,
        public AreaCode : string,
        public Password : string,
        public ConfirmPassword : string,
        public HouseNo? : number,
        public Street? : string,
        public City? : string,
        public State? : string,
        public YearOfBirth? : number,
        public MonthOfBirth? : number
    ){}
}