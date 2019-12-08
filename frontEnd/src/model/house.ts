export class House {
  constructor(
    public idHouse?: number,
    public title?: string,
    public addressHouse?: string,
    public price?: number,
    public surface?: number,
    public description?: string,
    public roomCount?: number,
    public creationDate?: number,
    public isSold?: boolean,
    public owner?: string
  ) { }
}
