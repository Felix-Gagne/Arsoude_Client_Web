export class Level{
    constructor(
        public id : number,
        public currentLevel : number,
        public experience : number,
        public previousLevelExperience : number,
        public nextLevelExperience : number,
        public userId : number
    ){}
}