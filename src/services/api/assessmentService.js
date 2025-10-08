import { toast } from "react-toastify";

class AssessmentService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'assessment_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "chief_complaint_c"}},
          {"field": {"Name": "symptoms_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}}
        ],
        orderBy: [{"fieldName": "created_at_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": 1000, "offset": 0}
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data.map(item => ({
        Id: item.Id,
        Name: item.Name || '',
        patient_id_c: item.patient_id_c || '',
        chief_complaint_c: item.chief_complaint_c || '',
        symptoms_c: item.symptoms_c ? JSON.parse(item.symptoms_c) : [],
        status_c: item.status_c || 'Draft',
        created_at_c: item.created_at_c || new Date().toISOString(),
        updated_at_c: item.updated_at_c || new Date().toISOString()
      }));
    } catch (error) {
      console.error("Error fetching assessments:", error?.message || error);
      toast.error("Failed to load assessments");
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "chief_complaint_c"}},
          {"field": {"Name": "symptoms_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "updated_at_c"}}
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error("Assessment not found");
      }

      return {
        Id: response.data.Id,
        Name: response.data.Name || '',
        patient_id_c: response.data.patient_id_c || '',
        chief_complaint_c: response.data.chief_complaint_c || '',
        symptoms_c: response.data.symptoms_c ? JSON.parse(response.data.symptoms_c) : [],
        status_c: response.data.status_c || 'Draft',
        created_at_c: response.data.created_at_c || new Date().toISOString(),
        updated_at_c: response.data.updated_at_c || new Date().toISOString()
      };
    } catch (error) {
      console.error(`Error fetching assessment ${id}:`, error?.message || error);
      throw error;
    }
  }

  async create(assessmentData) {
    try {
      const symptomsString = JSON.stringify(assessmentData.symptoms_c || []);
      
      const params = {
        records: [{
          Name: assessmentData.Name || `Assessment ${Date.now()}`,
          patient_id_c: assessmentData.patient_id_c || '',
          chief_complaint_c: assessmentData.chief_complaint_c || '',
          symptoms_c: symptomsString,
          status_c: assessmentData.status_c || 'Draft',
          created_at_c: new Date().toISOString(),
          updated_at_c: new Date().toISOString()
        }]
      };

      const response = await this.apperClient.createRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} records: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const created = successful[0].data;
          return {
            Id: created.Id,
            Name: created.Name || '',
            patient_id_c: created.patient_id_c || '',
            chief_complaint_c: created.chief_complaint_c || '',
            symptoms_c: created.symptoms_c ? JSON.parse(created.symptoms_c) : [],
            status_c: created.status_c || 'Draft',
            created_at_c: created.created_at_c || new Date().toISOString(),
            updated_at_c: created.updated_at_c || new Date().toISOString()
          };
        }
      }

      throw new Error("Failed to create assessment");
    } catch (error) {
      console.error("Error creating assessment:", error?.message || error);
      throw error;
    }
  }

  async update(id, assessmentData) {
    try {
      const symptomsString = JSON.stringify(assessmentData.symptoms_c || []);
      
      const params = {
        records: [{
          Id: parseInt(id),
          Name: assessmentData.Name,
          patient_id_c: assessmentData.patient_id_c,
          chief_complaint_c: assessmentData.chief_complaint_c,
          symptoms_c: symptomsString,
          status_c: assessmentData.status_c,
          updated_at_c: new Date().toISOString()
        }]
      };

      const response = await this.apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} records: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        if (successful.length > 0) {
          const updated = successful[0].data;
          return {
            Id: updated.Id,
            Name: updated.Name || '',
            patient_id_c: updated.patient_id_c || '',
            chief_complaint_c: updated.chief_complaint_c || '',
            symptoms_c: updated.symptoms_c ? JSON.parse(updated.symptoms_c) : [],
            status_c: updated.status_c || 'Draft',
            created_at_c: updated.created_at_c || new Date().toISOString(),
            updated_at_c: updated.updated_at_c || new Date().toISOString()
          };
        }
      }

      throw new Error("Failed to update assessment");
    } catch (error) {
      console.error("Error updating assessment:", error?.message || error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await this.apperClient.deleteRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} records: ${JSON.stringify(failed)}`);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to delete assessment");
        }

        return successful.length > 0;
      }

      throw new Error("Failed to delete assessment");
    } catch (error) {
      console.error("Error deleting assessment:", error?.message || error);
      throw error;
    }
  }
}

export default new AssessmentService();