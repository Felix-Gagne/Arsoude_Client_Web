export class RegisterDTO{
    constructor(
        public LastName : string,
        public FirstName : string,
        public Username : string,
        public Email : string,
        public AreaCode : string,
        public Password : string,
        public ConfirmPassword : string,
    ){}
}