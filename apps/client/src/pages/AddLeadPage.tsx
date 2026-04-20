import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { ChevronLeft } from 'lucide-react';
import { leadsApi } from '@/api/leads';
import LeadForm from '@/features/leads/LeadForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreateLeadDto } from '@crm/shared';

export default function AddLeadPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreateLeadDto) => leadsApi.create(data),
    onSuccess: (lead) => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Lead added successfully!');
      navigate(`/leads/${lead._id}`);
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to add lead');
    },
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/leads">
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Add New Lead</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Capture a new real estate lead</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Lead Information</CardTitle>
          <CardDescription>
            Fields marked with <span className="text-destructive">*</span> are required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LeadForm onSubmit={mutation.mutate} isSubmitting={mutation.isPending} />
        </CardContent>
      </Card>
    </div>
  );
}
