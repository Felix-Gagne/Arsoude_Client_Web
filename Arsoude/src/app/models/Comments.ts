export class Comments{
    constructor(
        public id : number,
        public text : string,
        public date : string,
        public userHasCompleted : boolean,
        public username : string
    ){}
}