
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useScan } from "@/contexts/ScanContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Activity, AlertTriangle, Box, Clock, FileWarning, Shield, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

const Dashboard = () => {
  const { user } = useAuth();
  const { scanResults } = useScan();
  
  // Calculate quick stats
  const totalVulnerabilities = scanResults.reduce((acc, scan) => 
    acc + scan.summary.total, 0);
  
  const criticalVulns = scanResults.reduce((acc, scan) => 
    acc + scan.summary.critical, 0);
  
  const highVulns = scanResults.reduce((acc, scan) => 
    acc + scan.summary.high, 0);
  
  const securityScore = scanResults.length > 0 
    ? Math.max(0, 100 - (criticalVulns * 10) - (highVulns * 5))
    : 100;
  
  // Mock recent activity
  const recentActivity = [
    { id: 1, type: "scan", user: user?.name, target: "nginx:latest", time: "2 hours ago" },
    { id: 2, type: "fix", user: "System", target: "CVE-2022-1234", time: "1 day ago" },
    { id: 3, type: "alert", user: "System", target: "Critical vulnerability in node:14", time: "3 days ago" },
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
        <Link to="/docker-scanner">
          <Button className="security-gradient">
            <Box className="mr-2 h-4 w-4" />
            New Scan
          </Button>
        </Link>
      </div>
      
      {/* Quick stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Security Score</p>
                <p className="text-2xl font-bold">{securityScore}%</p>
              </div>
              <Shield className={cn(
                "h-8 w-8",
                securityScore > 80 ? "text-security-low" : 
                securityScore > 60 ? "text-security-medium" : 
                "text-security-high"
              )} />
            </div>
            <Progress 
              value={securityScore} 
              className="mt-3 h-2"
              indicatorClassName={cn(
                securityScore > 80 ? "bg-security-low" : 
                securityScore > 60 ? "bg-security-medium" : 
                "bg-security-high"
              )}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Recent Scans</p>
                <p className="text-2xl font-bold">{scanResults.length}</p>
              </div>
              <Box className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-3 text-sm text-muted-foreground">
              {scanResults.length > 0 
                ? `Last scan: ${new Date(scanResults[0]?.timestamp).toLocaleDateString()}`
                : "No scans yet"}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Critical Findings</p>
                <p className="text-2xl font-bold">{criticalVulns}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-security-high" />
            </div>
            <div className="mt-3 text-sm text-muted-foreground">
              {highVulns} high severity issues
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Vulnerabilities</p>
                <p className="text-2xl font-bold">{totalVulnerabilities}</p>
              </div>
              <FileWarning className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-3 text-sm text-muted-foreground">
              Across {scanResults.length} scanned images
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Two-column layout for activity and recent scans */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent scans */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Scans</CardTitle>
            <CardDescription>Your latest Docker image scans</CardDescription>
          </CardHeader>
          <CardContent>
            {scanResults.length > 0 ? (
              <div className="space-y-4">
                {scanResults.slice(0, 5).map((scan) => (
                  <div key={scan.id} className="flex items-center justify-between p-3 rounded-md bg-secondary/50">
                    <div className="flex items-center">
                      <Box className="h-5 w-5 text-primary mr-3" />
                      <div>
                        <p className="font-medium truncate max-w-[200px]">{scan.imageUrl}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(scan.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="flex mr-4">
                        <span className="text-security-critical font-medium mr-1">{scan.summary.critical}</span>
                        <span className="text-security-high font-medium mr-1">{scan.summary.high}</span>
                        <span className="text-security-medium font-medium mr-1">{scan.summary.medium}</span>
                        <span className="text-security-low font-medium">{scan.summary.low}</span>
                      </div>
                      <Link to={`/scan-results/${scan.id}`}>
                        <Button variant="outline" size="sm">View</Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Box className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No scans yet</p>
                <Link to="/docker-scanner" className="mt-4 inline-block">
                  <Button>Start Scanning</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Activity timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Timeline</CardTitle>
            <CardDescription>Recent security events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex">
                  <div className="mr-4 flex flex-col items-center">
                    <div className={cn(
                      "rounded-full p-1",
                      activity.type === "scan" ? "bg-primary/10 text-primary" :
                      activity.type === "fix" ? "bg-security-low/10 text-security-low" :
                      "bg-security-high/10 text-security-high"
                    )}>
                      {activity.type === "scan" ? (
                        <Terminal className="h-4 w-4" />
                      ) : activity.type === "fix" ? (
                        <Shield className="h-4 w-4" />
                      ) : (
                        <AlertTriangle className="h-4 w-4" />
                      )}
                    </div>
                    <div className="h-full w-px bg-border mt-1" />
                  </div>
                  <div className="pb-6">
                    <p className="text-sm font-medium">
                      {activity.user} {activity.type === "scan" ? "scanned" : activity.type === "fix" ? "fixed" : "detected"} {activity.target}
                    </p>
                    <div className="flex items-center mt-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" /> 
                      {activity.time}
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="flex">
                <div className="mr-4 flex flex-col items-center">
                  <div className="rounded-full p-1 bg-primary/10 text-primary">
                    <Activity className="h-4 w-4" />
                  </div>
                </div>
                <div>
                  <Link to="/scan-results">
                    <Button variant="ghost" size="sm" className="text-primary">
                      View All Activity
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Feature overview cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-card border-primary/20">
          <CardContent className="pt-6">
            <Shield className="h-8 w-8 text-primary mb-2" />
            <h3 className="text-lg font-medium mb-1">Docker Scanner</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Scan Docker images for security vulnerabilities
            </p>
            <Link to="/docker-scanner">
              <Button variant="outline" size="sm">Scan Now</Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-primary/20">
          <CardContent className="pt-6">
            <Activity className="h-8 w-8 text-primary mb-2" />
            <h3 className="text-lg font-medium mb-1">Analysis Reports</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Detailed vulnerability reports with recommendations
            </p>
            <Link to="/scan-results">
              <Button variant="outline" size="sm">View Reports</Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-primary/20">
          <CardContent className="pt-6">
            <Terminal className="h-8 w-8 text-primary mb-2" />
            <h3 className="text-lg font-medium mb-1">Coming Soon</h3>
            <p className="text-sm text-muted-foreground mb-4">
              File system scanner and AI insights
            </p>
            <Button variant="outline" size="sm" disabled>
              Preview
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
