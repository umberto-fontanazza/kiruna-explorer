import { Database } from "../database";
import { strict as assert } from "assert";

export enum LinkType {
  Direct = "direct",
  Collateral = "collateral",
  Projection = "projection",
  Update = "update",
}

export type LinkResponseBody = {
  targetDocumentId: number;
  linkTypes: LinkType[];
};

export class Link {
  sourceDocumentId: number;
  targetDocumentId: number;
  linkTypes: LinkType[];

  constructor(
    sourceDocumentId: number,
    targetDocumentId: number,
    types: LinkType[],
  ) {
    this.sourceDocumentId = sourceDocumentId;
    this.targetDocumentId = targetDocumentId;
    this.linkTypes = types;
  }

  static async fromDocumentAll(
    documentId: number,
  ): Promise<LinkResponseBody[]> {
    const result = await Database.query(
      "SELECT links FROM document WHERE id = $1",
      [documentId],
    );
    /** JSONB database repr doesn't allow numbers as keys of objects, need to parse */
    const rawLinks = result.rows[0].links;
    const links = Object.entries(rawLinks).map(([key, value]) =>
      new Link(documentId, Number(key), value as LinkType[]).toResponseBody(),
    );
    return links;
  }

  /**
   * Stores the link in the database, overwriting the previous array
   * of linkTypes for the pair of documents.
   */
  async update(): Promise<void> {
    //TODO: the two queries should be in a transaction
    const args = [
      this.targetDocumentId,
      JSON.stringify(this.linkTypes),
      this.sourceDocumentId,
    ];
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

  static async delete(
    sourceDocumentId: number,
    targetDocumentId: number,
  ): Promise<void> {
    //TODO: run the two queries in the same transaction
    const args = [sourceDocumentId, targetDocumentId];
    const result = await Database.query(
      "UPDATE document SET links = links - $1 WHERE id = $2",
      args,
    );
    assert(result.rowCount === 1);
    const result2 = await Database.query(
      "UPDATE document SET links = links - $2 WHERE id = $1",
      args,
    );
    assert(result2.rowCount === 1);
  }

  toResponseBody(): LinkResponseBody {
    return {
      targetDocumentId: this.targetDocumentId,
      linkTypes: this.linkTypes,
    };
  }
}
