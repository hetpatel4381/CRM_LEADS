import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Users, TrendingUp, Target, Activity, ArrowRight, AlertCircle } from 'lucide-react';
import { dashboardApi } from '@/api/dashboard';
import MetricCard from '@/features/dashboard/MetricCard';
import StatusChart from '@/features/dashboard/StatusChart';
import SourceChart from '@/features/dashboard/SourceChart';
import InsightBar from '@/features/dashboard/InsightBar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LeadStatus } from '@crm/shared';

export default function DashboardPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboard'],
    queryFn: dashboardApi.getSummary,
    refetchInterval: 30000,
  });

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4 text-muted-foreground">
        <AlertCircle className="h-12 w-12 text-destructive/60" />
        <p className="text-sm">Failed to load dashboard data. Please try again.</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  const getStatusCount = (status: LeadStatus) =>
    data?.byStatus.find((s) => s.status === status)?.count ?? 0;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Real-time overview of your leads</p>
        </div>
        <Button asChild size="sm">
          <Link to="/leads/new">
            Add Lead <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard
          title="Total Leads"
          value={isLoading ? '—' : data!.totalLeads}
          subtitle="All time leads captured"
          icon={Users}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50"
          isLoading={isLoading}
        />
        <MetricCard
          title="Conversion Rate"
          value={isLoading ? '—' : `${data!.conversionRate}%`}
          subtitle="Closed / Total leads"
          icon={TrendingUp}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
          isLoading={isLoading}
        />
        <MetricCard
          title="Active Leads"
          value={isLoading ? '—' : getStatusCount(LeadStatus.New) + getStatusCount(LeadStatus.Contacted)}
          subtitle="New + Contacted"
          icon={Activity}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
          isLoading={isLoading}
        />
        <MetricCard
          title="Site Visits"
          value={isLoading ? '—' : getStatusCount(LeadStatus.SiteVisit)}
          subtitle="Leads in site visit stage"
          icon={Target}
          iconColor="text-violet-600"
          iconBg="bg-violet-50"
          isLoading={isLoading}
        />
      </div>

      {/* Status breakdown row */}
      {!isLoading && data && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {data.byStatus.map((item) => (
            <Card key={item.status} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold">{item.count}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.status}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4 text-center">
                <div className="h-8 bg-muted animate-pulse rounded mb-1" />
                <div className="h-3 bg-muted animate-pulse rounded w-3/4 mx-auto" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Insights */}
      {!isLoading && data && data.totalLeads > 0 && (
        <InsightBar data={data} />
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatusChart data={data?.byStatus ?? []} isLoading={isLoading} />
        <SourceChart data={data?.bySource ?? []} isLoading={isLoading} />
      </div>

      {/* Quick link */}
      <div className="flex justify-end">
        <Button variant="outline" asChild>
          <Link to="/leads">
            View All Leads <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
