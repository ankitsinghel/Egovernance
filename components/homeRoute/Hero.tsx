import Link from "next/link";
import { Button } from "../ui/button";
import { Shield, Upload, Search, CheckCircle, Eye, Lock } from "lucide-react";

export default function Hero() {
  return (
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
            <Button
              variant="outline"
              className="w-full sm:w-auto text-lg py-6 px-8 border-2"
            >
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
  );
}
