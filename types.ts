/**
 * EYE Workflow Hub - System Type Declarations
 */

export type UserRole = 'Member' | 'Leader' | 'Super Admin';

export type UserStatus = 'Pending Approval' | 'Active' | 'Disabled';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
  status: UserStatus;
  committee: string; // HR, PR, SM, OR, or 'None' (for Super Admin)
  department: string; // HRM, EPR, Graphic Design, VIP, etc.
  membershipCode: string; // e.g. EYE-HRM-0023
  avatarUrl?: string;
  joinedDate: string;
  bio?: string;
}

export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export type TaskStatus = 'Draft' | 'Published' | 'Closed';

export interface Task {
  id: string;
  name: string;
  description: string;
  instructions: string;
  priority: TaskPriority;
  deadline: string;
  committee: string;
  department: string;
  status: TaskStatus;
  createdBy: string; // User ID of Leader or Admin
  createdByName: string;
  createdDate: string;
  allowedFileTypes: string[]; // e.g. ['pdf', 'png', 'zip']
  maxUploadSizeMb: number;
  allowResubmission: boolean;
  attachments?: { name: string; url: string; size: string }[];
}

export type SubmissionStatus = 'Pending' | 'Accepted' | 'Rejected' | 'Resubmission Requested';

export interface Submission {
  id: string; // TASK-000001-USR123 etc
  taskId: string;
  taskName: string;
  memberId: string;
  memberName: string;
  memberEmail: string;
  committee: string;
  department: string;
  submittedAt: string;
  status: SubmissionStatus;
  fileUrl: string;
  fileName: string;
  fileSize: string;
  comment?: string;
  rejectionReason?: string;
  submissionIdCode: string; // e.g. SUB-000001
  history?: {
    status: SubmissionStatus;
    changedAt: string;
    changedBy: string;
    comment?: string;
  }[];
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  committee: string; // 'All' or specific committee
  createdBy: string;
  createdByName: string;
  createdDate: string;
  isPinned: boolean;
}

export interface SystemNotification {
  id: string;
  userId: string; // Recipient
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
  relatedId?: string; // ID of Task, Submission, etc.
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  details: string;
  timestamp: string;
}

export interface OrganizationSettings {
  orgName: string;
  orgLogoUrl: string;
  theme: 'Light' | 'Dark' | 'System';
  language: 'English' | 'Arabic';
  allowSelfRegistration: boolean;
  defaultMaxFileSizeMb: number;
  notificationChannels: {
    email: boolean;
    push: boolean;
    system: boolean;
  };
}

// Committee and Department mapping helper
export const COMMITTEE_STRUCTURE: Record<string, string[]> = {
  HR: ['HRM', 'HRS', 'HRIS', 'HRD'],
  PR: ['EPR', 'IPR'],
  SM: ['Content', 'Graphic Design', 'Photography', 'Video Editing'],
  OR: ['VIP', 'Planning', 'Coordination', 'Logistics'],
};
