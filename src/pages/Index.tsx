
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Shield, CheckCircle, LayoutDashboard, Box, GithubIcon, Search } from "lucide-react";

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect to dashboard if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-primary mr-2" />
            <span className="text-xl font-bold">ScanSentry</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link to="/register">
              <Button>Sign up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent security-gradient">
            Secure Your Docker Containers
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Scan, identify, and fix vulnerabilities in your Docker images with our powerful security scanner.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="security-gradient">
                Get Started
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline">
                Try Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-card">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="stats-card">
              <LayoutDashboard className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Security Dashboard</h3>
              <p className="text-muted-foreground">
                Comprehensive overview of your security posture with actionable insights.
              </p>
            </div>
            <div className="stats-card">
              <Box className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Docker Image Scanning</h3>
              <p className="text-muted-foreground">
                Detect vulnerabilities in Docker images before deployment.
              </p>
            </div>
            <div className="stats-card">
              <CheckCircle className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Vulnerability Analysis</h3>
              <p className="text-muted-foreground">
                Detailed reports with severity ratings and remediation steps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to secure your containers?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start protecting your applications from vulnerabilities today.
          </p>
          <Link to="/register">
            <Button size="lg" className="security-gradient">
              Sign Up Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Shield className="h-6 w-6 text-primary mr-2" />
              <span className="font-semibold">ScanSentry</span>
            </div>
            <div className="flex items-center space-x-4">
              <a href="#" className="text-muted-foreground hover:text-foreground">
                <GithubIcon className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                Terms
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                Privacy
              </a>
            </div>
          </div>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} ScanSentry. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
