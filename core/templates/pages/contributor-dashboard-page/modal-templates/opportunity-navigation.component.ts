// Copyright 2022 The Oppia Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Component for opportunity navigation component.
 */

import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'oppia-opportunity-navigation',
  templateUrl: './opportunity-navigation.component.html',
})
export class OpportunityNavigationComponent implements OnInit {
    @Input() contributionType!: string;
    @Input() remainingContributionIds!: string[];
    @Input() skippedContributionIds!: string[];
    @Input() activeSuggestionId!: string;
    @Input() resolvedSuggestionIds?: string[];

    @Output() navigationEvent = new EventEmitter<string>();

    isLastItem: boolean = true;
    isFirstItem: boolean = true;

    constructor() {}

    ngOnInit(): void {
      this.isFirstItem = this.skippedContributionIds.length === 0;
      this.isLastItem = this.remainingContributionIds.length === 0;
    }

    gotoNextItem(): void {
      let lastContributionId = this.remainingContributionIds.pop();

      // If the current item is the last item, do not navigate.
      if (lastContributionId === undefined) {
        return;
      }

      if (this.contributionType === 'translation') {
        // This prevents resolved contributions from getting added to the list.
        if (!this.resolvedSuggestionIds.includes(this.activeSuggestionId)) {
          this.skippedContributionIds.push(this.activeSuggestionId);
        }
      } else if (this.contributionType === 'question') {
        this.skippedContributionIds.push(this.activeSuggestionId);
      }

      this.activeSuggestionId = lastContributionId;

      this.isLastItem = this.remainingContributionIds.length === 0;
      this.isFirstItem = this.skippedContributionIds.length === 0;

      this.navigationEvent.emit(this.activeSuggestionId);
    }

    gotoPreviousItem(): void {
      let lastContributionId = this.skippedContributionIds.pop();
      // If the current item is the first item, do not navigate.
      if (lastContributionId === undefined) {
        return;
      }

      if (this.contributionType === 'translation') {
      // This prevents resolved contributions from getting added to the list.
        if (!this.resolvedSuggestionIds.includes(this.activeSuggestionId)) {
          this.remainingContributionIds.push(this.activeSuggestionId);
        }
      } else if (this.contributionType === 'question') {
        this.remainingContributionIds.push(this.activeSuggestionId);
      }

      this.activeSuggestionId = lastContributionId;

      this.isLastItem = this.remainingContributionIds.length === 0;
      this.isFirstItem = this.skippedContributionIds.length === 0;

      this.navigationEvent.emit(this.activeSuggestionId);
    }
}
