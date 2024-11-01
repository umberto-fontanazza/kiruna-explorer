import { Database } from "../database";
import { strict as assert } from "assert";

export enum LinkType {
  Direct = "DIRECT",
  Collateral = "COLLATERAL",
  Projection = "PROJECTION",
  Update = "UPDATE",
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

  async update(): Promise<void> {
    //TODO: the two queries should be in a transaction
    const args = [this.targetId, JSON.stringify(this.types), this.sourceId];
    let result = await Database.query(
      "UPDATE document SET links[$1] = $2 where id = $3",
      args,
    );
    assert(result.rowCount === 1);
    result = await Database.query(
      "UPDATE document SET links[$3] = $2 where id = $1",
      args,
    );
    assert(result.rowCount === 1);
  }
}
