
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useScan } from "@/contexts/ScanContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Box, Search, AlertTriangle } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const scanSchema = z.object({
  imageUrl: z
    .string()
    .min(1, { message: "Image URL is required" })
    .refine(url => {
      // Basic validation for Docker image URL format
      return /^[a-zA-Z0-9]+(\/[a-zA-Z0-9\._-]+)?(:[a-zA-Z0-9\._-]+)?$/.test(url) || 
             /^[a-zA-Z0-9\.:]+\/[a-zA-Z0-9]+(\/[a-zA-Z0-9\._-]+)?(:[a-zA-Z0-9\._-]+)?$/.test(url);
    }, { message: "Invalid Docker image format. Use format like 'image:tag' or 'registry/image:tag'" }),
});

type ScanFormData = z.infer<typeof scanSchema>;

const DockerScanner = () => {
  const { scanImage, isScanning } = useScan();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("docker");
  
  const form = useForm<ScanFormData>({
    resolver: zodResolver(scanSchema),
    defaultValues: {
      imageUrl: "",
    },
  });
  
  const onSubmit = async (data: ScanFormData) => {
    await scanImage(data.imageUrl);
    navigate("/scan-results");
  };
  
  // Sample popular images
  const popularImages = [
    "nginx:latest",
    "node:16-alpine",
    "python:3.9-slim",
    "redis:alpine",
    "postgres:14",
    "ubuntu:22.04",
  ];
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Security Scanner</h1>
      
      <Tabs defaultValue="docker" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="docker">Docker Scanner</TabsTrigger>
          <TabsTrigger value="filesystem" disabled>
            File System <span className="ml-1 text-xs">(Coming Soon)</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="docker" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Docker Image Scanner</CardTitle>
              <CardDescription>
                Scan Docker images for vulnerabilities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Docker Image</FormLabel>
                        <FormControl>
                          <div className="flex space-x-2">
                            <Input 
                              placeholder="E.g., nginx:latest, ubuntu:22.04" 
                              {...field} 
                              className="flex-1"
                            />
                            <Button 
                              type="submit" 
                              disabled={isScanning}
                              className="security-gradient"
                            >
                              {isScanning ? (
                                "Scanning..."
                              ) : (
                                <>
                                  <Search className="mr-2 h-4 w-4" />
                                  Scan
                                </>
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
              
              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium mb-3">Popular Images</h3>
                <div className="flex flex-wrap gap-2">
                  {popularImages.map((image) => (
                    <Button
                      key={image}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        form.setValue("imageUrl", image);
                      }}
                    >
                      <Box className="mr-1 h-3 w-3" />
                      {image}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-primary/10 rounded-full p-2 mr-4">
                    <Box className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">1. Enter Docker Image</p>
                    <p className="text-sm text-muted-foreground">
                      Specify the Docker image you want to scan for vulnerabilities.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary/10 rounded-full p-2 mr-4">
                    <Search className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">2. Scan Analysis</p>
                    <p className="text-sm text-muted-foreground">
                      Our scanner checks for known vulnerabilities in packages and dependencies.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary/10 rounded-full p-2 mr-4">
                    <AlertTriangle className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">3. View Results</p>
                    <p className="text-sm text-muted-foreground">
                      Get detailed reports of vulnerabilities with severity ratings and remediation.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="relative overflow-hidden">
              <CardHeader>
                <CardTitle>Scanner Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-primary mr-2" />
                    <span>Detect OS and package vulnerabilities</span>
                  </li>
                  <li className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-primary mr-2" />
                    <span>Identify outdated dependencies</span>
                  </li>
                  <li className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-primary mr-2" />
                    <span>Detailed severity ratings</span>
                  </li>
                  <li className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-primary mr-2" />
                    <span>Remediation recommendations</span>
                  </li>
                  <li className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-primary mr-2" />
                    <span>CVE references and details</span>
                  </li>
                </ul>
              </CardContent>
              
              {isScanning && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center flex-col">
                  <div className="w-16 h-16 relative mb-4">
                    <div className="w-full h-full rounded-full border-2 border-primary/20"></div>
                    <div className="absolute top-0 w-full h-full rounded-full border-t-2 border-primary animate-spin"></div>
                  </div>
                  <p className="font-medium">Scanning Image...</p>
                  <p className="text-sm text-muted-foreground mt-1">This may take a few moments</p>
                </div>
              )}
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="filesystem">
          <Card>
            <CardHeader>
              <CardTitle>Coming Soon</CardTitle>
              <CardDescription>
                File system scanning will be available in a future update
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>The file system scanner will allow you to scan local directories for security issues in your code.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DockerScanner;
