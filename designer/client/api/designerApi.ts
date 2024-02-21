import { FormDefinition } from "@defra/forms-model";
import logger from "../plugins/logger";

export class DesignerApi {
  async save(id: string, updatedData: FormDefinition): Promise<Response | any> {
    const response = await window.fetch(`/forms-designer/api/${id}/data`, { // TODO make config driven
      method: "put",
      body: JSON.stringify(updatedData),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response;
  }

  async fetchData(id: string) {
    try {
      const response = await window.fetch(`/forms-designer/api/${id}/data`);
      return response.json();
    } catch (e) {
      logger.error("fetchData", e);
    }
  }
}
