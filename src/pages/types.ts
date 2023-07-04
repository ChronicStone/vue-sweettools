export type Person = {
  fullName?: string;
  firstName: string;
  lastName: string;
  otherName?: string;
  birthDate?: string;
  email: string;
  gender: `${Gender}`;
  mobilePhoneNumber?: string;
  otherPhoneNumber?: string;
};

export enum Gender {
  male = "male",
  female = "female",
  other = "other",
}

export type Assessment = Person & {
  _id: string;
  candidate: Record<string, unknown>;
  testCenter: Record<string, unknown>;
  customer?: Record<string, unknown>;
  onSiteSession?: Record<string, unknown>;
  onSiteSessionOptions: Record<string, unknown>;
  affiliation?: Array<Record<string, unknown>>;
  assessmentName: string;
  secureCode: string;
  testStatus: string;
  testDuration?: number;
  testEndDate?: string;
  pause: boolean;
  dateMode: string;
  expectedDueDate: string;
  batch?: Record<string, unknown>;
  scoreReport?: string;
  officialCertificate?: string;
  examConvocation?: string;
  securityReport?: string;
  evidenceReport?: string;
  requireInterview: boolean;
  interview?: Record<string, unknown>;
  proctoring: Record<string, unknown>;
  exercises?: Record<string, unknown>[];
  assets?: Record<string, unknown>[];
  exam: Record<string, unknown>;
  results?: Record<string, unknown>;
  sessions?: Record<string, unknown>[];
  idDocType?: string;
  idDocNumber?: string;
  idPhoto?: string;
  idDoc?: string;
  idCountry?: string;
  reviews?: Record<string, unknown>[];
  assetsCleaned?: boolean;
  codeGeneratorGroupId?: string;
  identityConfirmed?: boolean;
  dataTransfer?: boolean;
  processingPersonalData?: boolean;
  consentSignedBy?: string;
  consentDate?: string;
  statusHistory: Array<{ status: string; date: string }>;
  lastStatusUpdate: string;
  createdAt: string;
  updatedAt: string;
};

export enum AssessmentStatus {
  created = "Created",
  pending = "Pending",
  canceled = "Canceled",
  started = "Started",
  processing = "Processing",
  assigned = "Assigned",
  done = "Done",
  blocked = "Blocked",
  underReview = "Under review",
  underSmartReview = "Under smart review",
}
