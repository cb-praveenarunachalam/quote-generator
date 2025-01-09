class GeneratorService {
  private hostName: string;
  private protocol: string;

  constructor() {
    this.hostName = '3b91-14-142-185-230.ngrok-free.app';
    this.protocol = 'https';
  }

  private postRequest(apiPath: string, requestBody: any): Promise<any> {
    return fetch(`/${apiPath}`, {
      mode: 'cors',
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
  }

  async postRequirement(requestBody: any): Promise<any> {
    return await this.postRequest('hello', requestBody);
  }
}

export default new GeneratorService();
