import assessmentsData from "@/services/mockData/assessments.json";

class AssessmentService {
  constructor() {
    this.assessments = [...assessmentsData];
  }

  async getAll() {
    await this.delay(300);
    return [...this.assessments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async getById(id) {
    await this.delay(200);
    const assessment = this.assessments.find(a => a.Id === id);
    if (!assessment) {
      throw new Error("Assessment not found");
    }
    return { ...assessment };
  }

  async create(assessmentData) {
    await this.delay(400);
    const newId = Math.max(...this.assessments.map(a => a.Id)) + 1;
    const newAssessment = {
      ...assessmentData,
      Id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.assessments.push(newAssessment);
    return { ...newAssessment };
  }

  async update(id, assessmentData) {
    await this.delay(350);
    const index = this.assessments.findIndex(a => a.Id === id);
    if (index === -1) {
      throw new Error("Assessment not found");
    }
    
    this.assessments[index] = {
      ...this.assessments[index],
      ...assessmentData,
      Id: id,
      updatedAt: new Date().toISOString()
    };
    
    return { ...this.assessments[index] };
  }

  async delete(id) {
    await this.delay(250);
    const index = this.assessments.findIndex(a => a.Id === id);
    if (index === -1) {
      throw new Error("Assessment not found");
    }
    
    const deleted = this.assessments.splice(index, 1)[0];
    return { ...deleted };
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new AssessmentService();