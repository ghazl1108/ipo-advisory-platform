// src/pages/RegisterPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MultiStepForm } from "../components/MultiStepForm";
import apiService from "../services/api";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleFormSubmit = async (data) => {
    console.log("Form submitted with data:", data);
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Test backend connection first
      console.log("Testing backend connection...");
      await apiService.healthCheck();
      console.log("Backend connection successful!");

      // Always use immediate prediction - store data + get AI predictions
      console.log("Submitting form with immediate AI prediction...");
      const result = await apiService.submitWithImmediatePrediction(data);
      console.log("Immediate prediction response:", result);

      // Store the response data for the results page
      const resultData = {
        submissionData: data,
        backendResponse: result,
        submittedAt: new Date().toISOString(),
        hasPredictions: !!(result.prediction?.predictedOfferPrice || result.prediction?.predictedCloseDay1)
      };
      localStorage.setItem("registrationData", JSON.stringify(resultData));

      // Navigate to results page
      navigate("/results");
    } catch (error) {
      console.error("Form submission failed:", error);
      setSubmitError(`Submission failed: ${error.message}`);
      
      // Store form data locally as fallback
      localStorage.setItem("registrationData", JSON.stringify({
        submissionData: data,
        error: error.message,
        submittedAt: new Date().toISOString(),
        offline: true
      }));
      
      // Still navigate to results page to show what we can
      navigate("/results");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Register Your Company for IPO Prediction
          </h1>
          <p className="text-lg text-slate-600">Complete the form below to get immediate AI-powered IPO predictions.</p>
          
          {/* Service status */}
          <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
            <div className="flex items-center justify-center space-x-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                🟢 Backend Connected
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                🤖 AI Service Ready
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                ⚡ Instant Predictions
              </span>
            </div>
          </div>
        </div>

        {/* Error message */}
        {submitError && (
          <div className="mb-6 p-4 border border-red-200 rounded-lg bg-red-50">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Submission Error</h3>
                <div className="mt-2 text-sm text-red-700">{submitError}</div>
                <div className="mt-2 text-sm text-red-600">
                  Don't worry - your data has been saved locally and you can view it on the results page.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading overlay */}
        {isSubmitting && (
          <div className="mb-6 p-4 border border-blue-200 rounded-lg bg-blue-50">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-3"></div>
              <div className="text-sm font-medium text-blue-800">
                Processing your IPO data and generating AI predictions... This may take a few moments.
              </div>
            </div>
            <div className="mt-2 text-xs text-blue-600">
              ✓ Storing data in database → ✓ Requesting AI predictions → ✓ Saving results
            </div>
          </div>
        )}

        <div className="border border-slate-200 rounded-lg shadow-sm p-6">
          <MultiStepForm 
            onSubmit={handleFormSubmit} 
            currentStep={currentStep} 
            setCurrentStep={setCurrentStep}
            disabled={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
}