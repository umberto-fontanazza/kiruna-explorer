import { strict as assert } from "assert";
import { Database } from "../database";

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
    return Link.fromJsonbField(result.rows[0].links);
  }

  /**
   * Stores the link in the database, overwriting the previous array
   * of linkTypes for the pair of documents.
   */
  async update(): Promise<void> {
    const args = [
      this.targetDocumentId,
      JSON.stringify(this.linkTypes),
      this.sourceDocumentId,
    ];

    await Database.withTransaction(async (client) => {
      let result = await client.query(
        "UPDATE document SET links[$1] = $2 WHERE id = $3",
        args,
      );
      assert(result.rowCount === 1);

      result = await client.query(
        "UPDATE document SET links[$3] = $2 WHERE id = $1",
        args,
      );
      assert(result.rowCount === 1);
    });
  }

  static async delete(
    sourceDocumentId: number,
    targetDocumentId: number,
  ): Promise<void> {
    const args = [sourceDocumentId, targetDocumentId];

    await Database.withTransaction(async (client) => {
      let result = await client.query(
        "UPDATE document SET links = links - $1 WHERE id = $2",
        args,
      );
      assert(result.rowCount === 1);

      result = await client.query(
        "UPDATE document SET links = links - $2 WHERE id = $1",
        args,
      );
      assert(result.rowCount === 1);
    });
  }

  static fromJsonbField(
    linksField: Record<string, LinkType[]>,
  ): LinkResponseBody[] {
    return Object.entries(linksField).map(([key, value]) => ({
      targetDocumentId: Number(key),
      linkTypes: value,
    }));
  }

  toResponseBody(): LinkResponseBody {
    return {
      targetDocumentId: this.targetDocumentId,
      linkTypes: this.linkTypes,
    };
  }
}
