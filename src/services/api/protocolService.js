import protocolsData from "@/services/mockData/protocols.json";

class ProtocolService {
  constructor() {
    this.protocols = [...protocolsData];
  }

  async getAll() {
    await this.delay(250);
    return [...this.protocols].sort((a, b) => a.title.localeCompare(b.title));
  }

  async getById(id) {
    await this.delay(200);
    const protocol = this.protocols.find(p => p.Id === id);
    if (!protocol) {
      throw new Error("Protocol not found");
    }
    return { ...protocol };
  }

  async getByCategory(category) {
    await this.delay(200);
    return this.protocols.filter(p => p.category === category).map(p => ({ ...p }));
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new ProtocolService();