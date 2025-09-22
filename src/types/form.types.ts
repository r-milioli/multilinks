export interface FormField {
  id: string;
  type: 'name' | 'email' | 'whatsapp' | 'custom';
  label: string;
  placeholder?: string;
  required: boolean;
  active: boolean;
  order: number;
}

export interface Form {
  id: string;
  userId: string;
  title: string;
  description?: string;
  uniqueId: string;
  fields: FormField[];
  buttonText: string;
  buttonActive: boolean;
  redirectUrl?: string;
  followLinkDestination: boolean;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Lead {
  id: string;
  formId: string;
  linkId?: string;
  data: Record<string, string>;
  createdAt: Date;
  ipAddress?: string;
  userAgent?: string;
}

export interface FormSubmission {
  formId: string;
  data: Record<string, string>;
  linkId?: string;
}

export interface FormStats {
  totalSubmissions: number;
  submissionsToday: number;
  submissionsThisWeek: number;
  submissionsThisMonth: number;
}
