import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import Link from "next/link";
import { Shield, Lock, Eye, Upload, Search, CheckCircle } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="py-16 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-3 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
              <Shield className="w-4 h-4" />
              Secure • Anonymous • Encrypted
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
            Fight Corruption <span className="text-blue-600">Safely</span>
          </h1>
          
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Report corruption and unethical practices with complete anonymity. 
            Your identity is protected with military-grade encryption.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="/report" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-lg py-6 px-8">
                <Upload className="w-5 h-5 mr-2" />
                Report Anonymously
              </Button>
            </Link>
            <Link href="/track" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto text-lg py-6 px-8 border-2">
                <Search className="w-5 h-5 mr-2" />
                Track Your Case
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 text-slate-700">
              <Lock className="w-5 h-5 text-green-600" />
              <span>End-to-End Encrypted</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-slate-700">
              <Eye className="w-5 h-5 text-green-600" />
              <span>No Personal Data Collected</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-slate-700">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>Government Integrated</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="py-12 px-4 max-w-6xl mx-auto">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Column - Reporting Card */}
          <Card className="p-8 border-2 border-blue-100 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Upload className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Safe Reporting Process</h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Submit Evidence Securely</h3>
                  <p className="text-slate-600 text-sm mt-1">
                    Upload documents, photos, or videos. All metadata is automatically removed for your protection.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Get Secure Tracking ID</h3>
                  <p className="text-slate-600 text-sm mt-1">
                    Receive an encrypted SHA-256 tracking code. This is your only way to follow up - keep it safe.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Monitor Progress Anonymously</h3>
                  <p className="text-slate-600 text-sm mt-1">
                    Use your tracking ID to check case status and communicate securely with investigators.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200">
              <Link href="/report">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3">
                  Start Anonymous Report
                </Button>
              </Link>
            </div>
          </Card>

          {/* Right Column - Features & Security */}
          <div className="space-y-8">
            {/* Security Features Card */}
            <Card className="p-6 border-2 border-green-100">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-5 h-5 text-green-600" />
                <h3 className="text-lg font-semibold text-slate-900">Maximum Security Guarantee</h3>
              </div>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  No registration or personal information required
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  End-to-end encrypted communications
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Automatic metadata removal from files
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Tor network compatible for extra anonymity
                </li>
              </ul>
            </Card>

            {/* Supported Evidence Card */}
            <Card className="p-6 border-2 border-purple-100">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Supported Evidence Types</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  Documents (PDF, DOC)
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  Photos & Images
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  Video Files
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  Audio Recordings
                </div>
              </div>
            </Card>

            {/* Admin Access Card */}
            <Card className="p-6 border-2 border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Government & Admin Access</h3>
              <div className="space-y-3">
                <Link href="/admin/login" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    Agency Portal Login
                  </Button>
                </Link>
                <Link href="/super-admin/login" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    Super Admin Portal
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-12 px-4 bg-slate-900 text-white rounded-lg">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-slate-300 mb-6">
            Join thousands of citizens fighting corruption safely and effectively.
          </p>
          <Link href="/report">
            <Button className="bg-white text-slate-900 hover:bg-slate-100 text-lg py-3 px-8">
              Report Corruption Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}