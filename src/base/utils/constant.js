export const PLAN = {
  STARTER: 'Starter',
  GROWING: 'Growing',
  ENTERPRISE: 'Enterprise'
};


export const ACCOUNT_STATUS = {
  TRIAL: "Trial",
  NFR: "NFR",
  ACTIVE: "Active"
};


export const USER_TYPES = {
  USER: 0,
  BILLING_ADMIN: 1,
  USER_ADMIN: 2,
  SUPER_ADMIN: 3
};

export const PLAN_HIERARCHY = [
  PLAN.STARTER,
  PLAN.GROWING,
  PLAN.ENTERPRISE
];


export const ATTACHMENT_FILE_TYPES = {
  DOC: 'DOC',
  DOCS: 'DOCX',
  PDF: 'PDF',
  PPT: 'PPT',
  PPTX: 'PPTX',
  XLS: 'XLS',
  XLSX: 'XLSX'
};

export const ATTACHMENT_IMAGE_TYPES = {
  JPG: 'JPG',
  JPEG: 'JPEG',
  PNG: 'PNG',
  BMP: 'BMP',
  GIF: 'GIF',
  TIF: 'TIF'
};

export const BLOG_ATTACHMENT_TYPES = {
  ...ATTACHMENT_FILE_TYPES,
  TXT: "TXT",
  MP3: "MP3",
  MP4: "MP4",
  JPG: 'JPG',
  JPEG: 'JPEG',
  JPE: 'JPE',
  PNG: 'PNG',
  GIF: 'GIF'
};