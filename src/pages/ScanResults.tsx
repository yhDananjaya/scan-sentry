
import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useScan, type Vulnerability } from "@/contexts/ScanContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Box, 
  AlertTriangle, 
  ShieldAlert, 
  Clock, 
  FileWarning, 
  CheckCircle, 
  ExternalLink 
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const SeverityBadge = ({ severity }: { severity: Vulnerability["severity"] }) => {
  const severityConfig = {
    critical: {
      color: "bg-security-critical text-white",
      label: "Critical",
    },
    high: {
      color: "bg-security-high text-white",
      label: "High",
    },
    medium: {
      color: "bg-security-medium text-white",
      label: "Medium",
    },
    low: {
      color: "bg-security-low text-white",
      label: "Low",
    },
  };

  const config = severityConfig[severity];

  return (
    <Badge className={config.color}>
      {config.label}
    </Badge>
  );
};

const ScanResults = () => {
  const { scanId } = useParams<{ scanId?: string }>();
  const { scanResults, currentScan, selectScan } = useScan();
  const [activeTab, setActiveTab] = React.useState("summary");
  
  useEffect(() => {
    if (scanId && scanResults.length > 0) {
      selectScan(scanId);
    } else if (scanResults.length > 0 && !currentScan) {
      // Select the most recent scan if none is selected
      selectScan(scanResults[0].id);
    }
  }, [scanId, scanResults, currentScan, selectScan]);
  
  if (!currentScan) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <FileWarning className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">No Scan Results</h2>
        <p className="text-muted-foreground mb-6">
          You haven't performed any scans yet.
        </p>
        <Link to="/docker-scanner">
          <Button className="security-gradient">
            <Box className="mr-2 h-4 w-4" />
            Start a New Scan
          </Button>
        </Link>
      </div>
    );
  }
  
  const vulnerabilitiesBySeverity = {
    critical: currentScan.vulnerabilities.filter(v => v.severity === "critical"),
    high: currentScan.vulnerabilities.filter(v => v.severity === "high"),
    medium: currentScan.vulnerabilities.filter(v => v.severity === "medium"),
    low: currentScan.vulnerabilities.filter(v => v.severity === "low"),
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Link to="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold">Scan Results</h1>
        </div>
        
        <Link to="/docker-scanner">
          <Button>
            <Box className="mr-2 h-4 w-4" />
            New Scan
          </Button>
        </Link>
      </div>
      
      {/* Scan Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-4 md:mb-0">
              <h2 className="text-lg font-semibold flex items-center">
                <Box className="h-5 w-5 mr-2 text-primary" />
                {currentScan.imageUrl}
              </h2>
              <div className="flex items-center mt-1 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                Scanned on {new Date(currentScan.timestamp).toLocaleString()}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Critical</div>
                <div className="text-2xl font-bold text-security-critical">
                  {currentScan.summary.critical}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground">High</div>
                <div className="text-2xl font-bold text-security-high">
                  {currentScan.summary.high}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Medium</div>
                <div className="text-2xl font-bold text-security-medium">
                  {currentScan.summary.medium}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Low</div>
                <div className="text-2xl font-bold text-security-low">
                  {currentScan.summary.low}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>
        
        {/* Summary Tab */}
        <TabsContent value="summary" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className={cn(
              "col-span-1",
              currentScan.summary.critical > 0 ? "border-security-critical/50" : ""
            )}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <ShieldAlert className="h-5 w-5 mr-2 text-security-critical" />
                  Critical
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1">{currentScan.summary.critical}</div>
                <p className="text-sm text-muted-foreground">
                  {currentScan.summary.critical > 0 
                    ? "Needs immediate attention" 
                    : "No critical issues found"}
                </p>
              </CardContent>
            </Card>
            
            <Card className={cn(
              "col-span-1",
              currentScan.summary.high > 0 ? "border-security-high/50" : ""
            )}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-security-high" />
                  High
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1">{currentScan.summary.high}</div>
                <p className="text-sm text-muted-foreground">
                  {currentScan.summary.high > 0 
                    ? "High priority issues" 
                    : "No high issues found"}
                </p>
              </CardContent>
            </Card>
            
            <Card className={cn(
              "col-span-1",
              currentScan.summary.medium > 0 ? "border-security-medium/50" : ""
            )}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <FileWarning className="h-5 w-5 mr-2 text-security-medium" />
                  Medium
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1">{currentScan.summary.medium}</div>
                <p className="text-sm text-muted-foreground">
                  {currentScan.summary.medium > 0 
                    ? "Should be addressed" 
                    : "No medium issues found"}
                </p>
              </CardContent>
            </Card>
            
            <Card className={cn(
              "col-span-1",
              currentScan.summary.low > 0 ? "border-security-low/50" : ""
            )}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-security-low" />
                  Low
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-1">{currentScan.summary.low}</div>
                <p className="text-sm text-muted-foreground">
                  {currentScan.summary.low > 0 
                    ? "Low priority issues" 
                    : "No low issues found"}
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Vulnerability summary by severity */}
          <Card>
            <CardHeader>
              <CardTitle>Vulnerability Breakdown</CardTitle>
              <CardDescription>Detailed breakdown of detected issues</CardDescription>
            </CardHeader>
            <CardContent>
              {currentScan.vulnerabilities.length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(vulnerabilitiesBySeverity).map(([severity, vulns]) => {
                    if (vulns.length === 0) return null;
                    return (
                      <div key={severity}>
                        <h3 className="font-medium mb-2 flex items-center">
                          <SeverityBadge severity={severity as Vulnerability["severity"]} />
                          <span className="ml-2">
                            {vulns.length} {vulns.length === 1 ? "issue" : "issues"}
                          </span>
                        </h3>
                        <ul className="space-y-1 pl-6 list-disc text-sm">
                          {vulns.map(vuln => (
                            <li key={vuln.id}>
                              {vuln.title} 
                              {vuln.cveId && (
                                <span className="ml-1 text-muted-foreground">
                                  ({vuln.cveId})
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-6">
                  <CheckCircle className="h-8 w-8 text-security-low mx-auto mb-2" />
                  <p>No vulnerabilities detected</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Details Tab */}
        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Analysis</CardTitle>
              <CardDescription>Complete list of detected vulnerabilities</CardDescription>
            </CardHeader>
            <CardContent>
              {currentScan.vulnerabilities.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Severity</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Affected Package</TableHead>
                      <TableHead>CVE ID</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentScan.vulnerabilities.map((vuln) => (
                      <TableRow key={vuln.id}>
                        <TableCell>
                          <SeverityBadge severity={vuln.severity} />
                        </TableCell>
                        <TableCell>{vuln.title}</TableCell>
                        <TableCell>{vuln.affected}</TableCell>
                        <TableCell>
                          {vuln.cveId ? (
                            <a 
                              href={`https://nvd.nist.gov/vuln/detail/${vuln.cveId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-primary hover:underline"
                            >
                              {vuln.cveId}
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          ) : (
                            "N/A"
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-6">
                  <CheckCircle className="h-8 w-8 text-security-low mx-auto mb-2" />
                  <p>No vulnerabilities detected</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Remediation Recommendations</CardTitle>
              <CardDescription>Steps to fix vulnerabilities</CardDescription>
            </CardHeader>
            <CardContent>
              {currentScan.vulnerabilities.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                  {currentScan.vulnerabilities.map((vuln) => (
                    <AccordionItem key={vuln.id} value={vuln.id}>
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center">
                          <SeverityBadge severity={vuln.severity} />
                          <span className="ml-2">{vuln.title}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <div>
                          <h4 className="font-medium">Description</h4>
                          <p className="text-sm text-muted-foreground">{vuln.description}</p>
                        </div>
                        <div>
                          <h4 className="font-medium">Affected Component</h4>
                          <p className="text-sm text-muted-foreground">{vuln.affected}</p>
                        </div>
                        <div>
                          <h4 className="font-medium">Recommended Action</h4>
                          <p className="text-sm text-muted-foreground">{vuln.recommendation}</p>
                        </div>
                        {vuln.cveId && (
                          <div>
                            <h4 className="font-medium">Reference</h4>
                            <a 
                              href={`https://nvd.nist.gov/vuln/detail/${vuln.cveId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline flex items-center"
                            >
                              {vuln.cveId} - National Vulnerability Database
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </a>
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                <div className="text-center py-6">
                  <CheckCircle className="h-8 w-8 text-security-low mx-auto mb-2" />
                  <p>No remediation needed</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ScanResults;
