export default interface IIdol{
    name:string
    hangul:string
    fandom?:string
    nativeName?:string
    fullName?:string
    avatar:string
    profession: string[],//Idol actor or array
    birthday?:Date,
    debut?:Date,
    active:boolean,
    gender:string
}