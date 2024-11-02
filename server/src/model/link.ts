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
  linkTypes: LinkType[];

  constructor(sourceId: number, targetId: number, types: LinkType[]) {
    this.sourceId = sourceId;
    this.targetId = targetId;
    this.linkTypes = types;
  }

  static async fromDocumentAll(documentId: number): Promise<Link[]> {
    const result = await Database.query(
      "SELECT links FROM document WHERE id = $1",
      [documentId],
    );
    /** JSONB database repr doesn't allow numbers as keys of objects, need to parse */
    const rawLinks = result.rows[0].links;
    const links = Object.entries(rawLinks).map(
      ([key, value]) => new Link(documentId, Number(key), value as LinkType[]),
    );
    return links;
  }

  /**
   * Stores the link in the database, overwriting the previous array
   * of linkTypes for the pair of documents.
   */
  async update(): Promise<void> {
    //TODO: the two queries should be in a transaction
    const args = [this.targetId, JSON.stringify(this.linkTypes), this.sourceId];
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
