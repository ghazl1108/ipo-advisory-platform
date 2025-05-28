import { Link } from "react-router-dom"
import { Button } from "../components/ui/Button"
import {
  ArrowRight,
  BarChart3,
  LineChart,
  TrendingUp,
  Database,
  BrainCircuit,
  AlertTriangle,
  DollarSign,
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 to-slate-50 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight">
                Predict Your IPO Success with Confidence
              </h1>
              <p className="text-xl text-slate-600 max-w-2xl">
                AI-powered predictions for Offer Price, Day 1 Close, and Risk Analysis.
              </p>
              <div className="pt-4">
                <Link to="/register">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                    Register Your Company Today
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex-1">
              {/* Using absolute path to the image in public folder */}
              <img
                src="/images/hero-illustration.png"
                alt="IPO Prediction Illustration"
                className="w-full h-auto rounded-lg shadow-md"
                onError={(e) => {
                  console.error("Hero image failed to load")
                  e.target.style.display = "none"
                  e.target.parentNode.style.minHeight = "300px"
                  e.target.parentNode.style.backgroundColor = "#f1f5f9"
                  e.target.parentNode.style.borderRadius = "0.5rem"
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* About the Service */}
      <section className="py-16 bg-white" id="about">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">About Our IPO Prediction Service</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              IPO pricing and risk assessment have traditionally been challenging and uncertain. Our AI-powered solution
              changes that.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-slate-50 p-6 rounded-lg text-center hover:shadow-md transition-shadow">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-900">Reduce Uncertainty</h3>
              <p className="text-slate-600">
                Our AI models analyze hundreds of data points to provide accurate predictions, reducing the guesswork in
                IPO planning.
              </p>
            </div>
            <div className="bg-slate-50 p-6 rounded-lg text-center hover:shadow-md transition-shadow">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-900">Plan Pricing Better</h3>
              <p className="text-slate-600">
                Optimize your IPO pricing strategy with data-driven insights that maximize capital raised while ensuring
                market success.
              </p>
            </div>
            <div className="bg-slate-50 p-6 rounded-lg text-center hover:shadow-md transition-shadow">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <LineChart className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-900">Improve Success Rate</h3>
              <p className="text-slate-600">
                Companies using our predictions have seen a 40% higher success rate in meeting their IPO goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-slate-50" id="how-it-works">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How Our IPO Prediction Model Works</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Our advanced AI system analyzes multiple data points to provide accurate IPO predictions, helping
              companies make informed decisions.
            </p>
          </div>

          {/* AI Methodology */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Database className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-slate-900 text-center">Data Collection</h3>
                <p className="text-slate-600">
                  We analyze over 30 key financial metrics, market conditions, and company-specific factors that
                  influence IPO performance.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BrainCircuit className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-slate-900 text-center">AI Analysis</h3>
                <p className="text-slate-600">
                  Our machine learning models identify correlations between your company's data and historical IPO
                  outcomes for accurate predictions.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LineChart className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-slate-900 text-center">Results & Insights</h3>
                <p className="text-slate-600">
                  Receive detailed predictions for offer price, day 1 performance, and risk assessment with actionable
                  recommendations.
                </p>
              </div>
            </div>
          </div>

          {/* Prediction Process Flowchart */}
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-semibold text-slate-900 mb-8 text-center">The Prediction Process</h3>

            <div className="relative">
              {/* Process Steps */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-blue-200 -translate-x-1/2"></div>

              <div className="space-y-12 md:space-y-24">
                {/* Step 1 */}
                <div className="relative flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-8">
                  <div className="md:w-1/2 md:text-right md:pr-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold text-slate-900 mb-2">1. Data Submission</h4>
                      <p className="text-slate-600">
                        Complete our comprehensive form with your company's financial data, market position, and IPO
                        goals.
                      </p>
                    </div>
                  </div>
                  <div className="z-10 flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold md:absolute md:left-1/2 md:-translate-x-1/2">
                    1
                  </div>
                  <div className="md:w-1/2 md:pl-8 hidden md:block"></div>
                </div>

                {/* Step 2 */}
                <div className="relative flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-8">
                  <div className="md:w-1/2 md:text-right md:pr-8 hidden md:block"></div>
                  <div className="z-10 flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold md:absolute md:left-1/2 md:-translate-x-1/2">
                    2
                  </div>
                  <div className="md:w-1/2 md:pl-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold text-slate-900 mb-2">2. AI Processing</h4>
                      <p className="text-slate-600">
                        Our AI model analyzes your data against market trends and historical patterns to generate
                        predictions.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-8">
                  <div className="md:w-1/2 md:text-right md:pr-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                      <h4 className="text-lg font-semibold text-slate-900 mb-2">3. Results Generation</h4>
                      <p className="text-slate-600">
                        The system produces detailed predictions for offer price, first-day performance, and identifies
                        potential risks.
                      </p>
                    </div>
                  </div>
                  <div className="z-10 flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold md:absolute md:left-1/2 md:-translate-x-1/2">
                    3
                  </div>
                  <div className="md:w-1/2 md:pl-8 hidden md:block"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Predictions Section */}
      <section className="py-16 bg-white" id="predictions">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">IPO Predictions</h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Our AI model provides three key predictions to help you navigate your IPO journey with confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-slate-50 p-6 rounded-lg text-center hover:shadow-md transition-shadow">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-900">Offer Price Prediction</h3>
              <p className="text-slate-600">
                Get an optimal price range for your IPO based on company financials, market conditions, and comparable
                offerings.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-lg text-center hover:shadow-md transition-shadow">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-900">Day 1 Performance</h3>
              <p className="text-slate-600">
                Forecast first-day trading performance with expected price movement ranges and trading volume estimates.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-lg text-center hover:shadow-md transition-shadow">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-900">Risk Analysis</h3>
              <p className="text-slate-600">
                Identify potential risk factors specific to your company and market conditions with mitigation
                strategies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section removed as requested */}
    </div>
  )
}
