"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Download, Share2, Check } from "lucide-react"
import { Button } from "../components/ui/Button"

export default function ResultsPage() {
  const [loading, setLoading] = useState(true)
  const [results, setResults] = useState(null)
  const [userData, setUserData] = useState(null)
  const [downloadLoading, setDownloadLoading] = useState(false)
  const [shareLoading, setShareLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  // Load data from localStorage (either backend response or fallback)
  useEffect(() => {
    // Get registration data from localStorage
    const storedData = localStorage.getItem("registrationData")
    if (storedData) {
      const parsedData = JSON.parse(storedData)
      setUserData(parsedData)

      // Check if we have backend response data
      if (parsedData.backendResponse) {
        console.log("Backend response data found:", parsedData.backendResponse)
        
        // Extract data from backend response
        const { user, prediction, riskAnalysis, predictionHistory } = parsedData.backendResponse
        
        setResults({
          // Backend prediction data (may be null if AI service failed)
          offerPrice: prediction.predictedOfferPrice || "Processing...",
          day1Close: prediction.predictedCloseDay1 || "Processing...",
          predictionStatus: prediction.predictionStatus,
          
          // Risk analysis
          riskLevel: riskAnalysis?.riskScore ? Math.round(riskAnalysis.riskScore) : "Analyzing...",
          riskAnalysisData: riskAnalysis,
          additionalInfo: riskAnalysis?.additionalInfo,
          
          // User and prediction info
          userData: user,
          predictionData: prediction,
          predictionHistory: predictionHistory,
          
          // Status indicators
          isBackendConnected: true,
          submittedAt: parsedData.submittedAt,
          
          // Mock recommendations (can be enhanced later)
          riskFactors: [
            "IPO market conditions analysis pending",
            "Sector-specific risk assessment in progress",
            "Competitive analysis being evaluated",
          ],
          recommendations: [
            "Monitor AI prediction completion",
            "Review risk analysis results when available",
            "Consider market timing for IPO launch",
          ],
        })
      } else {
        console.log("Using fallback demo data")
        
        // Fallback to demo data if no backend response
        setResults({
          offerPrice: "Offline Mode",
          day1Close: "Offline Mode", 
          riskLevel: "Demo Data",
          riskFactors: [
            "Backend connection failed",
            "Using demonstration data only",
            "Please check backend connection",
          ],
          recommendations: [
            "Restart the backend server",
            "Check API connection",
            "Try submitting the form again",
          ],
          isBackendConnected: false,
          error: parsedData.error
        })
      }
    } else {
      // No data found
      setResults({
        offerPrice: "No Data",
        day1Close: "No Data",
        riskLevel: "No Data",
        riskFactors: ["No submission data found"],
        recommendations: ["Please submit the form first"],
        isBackendConnected: false
      })
    }
    
    setLoading(false)
  }, [])

  // Download functionality
  const handleDownload = async () => {
    setDownloadLoading(true)

    try {
      // Create report content
      const reportContent = generateReportContent()

      // Create and download file
      const blob = new Blob([reportContent], { type: "text/plain" })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${userData?.companyName || "Company"}_IPO_Report_${new Date().toISOString().split("T")[0]}.txt`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      // Show success feedback
      setTimeout(() => setDownloadLoading(false), 1000)
    } catch (error) {
      console.error("Download failed:", error)
      setDownloadLoading(false)
      alert("Download failed. Please try again.")
    }
  }

  // Generate report content
  const generateReportContent = () => {
    const companyName = userData?.companyName || "Your Company"
    const date = new Date().toLocaleDateString()

    return `
IPO PREDICTION REPORT
=====================

Company: ${companyName}
Generated: ${date}

PREDICTIONS
-----------
Offer Price: $${results.offerPrice}
Day 1 Close: $${results.day1Close}
Risk Level: ${results.riskLevel}% (${results.riskLevel < 30 ? "Low Risk" : results.riskLevel < 70 ? "Moderate Risk" : "High Risk"})

RISK FACTORS
------------
${results.riskFactors.map((factor, index) => `${index + 1}. ${factor}`).join("\n")}

RECOMMENDATIONS
---------------
${results.recommendations.map((rec, index) => `${index + 1}. ${rec}`).join("\n")}

COMPANY DATA
------------
${
  userData
    ? Object.entries(userData)
        .filter(([key]) => key !== "password") // Exclude password
        .map(([key, value]) => `${key}: ${value}`)
        .join("\n")
    : "No company data available"
}

---
This report was generated by IPO Prediction Service
© ${new Date().getFullYear()} IPO Prediction Service. All rights reserved.
    `.trim()
  }

  // Share functionality
  const handleShare = async () => {
    setShareLoading(true)

    const shareData = {
      title: `${userData?.companyName || "Company"} IPO Prediction Results`,
      text: `Check out our IPO prediction results: Offer Price $${results.offerPrice}, Day 1 Close $${results.day1Close}, Risk Level ${results.riskLevel}%`,
      url: window.location.href,
    }

    try {
      // Try Web Share API first (mobile devices)
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData)
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch (error) {
      console.error("Share failed:", error)
      // Fallback: Try to copy to clipboard
      try {
        await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (clipboardError) {
        console.error("Clipboard failed:", clipboardError)
        alert("Sharing failed. Please copy the URL manually.")
      }
    } finally {
      setShareLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Analyzing Your Data</h2>
          <p className="text-slate-600">Our AI is processing your information to generate accurate predictions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            {userData?.submissionData?.companyName || userData?.backendResponse?.user?.companyName || "Your Company"}'s IPO Prediction Results
          </h1>
          <p className="text-lg text-slate-600">
            Based on your company data, our AI has generated the following predictions.
          </p>
          
          {/* Backend connection status */}
          <div className="mt-4 flex justify-center">
            {results?.isBackendConnected ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                🟢 Backend Connected • Data Saved to Database
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                🔴 Backend Offline • Using Local Data
              </span>
            )}
          </div>
          
          {results?.submittedAt && (
            <p className="text-sm text-slate-500 mt-2">
              Submitted: {new Date(results.submittedAt).toLocaleString()}
            </p>
          )}
        </div>

        {/* Results content here */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="border border-slate-200 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-center mb-2">Offer Price Prediction</h2>
            <div className="text-center py-6">
              <div className="inline-block rounded-full bg-blue-100 p-6">
                <span className="text-4xl font-bold text-blue-600">${results.offerPrice}</span>
              </div>
            </div>
            <p className="text-sm text-slate-500 text-center">Recommended IPO price per share</p>
          </div>

          <div className="border border-slate-200 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-center mb-2">Day 1 Close Prediction</h2>
            <div className="text-center py-6">
              <div className="inline-block rounded-full bg-green-100 p-6">
                <span className="text-4xl font-bold text-green-600">${results.day1Close}</span>
              </div>
            </div>
            <p className="text-sm text-slate-500 text-center">Expected closing price on first trading day</p>
          </div>

          <div className="border border-slate-200 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-center mb-2">Risk Analysis</h2>
            <div className="text-center py-6">
              <div className="inline-block rounded-full bg-amber-100 p-6">
                <span className="text-4xl font-bold text-amber-600">{results.riskLevel}%</span>
              </div>
            </div>
            <p className="text-sm text-slate-500 text-center">
              {results.riskLevel < 30 ? "Low Risk" : results.riskLevel < 70 ? "Moderate Risk" : "High Risk"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="border border-slate-200 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Risk Factors</h2>
            <ul className="space-y-2">
              {results.riskFactors.map((factor, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-red-100 text-red-600 mr-2 text-sm">
                    {index + 1}
                  </span>
                  <span className="text-slate-700">{factor}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border border-slate-200 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Recommendations</h2>
            <ul className="space-y-2">
              {results.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-green-100 text-green-600 mr-2 text-sm">
                    {index + 1}
                  </span>
                  <span className="text-slate-700">{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-4">
          <Button
            onClick={handleDownload}
            disabled={downloadLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
          >
            {downloadLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating Report...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" /> Download Full Report
              </>
            )}
          </Button>

          <Button variant="outline" onClick={handleShare} disabled={shareLoading} className="disabled:opacity-50">
            {shareLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-600 mr-2"></div>
                Sharing...
              </>
            ) : copied ? (
              <>
                <Check className="mr-2 h-4 w-4 text-green-600" /> Copied to Clipboard!
              </>
            ) : (
              <>
                <Share2 className="mr-2 h-4 w-4" /> Share Results
              </>
            )}
          </Button>
        </div>

        {/* Backend Data Details (if available) */}
        {results?.isBackendConnected && results?.predictionData && (
          <div className="mt-10 p-6 border border-slate-200 rounded-lg bg-slate-50">
            <h3 className="text-lg font-bold mb-4">🔗 Backend Response Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-semibold text-slate-700 mb-2">User Information</h4>
                <div className="space-y-1">
                  <p><span className="font-medium">Company:</span> {results.userData?.companyName}</p>
                  <p><span className="font-medium">Email:</span> {results.userData?.email}</p>
                  <p><span className="font-medium">Registration:</span> {results.userData?.registrationNumber}</p>
                  <p><span className="font-medium">User ID:</span> {results.userData?.$id}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-slate-700 mb-2">Prediction Status</h4>
                <div className="space-y-1">
                  <p><span className="font-medium">Status:</span> 
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${
                      results.predictionData?.predictionStatus === 'completed' ? 'bg-green-100 text-green-800' :
                      results.predictionData?.predictionStatus === 'failed' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {results.predictionData?.predictionStatus}
                    </span>
                  </p>
                  <p><span className="font-medium">Prediction ID:</span> {results.predictionData?.$id}</p>
                  <p><span className="font-medium">Model Used:</span> {results.predictionData?.modelUsed || 'N/A'}</p>
                  <p><span className="font-medium">Industry:</span> {results.predictionData?.industryFF12}</p>
                  <p><span className="font-medium">Exchange:</span> {results.predictionData?.exchange}</p>
                </div>
              </div>
              
              {results.riskAnalysisData && (
                <div className="md:col-span-2">
                  <h4 className="font-semibold text-slate-700 mb-2">Risk Analysis</h4>
                  <div className="space-y-1">
                    <p><span className="font-medium">Analysis ID:</span> {results.riskAnalysisData?.$id}</p>
                    <p><span className="font-medium">Status:</span> {results.riskAnalysisData?.analysisStatus}</p>
                    {results.additionalInfo && (
                      <div>
                        <span className="font-medium">Additional Info:</span>
                        <p className="mt-1 p-2 bg-white rounded border text-slate-600">
                          {results.additionalInfo}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {results.predictionHistory && results.predictionHistory.length > 0 && (
                <div className="md:col-span-2">
                  <h4 className="font-semibold text-slate-700 mb-2">Prediction History</h4>
                  <div className="bg-white rounded border p-2 max-h-32 overflow-y-auto">
                    {results.predictionHistory.map((history, index) => (
                      <div key={index} className="text-xs py-1 border-b last:border-b-0">
                        <span className="font-medium">{history.predictionType}:</span> {history.predictedValue} 
                        <span className="text-slate-500 ml-2">({history.modelVersion})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error details (if any) */}
        {results?.error && (
          <div className="mt-6 p-4 border border-red-200 rounded-lg bg-red-50">
            <h3 className="text-lg font-bold text-red-800 mb-2">⚠️ Connection Error Details</h3>
            <p className="text-sm text-red-700">{results.error}</p>
            <p className="text-xs text-red-600 mt-2">
              The form data has been saved locally. Please check your backend connection and try again.
            </p>
          </div>
        )}

        {/* Additional actions */}
        <div className="mt-8 text-center">
          <Link to="/register" className="text-blue-600 hover:text-blue-700 text-sm underline">
            Run Another Prediction
          </Link>
        </div>
      </div>
    </div>
  )
}
