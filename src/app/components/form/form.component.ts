import { Component } from '@angular/core';
import { QbServiceService } from '../../services/qb-service.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form',
  imports: [FormsModule, CommonModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.css'
})
export class FormComponent {
  token = '';
  searchText = '';
  questionBanks: any[] = [];
  selectedQbId: string | null = null;
  updatedQuestions: any[] = [];
  notUpdatedQuestions: any[] = [];
  searchLoading = false;
  mappingLoading = false;
  // questionBanks: any[] = [];
  filteredQuestionBanks: any[] = [];
  uniqueCreators: string[] = [];
  selectedCreator: string = '';

  constructor(private dataService: QbServiceService) {}

  onSearch() {
  const payload = {
      search: this.searchText,
      authToken: this.token,
    };

  this.dataService.getQuestionBanks(payload).subscribe({
    next: (res: any) => {
      this.questionBanks = res.results.questionbanks || [];
      this.filteredQuestionBanks = [...this.questionBanks]; // initially no filter
      this.extractUniqueCreators();
    },
    error: (err) => {
      console.error('Error fetching QBs:', err);
    }
  });
}

extractUniqueCreators() {
  const creators = this.questionBanks.map(qb => qb.createdBy).filter(Boolean);
  this.uniqueCreators = Array.from(new Set(creators));
}

filterByCreator() {
  if (this.selectedCreator) {
    this.filteredQuestionBanks = this.questionBanks.filter(
      qb => qb.createdBy === this.selectedCreator
    );
  } else {
    this.filteredQuestionBanks = [...this.questionBanks];
  }
}

  selectQB(qb: any) {
    this.selectedQbId = qb.qb_id;
  }

  submitSelectedQB() {
    if (!this.token || !this.selectedQbId) {
      console.error('Token and QB ID are required');
      return;
    }
    this.mappingLoading = true;

    const payload = { qb_id: this.selectedQbId, authToken: this.token };

    interface MatchMetadataResponse {
      updateResults?: {
        success?: boolean;
        message?: string;
        results?: {
          updated?: any[];
          notUpdated?: any[];
        };
      };
      [key: string]: any;
    }

    this.dataService.matchMetadata(payload).subscribe({
      next: (res: MatchMetadataResponse) => {
        const updateResults = res.updateResults;

        if (updateResults?.success) {
          console.log(updateResults.message);
          this.updatedQuestions = updateResults.results?.updated || [];
          this.notUpdatedQuestions = updateResults.results?.notUpdated || [];
          this.mappingLoading = false;
        } else {
          console.error('Update failed:', updateResults?.message);
          this.mappingLoading = false;
        }
      },
      error: (err) => {
        console.error('Error sending QB ID:', err) 
        this.mappingLoading = false;
      }

    });
  }
}
