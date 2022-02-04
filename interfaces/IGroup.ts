export default interface IGroup {
    name:string,
    hangul:string,
    avatar:string,
    logo:string,
    fandom?:string,
    debut?:Date,
    state:string,
    gender:string,
    members?:string[],
    exmembers?:string[],
    subgroups?:string[]
}