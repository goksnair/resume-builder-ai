import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Download, Edit, Brain, BarChart3, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-6 py-12">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            AI-Powered Resume Builder
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Create professional resumes and get AI-powered optimization suggestions
          </p>
          <div className="flex justify-center space-x-4">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link to="/ai">
                <Brain className="mr-2 h-5 w-5" />
                Try AI Analysis
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/builder">
                <Edit className="mr-2 h-5 w-5" />
                Start Building
              </Link>
            </Button>
          </div>
        </header>

        <section className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <FileText className="mx-auto h-12 w-12 text-blue-600 mb-4" />
              <CardTitle>Professional Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Choose from a variety of modern, ATS-friendly templates designed by professionals
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Brain className="mx-auto h-12 w-12 text-green-600 mb-4" />
              <CardTitle>AI-Powered Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Get intelligent feedback and optimization suggestions using advanced AI technology
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Download className="mx-auto h-12 w-12 text-purple-600 mb-4" />
              <CardTitle>Export & Share</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Download your optimized resume as PDF or share it online with potential employers
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="bg-white rounded-lg shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            AI Features
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <BarChart3 className="mx-auto h-10 w-10 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">ATS Score Analysis</h3>
              <p className="text-gray-600">
                Get a compatibility score showing how well your resume matches job requirements
              </p>
            </div>
            <div className="text-center">
              <Zap className="mx-auto h-10 w-10 text-yellow-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Keyword Optimization</h3>
              <p className="text-gray-600">
                Identify missing keywords and get suggestions to improve your resume's visibility
              </p>
            </div>
            <div className="text-center">
              <Brain className="mx-auto h-10 w-10 text-green-600 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Smart Recommendations</h3>
              <p className="text-gray-600">
                Receive personalized suggestions to enhance your resume's impact and effectiveness
              </p>
            </div>
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to optimize your resume?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Try our AI-powered analysis and get actionable insights in seconds
          </p>
          <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Link to="/ai">
              <Brain className="mr-2 h-5 w-5" />
              Start AI Analysis
            </Link>
          </Button>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
