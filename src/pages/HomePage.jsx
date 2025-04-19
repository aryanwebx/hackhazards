import React from 'react';
import FileUploader from '../components/FileUploader';
import { Shield, AlertTriangle, FileWarning, CheckCircle2 } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-26 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Empowering digital spaces with intelligent content moderation
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-indigo-100">
              Scan any file for harmful content, spam, or sensitive material with our advanced analysis engine.
            </p>
            <div className="mt-10">
              <FileUploader />
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center mt-16 text-center gap-8">
            <div className="w-full sm:w-20 px-4 py-3 bg-white/10 rounded-lg border border-white/40">
              <Shield className="w-6 h-6 mx-auto mb-2 text-indigo-200" />
              <span className="text-sm font-medium">Detect</span>
            </div>
            <div className="w-full sm:w-20 px-4 py-3 bg-white/10 rounded-lg border border-white/40">
              <AlertTriangle className="w-6 h-6 mx-auto mb-2 text-amber-300" />
              <span className="text-sm font-medium">Flag</span>
            </div>
            <div className="w-full sm:w-20 px-4 py-3 bg-white/10 rounded-lg border border-white/40">
              <CheckCircle2 className="w-6 h-6 mx-auto mb-2 text-green-300" />
              <span className="text-sm font-medium">Protect</span>
            </div>
          </div>

        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How SafeNet Works</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our advanced content moderation platform uses AI to scan and analyzef file for problematic content across multiple formats.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Shield className="h-10 w-10 text-indigo-600" />}
              title="Content Analysis"
              description="Our engine scans text, images, and embedded content to detect potentially harmful material across multiple categories."
            />
            <FeatureCard 
              icon={<FileWarning className="h-10 w-10 text-amber-500" />}
              title="Spam Detection"
              description="Identify phishing attempts, misleading content, clickbait, and other deceptive practices."
            />
            <FeatureCard 
              icon={<CheckCircle2 className="h-10 w-10 text-green-600" />}
              title="Safety Scoring"
              description="Get a comprehensive safety score with detailed breakdowns of different content categories."
            />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What We Detect</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our comprehensive analysis covers a wide range of potentially problematic content categories.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <CategoryCard 
              title="Adult Content"
              description="Detect explicit material, nudity, and age-inappropriate content."
              color="bg-pink-100 text-pink-700 border-pink-200"
            />
            <CategoryCard 
              title="Violence & Gore"
              description="Identify violent imagery, descriptions of harm, and graphic content."
              color="bg-red-100 text-red-700 border-red-200"
            />
            <CategoryCard 
              title="Hate Speech"
              description="Detect discriminatory language, slurs, and targeted harassment."
              color="bg-orange-100 text-orange-700 border-orange-200"
            />
            <CategoryCard 
              title="Spam & Scams"
              description="Identify phishing attempts, misleading offers, and deceptive content."
              color="bg-amber-100 text-amber-700 border-amber-200"
            />
            <CategoryCard 
              title="Misinformation"
              description="Detect potentially false claims, misleading statistics, and unverified information."
              color="bg-blue-100 text-blue-700 border-blue-200"
            />
            <CategoryCard 
              title="Malware Risk"
              description="Identify potential security threats, suspicious scripts, and harmful redirects."
              color="bg-purple-100 text-purple-700 border-purple-200"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-indigo-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to analyze a file?</h2>
          <p className="text-lg text-indigo-100 mb-10 max-w-2xl mx-auto">
            Get comprehensive content analysis and safety scoring for any file in seconds.
          </p>
          <div className="max-w-xl mx-auto">
            <FileUploader colorbtn="bg-indigo-800" hvcolor="hover:bg-indigo-900"/>
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 transition-all duration-300 hover:shadow-lg">
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const CategoryCard = ({ title, description, color }) => (
  <div className={`p-6 rounded-lg border ${color} transition-all duration-300 hover:shadow-md`}>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-gray-700">{description}</p>
  </div>
);

export default HomePage;