import { Lead } from '../models/Lead.model';
import { DashboardSummary, LeadStatus, LeadSource } from '@crm/shared';

export class DashboardService {
  async getSummary(): Promise<DashboardSummary> {
    const [totalLeads, statusAgg, sourceAgg] = await Promise.all([
      Lead.countDocuments(),
      Lead.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Lead.aggregate([{ $group: { _id: '$source', count: { $sum: 1 } } }]),
    ]);

    const closedCount =
      statusAgg.find((s) => s._id === LeadStatus.Closed)?.count ?? 0;
    const conversionRate =
      totalLeads > 0 ? Math.round((closedCount / totalLeads) * 100 * 10) / 10 : 0;

    const byStatus = Object.values(LeadStatus).map((status) => ({
      status,
      count: statusAgg.find((s) => s._id === status)?.count ?? 0,
    }));

    const bySource = Object.values(LeadSource).map((source) => ({
      source,
      count: sourceAgg.find((s) => s._id === source)?.count ?? 0,
    }));

    return { totalLeads, conversionRate, byStatus, bySource };
  }
}

export const dashboardService = new DashboardService();
