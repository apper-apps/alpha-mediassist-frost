import { toast } from "react-toastify";

class ReferenceService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'reference_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "usage_c"}}
        ],
        orderBy: [{"fieldName": "title_c", "sorttype": "ASC"}],
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
        title_c: item.title_c || '',
        type_c: item.type_c || '',
        description_c: item.description_c || '',
        usage_c: item.usage_c || ''
      }));
    } catch (error) {
      console.error("Error fetching references:", error?.message || error);
      toast.error("Failed to load references");
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "usage_c"}}
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error("Reference not found");
      }

      return {
        Id: response.data.Id,
        Name: response.data.Name || '',
        title_c: response.data.title_c || '',
        type_c: response.data.type_c || '',
        description_c: response.data.description_c || '',
        usage_c: response.data.usage_c || ''
      };
    } catch (error) {
      console.error(`Error fetching reference ${id}:`, error?.message || error);
      throw error;
    }
  }

  async getByType(type) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "usage_c"}}
        ],
        where: [{"FieldName": "type_c", "Operator": "EqualTo", "Values": [type]}],
        pagingInfo: {"limit": 1000, "offset": 0}
      };

      const response = await this.apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      if (!response.data) {
        return [];
      }

      return response.data.map(item => ({
        Id: item.Id,
        Name: item.Name || '',
        title_c: item.title_c || '',
        type_c: item.type_c || '',
        description_c: item.description_c || '',
        usage_c: item.usage_c || ''
      }));
    } catch (error) {
      console.error("Error fetching references by type:", error?.message || error);
      return [];
    }
  }
}

export default new ReferenceService();