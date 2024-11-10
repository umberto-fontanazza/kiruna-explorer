export type ScaleRow = {
  scale_type: ScaleType;
  scale_ratio: number | null;
};

export enum ScaleType {
  BlueprintsOrEffect = "BLUEPRINTS/EFFECT",
  Text = "TEXT",
  Ratio = "RATIO",
}

export class Scale {
  type: ScaleType;
  ratio?: number;

  constructor(type: ScaleType, ratio: number | undefined) {
    this.type = type;
    this.ratio = ratio;
  }

  static fromDatabaseRow(row: ScaleRow): Scale {
    return new Scale(row.scale_type, row.scale_ratio || undefined);
  }

  intoDatabaseRow(): ScaleRow {
    return {
      scale_type: this.type,
      scale_ratio: this.ratio || null,
    };
  }
}
