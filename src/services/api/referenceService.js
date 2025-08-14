import referencesData from "@/services/mockData/references.json";

class ReferenceService {
  constructor() {
    this.references = [...referencesData];
  }

  async getAll() {
    await this.delay(300);
    return [...this.references].sort((a, b) => a.title.localeCompare(b.title));
  }

  async getById(id) {
    await this.delay(200);
    const reference = this.references.find(r => r.Id === id);
    if (!reference) {
      throw new Error("Reference not found");
    }
    return { ...reference };
  }

  async getByType(type) {
    await this.delay(200);
    return this.references.filter(r => r.type === type).map(r => ({ ...r }));
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new ReferenceService();