class GeneratorService {
  private hostName: string;
  private protocol: string;

  constructor() {
    this.hostName = 'localhost:8081';
    this.protocol = 'http';
  }

  private postRequest(apiPath: string, requestBody: any): Promise<any> {
    return fetch(`${this.protocol}://${this.hostName}/${apiPath}`, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
  }

  async postRequirement(requestBody: any): Promise<any> {
    const response = await this.postRequest('api/quote/init', requestBody);
    return response.json();
  }
}

export default new GeneratorService();
