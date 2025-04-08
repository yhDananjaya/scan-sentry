
import React, { createContext, useState, useContext } from "react";
import { toast } from "@/components/ui/sonner";

export type Vulnerability = {
  id: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  cveId?: string;
  affected: string;
  recommendation: string;
};

export type ScanResult = {
  id: string;
  imageUrl: string;
  timestamp: string;
  status: "completed" | "failed" | "scanning";
  vulnerabilities: Vulnerability[];
  summary: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    total: number;
  };
};

interface ScanContextType {
  scanResults: ScanResult[];
  currentScan: ScanResult | null;
  isScanning: boolean;
  scanImage: (imageUrl: string) => Promise<void>;
  selectScan: (scanId: string) => void;
}

const ScanContext = createContext<ScanContextType | undefined>(undefined);

export const ScanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [currentScan, setCurrentScan] = useState<ScanResult | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);

  // Mock vulnerabilities for demo
  const mockVulnerabilities: Vulnerability[] = [
    {
      id: "vuln-1",
      title: "Outdated OpenSSL Library",
      description: "OpenSSL versions before 1.1.1k are vulnerable to a buffer overflow attack.",
      severity: "critical",
      cveId: "CVE-2021-3449",
      affected: "openssl:1.1.1j",
      recommendation: "Update to OpenSSL 1.1.1k or later."
    },
    {
      id: "vuln-2",
      title: "JWT Token Validation Bypass",
      description: "Json Web Token validation can be bypassed due to improper signature verification.",
      severity: "high",
      cveId: "CVE-2022-23529",
      affected: "jsonwebtoken:4.0.0",
      recommendation: "Update to the latest version and implement proper token validation."
    },
    {
      id: "vuln-3",
      title: "Prototype Pollution in lodash",
      description: "Lodash versions before 4.17.21 are vulnerable to prototype pollution attacks.",
      severity: "medium",
      cveId: "CVE-2021-23337",
      affected: "lodash:4.17.20",
      recommendation: "Update to lodash 4.17.21 or later."
    },
    {
      id: "vuln-4",
      title: "Path Traversal in express-fileupload",
      description: "A malicious user could upload files with ../ in the filename to access unauthorized directories.",
      severity: "high",
      cveId: "CVE-2020-7699",
      affected: "express-fileupload:1.1.7",
      recommendation: "Update to express-fileupload 1.1.10 or later and validate filenames."
    },
    {
      id: "vuln-5",
      title: "Node.js ReDoS vulnerability",
      description: "Regular expression denial of service vulnerability in Node.js HTTP request parsing.",
      severity: "low",
      cveId: "CVE-2021-22931",
      affected: "node:14.16.0",
      recommendation: "Update to Node.js 14.16.1 or later."
    }
  ];

  // A function to generate random vulnerabilities for a scan
  const generateRandomVulnerabilities = () => {
    // Select random vulnerabilities from the mock list
    const shuffled = [...mockVulnerabilities].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.floor(Math.random() * 5) + 1);
    
    return selected;
  };

  const scanImage = async (imageUrl: string) => {
    try {
      setIsScanning(true);
      toast.info("Starting scan on " + imageUrl);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate random vulnerabilities
      const vulns = generateRandomVulnerabilities();
      
      // Count by severity
      const summary = {
        critical: vulns.filter(v => v.severity === "critical").length,
        high: vulns.filter(v => v.severity === "high").length,
        medium: vulns.filter(v => v.severity === "medium").length,
        low: vulns.filter(v => v.severity === "low").length,
        total: vulns.length
      };
      
      const newScan: ScanResult = {
        id: Date.now().toString(),
        imageUrl,
        timestamp: new Date().toISOString(),
        status: "completed",
        vulnerabilities: vulns,
        summary
      };
      
      // Update state
      setScanResults(prev => [newScan, ...prev]);
      setCurrentScan(newScan);
      
      toast.success(`Scan completed with ${summary.total} vulnerabilities found`);
    } catch (error) {
      toast.error("Scan failed: " + (error as Error).message);
    } finally {
      setIsScanning(false);
    }
  };

  const selectScan = (scanId: string) => {
    const scan = scanResults.find(s => s.id === scanId);
    if (scan) {
      setCurrentScan(scan);
    }
  };

  return (
    <ScanContext.Provider
      value={{
        scanResults,
        currentScan,
        isScanning,
        scanImage,
        selectScan
      }}
    >
      {children}
    </ScanContext.Provider>
  );
};

export const useScan = () => {
  const context = useContext(ScanContext);
  if (context === undefined) {
    throw new Error("useScan must be used within a ScanProvider");
  }
  return context;
};
