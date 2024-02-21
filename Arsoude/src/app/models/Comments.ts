import { TrailDTO } from "./TrailDTO";

export class Comments{
    constructor(
        public id: number,
        public text: number,
        public date: Date,
        public userHasCompleted: boolean,
        public trail: TrailDTO
    ){}
}