import { Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private messageService = inject(MessageService);

  success(detail: string, summary: string = 'Success') {
    this.messageService.add({ severity: 'success', summary, detail, life: 3000 });
  }

  error(detail: string, summary: string = 'Error') {
    this.messageService.add({ severity: 'error', summary, detail, life: 5000 });
  }

  info(detail: string, summary: string = 'Info') {
    this.messageService.add({ severity: 'info', summary, detail, life: 3000 });
  }

  warn(detail: string, summary: string = 'Warning') {
    this.messageService.add({ severity: 'warn', summary, detail, life: 4000 });
  }
}
