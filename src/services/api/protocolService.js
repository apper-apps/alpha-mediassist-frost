import { toast } from "react-toastify";

class ProtocolService {
  constructor() {
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'protocol_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "content_c"}},
          {"field": {"Name": "last_updated_c"}}
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
        category_c: item.category_c || '',
        content_c: item.content_c || '',
        last_updated_c: item.last_updated_c || new Date().toISOString()
      }));
    } catch (error) {
      console.error("Error fetching protocols:", error?.message || error);
      toast.error("Failed to load protocols");
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
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "content_c"}},
          {"field": {"Name": "last_updated_c"}}
        ]
      };

      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error("Protocol not found");
      }

      return {
        Id: response.data.Id,
        Name: response.data.Name || '',
        title_c: response.data.title_c || '',
        category_c: response.data.category_c || '',
        content_c: response.data.content_c || '',
        last_updated_c: response.data.last_updated_c || new Date().toISOString()
      };
    } catch (error) {
      console.error(`Error fetching protocol ${id}:`, error?.message || error);
      throw error;
    }
  }

  async getByCategory(category) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "content_c"}},
          {"field": {"Name": "last_updated_c"}}
        ],
        where: [{"FieldName": "category_c", "Operator": "EqualTo", "Values": [category]}],
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
        category_c: item.category_c || '',
        content_c: item.content_c || '',
        last_updated_c: item.last_updated_c || new Date().toISOString()
      }));
    } catch (error) {
      console.error("Error fetching protocols by category:", error?.message || error);
      return [];
    }
  }
}

export default new ProtocolService();