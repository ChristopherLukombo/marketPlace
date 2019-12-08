export class House {
  constructor(
    public idHouse?: number,
    public addressHouse?: string,
    public price?: number,
    public surface?: number,
    public description?: string,
    public documents?: string[],
    public salesman?: string,
    public roomCount?: number,
    public creationDate?: number,
    public owner?: string
  ) { }
}
