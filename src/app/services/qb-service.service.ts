import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QbServiceService {

  // private apiUrl = 'http://localhost:3000';
  private apiUrl = 'https://metadata-mapping-backend.onrender.com';

  constructor(private http: HttpClient) {}

  matchMetadata(data: any) {
    return this.http.post(`${this.apiUrl}/metadata-mapping`, data);
  }

  // post to examly api to get question banks with passing body and token as a header
  getQuestionBanks(data: any) {
    return this.http.post(`${this.apiUrl}/fetch-qbs`, data);
  }




}
