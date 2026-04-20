import { LeadStatus, LeadSource, PropertyType } from '@crm/shared';

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  [LeadStatus.New]: 'New',
  [LeadStatus.Contacted]: 'Contacted',
  [LeadStatus.SiteVisit]: 'Site Visit',
  [LeadStatus.Closed]: 'Closed',
  [LeadStatus.Lost]: 'Lost',
};

export const LEAD_STATUS_COLORS: Record<LeadStatus, string> = {
  [LeadStatus.New]: 'bg-blue-100 text-blue-700 border-blue-200',
  [LeadStatus.Contacted]: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  [LeadStatus.SiteVisit]: 'bg-purple-100 text-purple-700 border-purple-200',
  [LeadStatus.Closed]: 'bg-green-100 text-green-700 border-green-200',
  [LeadStatus.Lost]: 'bg-red-100 text-red-700 border-red-200',
};

export const LEAD_SOURCE_OPTIONS = Object.values(LeadSource);
export const LEAD_STATUS_OPTIONS = Object.values(LeadStatus);
export const PROPERTY_TYPE_OPTIONS = Object.values(PropertyType);

export const CHART_COLORS = [
  '#6366f1',
  '#f59e0b',
  '#10b981',
  '#ef4444',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#14b8a6',
];

export const STATUS_CHART_COLORS: Record<LeadStatus, string> = {
  [LeadStatus.New]: '#3b82f6',
  [LeadStatus.Contacted]: '#f59e0b',
  [LeadStatus.SiteVisit]: '#8b5cf6',
  [LeadStatus.Closed]: '#10b981',
  [LeadStatus.Lost]: '#ef4444',
};
