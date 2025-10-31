import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import{ Navigate } from "react-router-dom";
import { BarChart3, Users, ClipboardCheck } from "lucide-react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-semibold">Welcome to TalentFlow</h1>
      <p className="text-muted-foreground text-sm max-w-2xl">
        TalentFlow helps HR teams manage job postings, candidates, and assessments — 
        all in one smooth, local-first interface.
      </p>

      <div className="grid gap-6 md:grid-cols-3 mt-8">
        <Link to="/jobs">
          <Card className="hover:shadow-md transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Jobs</CardTitle>
              <BarChart3 className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Create, edit, and organize active job postings.
            </CardContent>
          </Card>
        </Link>

        <Link to="/candidates">
          <Card className="hover:shadow-md transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Candidates</CardTitle>
              <Users className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Track candidate progress through hiring stages.
            </CardContent>
          </Card>
        </Link>

        <Link to="/assessments">
          <Card className="hover:shadow-md transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Assessments</CardTitle>
              <ClipboardCheck className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Build and preview role-specific assessments.
            </CardContent>
          </Card>
        </Link>
      </div>
      <div className="grid grid-cols-3 gap-6 mt-8">
            <Card>
                <CardHeader>
                <CardTitle>Active Jobs</CardTitle>
                </CardHeader>
                <CardContent className="text-3xl font-bold">12</CardContent>
            </Card>
            <Card>
                <CardHeader>
                <CardTitle>Total Candidates</CardTitle>
                </CardHeader>
                <CardContent className="text-3xl font-bold">1,024</CardContent>
            </Card>
            <Card>
                <CardHeader>
                <CardTitle>Assessments Created</CardTitle>
                </CardHeader>
                <CardContent className="text-3xl font-bold">5</CardContent>
            </Card>
        </div>

    </div>
  );
}
