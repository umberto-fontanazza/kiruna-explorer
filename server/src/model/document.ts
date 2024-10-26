export class Document {
  id: number;
  title: string;
  description: string;

  constructor(id: number, title: string, description: string) {
    this.id = id;
    this.title = title;
    this.description = description;
  }

  static async insert(title: string, description: string): Promise<Document> {
    const id = 3; //TODO: get from insertion in the DB
    return new Document(id, title, description);
  }
}
