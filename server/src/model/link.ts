export enum LinkType {
  Direct = "direct",
  Collateral = "collateral",
  Projection = "projectiobn",
  Update = "update",
}

export class Link {
  sourceId: number;
  targetId: number;
  types: LinkType[];

  constructor(sourceId: number, targetId: number, types: LinkType[]) {
    this.sourceId = sourceId;
    this.targetId = targetId;
    this.types = types;
  }
}
