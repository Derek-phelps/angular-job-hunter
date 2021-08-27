import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ReviewRequestService {

  constructor(
    private http: HttpClient,
  ) { }

  public remind (candidateId: string, id: string) {
    return this.http.post(`${environment.apiUrl}/candidates/${candidateId}/review-requests/${id}/remind`, { id });
  }
}
