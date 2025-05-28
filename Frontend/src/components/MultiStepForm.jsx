"use client"

// src/components/MultiStepForm.jsx
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "./ui/Button"
import { Input } from "./ui/Input"
import { Textarea } from "./ui/Textarea"
import { ArrowLeft, ArrowRight, Upload } from "lucide-react"
import { Progress } from "./ui/Progress"

// Form schemas for each step
const registrationSchema = z.object({
  companyName: z.string().min(2, { message: "Company name is required" }),
  registrationNumber: z.string().min(2, { message: "Registration number is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
})

const predictionDataSchema = z.object({
  // All fields are required
  industryFF12: z.string().min(1, { message: "Industry is required" }),
  exchange: z.string().min(1, { message: "Exchange is required" }),
  highTech: z.string().min(1, { message: "High tech indicator is required" }),
  egc: z.string().min(1, { message: "EGC indicator is required" }),
  vc: z.string().min(1, { message: "VC backing indicator is required" }),
  prominence: z.string().min(1, { message: "VC prominence is required" }),
  pe: z.string().min(1, { message: "PE backing indicator is required" }),
  
  // Integer fields with database constraints
  age: z.string().refine((val) => {
    const num = parseInt(val);
    return !isNaN(num) && num >= 0 && num <= 200;
  }, { message: "Age must be between 0 and 200" }),
  
  year: z.string().refine((val) => {
    const num = parseInt(val);
    return !isNaN(num) && num >= 1900 && num <= 2100;
  }, { message: "Year must be between 1900 and 2100" }),
  
  nUnderwriters: z.string().refine((val) => {
    const num = parseInt(val);
    return !isNaN(num) && num >= 0 && num <= 100;
  }, { message: "Number of underwriters must be between 0 and 100" }),
  
  nVCs: z.string().refine((val) => {
    const num = parseInt(val);
    return !isNaN(num) && num >= 0 && num <= 100;
  }, { message: "Number of VC firms must be between 0 and 100" }),
  
  nExecutives: z.string().refine((val) => {
    const num = parseInt(val);
    return !isNaN(num) && num >= 0 && num <= 1000;
  }, { message: "Number of executives must be between 0 and 1000" }),
  
  nPatents: z.string().refine((val) => {
    const num = parseInt(val);
    return !isNaN(num) && num >= 0 && num <= 10000;
  }, { message: "Number of patents must be between 0 and 10000" }),
  
  // Float fields (no database constraints)
  sharesOfferedPerc: z.string().min(1, { message: "Shares offered percentage is required" }),
  investmentReceived: z.string().min(1, { message: "Investment received is required" }),
  amountOnProspectus: z.string().min(1, { message: "Amount on prospectus is required" }),
  commonEquity: z.string().min(1, { message: "Common equity ratio is required" }),
  sp2weeksBefore: z.string().min(1, { message: "S&P 500 average is required" }),
  blueSky: z.string().min(1, { message: "Blue sky expenses is required" }),
  managementFee: z.string().min(1, { message: "Management fee is required" }),
  bookValue: z.string().min(1, { message: "Book value is required" }),
  totalAssets: z.string().min(1, { message: "Total assets is required" }),
  totalRevenue: z.string().min(1, { message: "Total revenue is required" }),
  netIncome: z.string().min(1, { message: "Net income is required" }),
  roa: z.string().min(1, { message: "Return on assets is required" }),
  leverage: z.string().min(1, { message: "Leverage is required" }),
  priorFinancing: z.string().min(1, { message: "Prior financing is required" }),
  reputationLeadMax: z.string().min(1, { message: "Lead underwriter reputation is required" }),
  reputationAvg: z.string().min(1, { message: "Average underwriter reputation is required" }),
  ipoSize: z.string().min(1, { message: "IPO size is required" }),
})

const riskAnalysisSchema = z.object({
  additionalInfo: z.string().optional(),
  uploadPdf: z.boolean().optional().default(false),
})

const formSchemas = [registrationSchema, predictionDataSchema, riskAnalysisSchema]

const steps = [
  {
    title: "Company Registration",
    description: "Create your account and register your company",
  },
  {
    title: "Prediction Data",
    description: "Enter financial and IPO-related information",
  },
  {
    title: "Risk Analysis",
    description: "Additional information for risk assessment",
  },
]

// Industry codes for dropdown
const industryFF12Options = [
  { value: "Technology", label: "Technology" },
  { value: "Healthcare", label: "Healthcare" },
  { value: "Finance", label: "Finance" },
  { value: "Consumer Goods", label: "Consumer Goods" },
  { value: "Energy", label: "Energy" },
  { value: "Telecommunications", label: "Telecommunications" },
  { value: "Utilities", label: "Utilities" },
  { value: "Real Estate", label: "Real Estate" },
  { value: "Materials", label: "Materials" },
  { value: "Industrials", label: "Industrials" },
  { value: "Consumer Services", label: "Consumer Services" },
  { value: "Other", label: "Other" },
]

// Exchange options
const exchangeOptions = [
  { value: "AMEX", label: "AMEX" },
  { value: "NASDAQ", label: "NASDAQ" },
  { value: "NYSE", label: "NYSE" },
]

// Boolean options for dropdowns
const booleanOptions = [
  { value: "true", label: "True" },
  { value: "false", label: "False" },
]

export function MultiStepForm({ onSubmit, currentStep, setCurrentStep, disabled = false }) {
  // Store form data between steps
  const [formData, setFormData] = useState({})

  // Create a form for the current step
  const form = useForm({
    resolver: zodResolver(formSchemas[currentStep]),
    defaultValues: formData,
    mode: "onChange", // Validate on change for better user experience
  })

  // Update form with existing data when step changes
  useEffect(() => {
    const currentValues = formData
    Object.keys(form.getValues()).forEach((key) => {
      if (currentValues[key] !== undefined) {
        form.setValue(key, currentValues[key])
      }
    })
  }, [currentStep, form, formData])

  // Debug logging to help identify issues
  useEffect(() => {
    console.log("Current step:", currentStep)
    console.log("Form data:", formData)
    console.log("Form errors:", form.formState.errors)
  }, [currentStep, formData, form.formState.errors])

  const handleNext = async () => {
    console.log("Next button clicked")

    try {
      // Validate current step
      const result = await form.trigger()
      console.log("Validation result:", result)

      if (result) {
        // Get current form values
        const stepData = form.getValues()
        console.log("Step data:", stepData)

        // Update form data
        const updatedFormData = { ...formData, ...stepData }
        setFormData(updatedFormData)

        // Move to next step or submit
        if (currentStep < steps.length - 1) {
          setCurrentStep(currentStep + 1)
        } else {
          console.log("Submitting form with data:", updatedFormData)
          onSubmit(updatedFormData)
        }
      } else {
        console.log("Form validation failed")
        // Show validation errors
        Object.keys(form.formState.errors).forEach((key) => {
          console.error(`Field ${key} error:`, form.formState.errors[key])
        })
      }
    } catch (error) {
      console.error("Error in form handling:", error)
    }
  }

  const handleBack = () => {
    // Save current step data before going back
    const stepData = form.getValues()
    setFormData({ ...formData, ...stepData })

    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    // Save current step data even when skipping
    const stepData = form.getValues()
    const updatedFormData = { ...formData, ...stepData }
    setFormData(updatedFormData)

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onSubmit(updatedFormData)
    }
  }

  // Helper function to render form error messages
  const ErrorMessage = ({ name }) => {
    const error = form.formState.errors[name]
    return error ? <p className="text-sm text-red-500 mt-1">{error.message}</p> : null
  }

  return (
    <div className="space-y-8">
      {/* Progress indicator */}
      <div className="space-y-2">
        <div className="flex justify-between">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`text-sm font-medium ${index === currentStep ? "text-blue-600" : "text-slate-500"}`}
            >
              {step.title}
            </div>
          ))}
        </div>
        <Progress value={((currentStep + 1) / steps.length) * 100} className="h-2" />
      </div>

      <div className="space-y-2 text-center">
        <h2 className="text-2xl font-bold text-slate-900">{steps[currentStep].title}</h2>
        <p className="text-slate-600">{steps[currentStep].description}</p>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        {currentStep === 0 && (
          <>
            <div className="space-y-2">
              <label htmlFor="companyName" className="block text-sm font-medium text-slate-700">
                Company Name
              </label>
              <Input
                id="companyName"
                placeholder="Enter your company name"
                {...form.register("companyName")}
                className={form.formState.errors.companyName ? "border-red-500" : ""}
              />
              <ErrorMessage name="companyName" />
            </div>

            <div className="space-y-2">
              <label htmlFor="registrationNumber" className="block text-sm font-medium text-slate-700">
                Registration Number
              </label>
              <Input
                id="registrationNumber"
                placeholder="Enter company registration number"
                {...form.register("registrationNumber")}
                className={form.formState.errors.registrationNumber ? "border-red-500" : ""}
              />
              <ErrorMessage name="registrationNumber" />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...form.register("email")}
                className={form.formState.errors.email ? "border-red-500" : ""}
              />
              <ErrorMessage name="email" />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                {...form.register("password")}
                className={form.formState.errors.password ? "border-red-500" : ""}
              />
              <ErrorMessage name="password" />
            </div>
          </>
        )}

        {currentStep === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Dropdown Fields */}
            <div className="space-y-2">
              <label htmlFor="industryFF12" className="block text-sm font-medium text-slate-700">
                Industry Classification
              </label>
              <select
                id="industryFF12"
                className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                {...form.register("industryFF12")}
                required
              >
                <option value="">Select industry</option>
                {industryFF12Options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ErrorMessage name="industryFF12" />
            </div>

            <div className="space-y-2">
              <label htmlFor="exchange" className="block text-sm font-medium text-slate-700">
                Exchange where shares will be listed on
              </label>
              <select
                id="exchange"
                className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                {...form.register("exchange")}
                required
              >
                <option value="">Select exchange</option>
                {exchangeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ErrorMessage name="exchange" />
            </div>

            <div className="space-y-2">
              <label htmlFor="highTech" className="block text-sm font-medium text-slate-700">
                High tech firm indicator
              </label>
              <select
                id="highTech"
                className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                {...form.register("highTech")}
                required
              >
                <option value="">Select</option>
                {booleanOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ErrorMessage name="highTech" />
            </div>

            <div className="space-y-2">
              <label htmlFor="egc" className="block text-sm font-medium text-slate-700">
                Emerging Growth Company indicator
              </label>
              <select
                id="egc"
                className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                {...form.register("egc")}
                required
              >
                <option value="">Select</option>
                {booleanOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ErrorMessage name="egc" />
            </div>

            <div className="space-y-2">
              <label htmlFor="vc" className="block text-sm font-medium text-slate-700">
                Venture capital backing indicator
              </label>
              <select
                id="vc"
                className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                {...form.register("vc")}
                required
              >
                <option value="">Select</option>
                {booleanOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ErrorMessage name="vc" />
            </div>

            <div className="space-y-2">
              <label htmlFor="pe" className="block text-sm font-medium text-slate-700">
                Private equity backing indicator
              </label>
              <select
                id="pe"
                className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                {...form.register("pe")}
                required
              >
                <option value="">Select</option>
                {booleanOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ErrorMessage name="pe" />
            </div>

            {/* Changed from number input to boolean dropdown */}
            <div className="space-y-2">
              <label htmlFor="prominence" className="block text-sm font-medium text-slate-700">
                VC prominence
              </label>
              <select
                id="prominence"
                className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                {...form.register("prominence")}
                required
              >
                <option value="">Select</option>
                {booleanOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ErrorMessage name="prominence" />
            </div>

            <div className="space-y-2">
              <label htmlFor="age" className="block text-sm font-medium text-slate-700">
                Firm age (0-200 years)
              </label>
              <Input
                id="age"
                type="number"
                min="0"
                max="200"
                placeholder="Enter firm age (0-200)"
                {...form.register("age")}
                required
                className={form.formState.errors.age ? "border-red-500" : ""}
              />
              <ErrorMessage name="age" />
            </div>

            <div className="space-y-2">
              <label htmlFor="year" className="block text-sm font-medium text-slate-700">
                Issue year (1900-2100)
              </label>
              <Input
                id="year"
                type="number"
                min="1900"
                max="2100"
                placeholder="Enter issue year (1900-2100)"
                {...form.register("year")}
                required
                className={form.formState.errors.year ? "border-red-500" : ""}
              />
              <ErrorMessage name="year" />
            </div>

            <div className="space-y-2">
              <label htmlFor="nUnderwriters" className="block text-sm font-medium text-slate-700">
                Count of underwriters (0-100)
              </label>
              <Input
                id="nUnderwriters"
                type="number"
                min="0"
                max="100"
                placeholder="Enter count of underwriters (0-100)"
                {...form.register("nUnderwriters")}
                required
                className={form.formState.errors.nUnderwriters ? "border-red-500" : ""}
              />
              <ErrorMessage name="nUnderwriters" />
            </div>

            <div className="space-y-2">
              <label htmlFor="sharesOfferedPerc" className="block text-sm font-medium text-slate-700">
                Shares offered as % of shares outstanding after offer
              </label>
              <Input
                id="sharesOfferedPerc"
                type="number"
                placeholder="Enter percentage"
                {...form.register("sharesOfferedPerc")}
                required
                className={form.formState.errors.sharesOfferedPerc ? "border-red-500" : ""}
              />
              <ErrorMessage name="sharesOfferedPerc" />
            </div>

            <div className="space-y-2">
              <label htmlFor="investmentReceived" className="block text-sm font-medium text-slate-700">
                Total known amount invested in company ($000)
              </label>
              <Input
                id="investmentReceived"
                type="number"
                placeholder="Enter amount"
                {...form.register("investmentReceived")}
                required
                className={form.formState.errors.investmentReceived ? "border-red-500" : ""}
              />
              <ErrorMessage name="investmentReceived" />
            </div>

            <div className="space-y-2">
              <label htmlFor="amountOnProspectus" className="block text-sm font-medium text-slate-700">
                Total amount on prospectus (USD, Global)
              </label>
              <Input
                id="amountOnProspectus"
                type="number"
                placeholder="Enter amount"
                {...form.register("amountOnProspectus")}
                required
                className={form.formState.errors.amountOnProspectus ? "border-red-500" : ""}
              />
              <ErrorMessage name="amountOnProspectus" />
            </div>

            <div className="space-y-2">
              <label htmlFor="commonEquity" className="block text-sm font-medium text-slate-700">
                Tangible Common Equity Ratio Before Offer
              </label>
              <Input
                id="commonEquity"
                type="number"
                placeholder="Enter ratio"
                {...form.register("commonEquity")}
                required
                className={form.formState.errors.commonEquity ? "border-red-500" : ""}
              />
              <ErrorMessage name="commonEquity" />
            </div>

            <div className="space-y-2">
              <label htmlFor="sp2weeksBefore" className="block text-sm font-medium text-slate-700">
                S&P 500 average 2 weeks before offer date
              </label>
              <Input
                id="sp2weeksBefore"
                type="number"
                placeholder="Enter S&P average"
                {...form.register("sp2weeksBefore")}
                required
                className={form.formState.errors.sp2weeksBefore ? "border-red-500" : ""}
              />
              <ErrorMessage name="sp2weeksBefore" />
            </div>

            <div className="space-y-2">
              <label htmlFor="blueSky" className="block text-sm font-medium text-slate-700">
                Blue sky expenses
              </label>
              <Input
                id="blueSky"
                type="number"
                placeholder="Enter expenses"
                {...form.register("blueSky")}
                required
                className={form.formState.errors.blueSky ? "border-red-500" : ""}
              />
              <ErrorMessage name="blueSky" />
            </div>

            <div className="space-y-2">
              <label htmlFor="managementFee" className="block text-sm font-medium text-slate-700">
                Total management fee
              </label>
              <Input
                id="managementFee"
                type="number"
                placeholder="Enter fee"
                {...form.register("managementFee")}
                required
                className={form.formState.errors.managementFee ? "border-red-500" : ""}
              />
              <ErrorMessage name="managementFee" />
            </div>

            <div className="space-y-2">
              <label htmlFor="bookValue" className="block text-sm font-medium text-slate-700">
                Book value
              </label>
              <Input
                id="bookValue"
                type="number"
                placeholder="Enter book value"
                {...form.register("bookValue")}
                required
                className={form.formState.errors.bookValue ? "border-red-500" : ""}
              />
              <ErrorMessage name="bookValue" />
            </div>

            <div className="space-y-2">
              <label htmlFor="totalAssets" className="block text-sm font-medium text-slate-700">
                Total assets
              </label>
              <Input
                id="totalAssets"
                type="number"
                placeholder="Enter total assets"
                {...form.register("totalAssets")}
                required
                className={form.formState.errors.totalAssets ? "border-red-500" : ""}
              />
              <ErrorMessage name="totalAssets" />
            </div>

            <div className="space-y-2">
              <label htmlFor="totalRevenue" className="block text-sm font-medium text-slate-700">
                Total revenue
              </label>
              <Input
                id="totalRevenue"
                type="number"
                placeholder="Enter total revenue"
                {...form.register("totalRevenue")}
                required
                className={form.formState.errors.totalRevenue ? "border-red-500" : ""}
              />
              <ErrorMessage name="totalRevenue" />
            </div>

            <div className="space-y-2">
              <label htmlFor="netIncome" className="block text-sm font-medium text-slate-700">
                Net income
              </label>
              <Input
                id="netIncome"
                type="number"
                placeholder="Enter net income"
                {...form.register("netIncome")}
                required
                className={form.formState.errors.netIncome ? "border-red-500" : ""}
              />
              <ErrorMessage name="netIncome" />
            </div>

            <div className="space-y-2">
              <label htmlFor="roa" className="block text-sm font-medium text-slate-700">
                Return on assets
              </label>
              <Input
                id="roa"
                type="number"
                placeholder="Enter ROA"
                {...form.register("roa")}
                required
                className={form.formState.errors.roa ? "border-red-500" : ""}
              />
              <ErrorMessage name="roa" />
            </div>

            <div className="space-y-2">
              <label htmlFor="leverage" className="block text-sm font-medium text-slate-700">
                Leverage
              </label>
              <Input
                id="leverage"
                type="number"
                placeholder="Enter leverage"
                {...form.register("leverage")}
                required
                className={form.formState.errors.leverage ? "border-red-500" : ""}
              />
              <ErrorMessage name="leverage" />
            </div>

            <div className="space-y-2">
              <label htmlFor="nVCs" className="block text-sm font-medium text-slate-700">
                Count of VC firms backing IPO firm (0-100)
              </label>
              <Input
                id="nVCs"
                type="number"
                min="0"
                max="100"
                placeholder="Enter count of VC firms (0-100)"
                {...form.register("nVCs")}
                required
                className={form.formState.errors.nVCs ? "border-red-500" : ""}
              />
              <ErrorMessage name="nVCs" />
            </div>

            <div className="space-y-2">
              <label htmlFor="nExecutives" className="block text-sm font-medium text-slate-700">
                Count of executives (0-1000)
              </label>
              <Input
                id="nExecutives"
                type="number"
                min="0"
                max="1000"
                placeholder="Enter count of executives (0-1000)"
                {...form.register("nExecutives")}
                required
                className={form.formState.errors.nExecutives ? "border-red-500" : ""}
              />
              <ErrorMessage name="nExecutives" />
            </div>

            <div className="space-y-2">
              <label htmlFor="priorFinancing" className="block text-sm font-medium text-slate-700">
                Prior financing received
              </label>
              <Input
                id="priorFinancing"
                type="number"
                placeholder="Enter prior financing"
                {...form.register("priorFinancing")}
                required
                className={form.formState.errors.priorFinancing ? "border-red-500" : ""}
              />
              <ErrorMessage name="priorFinancing" />
            </div>

            <div className="space-y-2">
              <label htmlFor="reputationLeadMax" className="block text-sm font-medium text-slate-700">
                Lead underwriter reputation (max if more than one)
              </label>
              <Input
                id="reputationLeadMax"
                type="number"
                placeholder="Enter reputation score"
                {...form.register("reputationLeadMax")}
                required
                className={form.formState.errors.reputationLeadMax ? "border-red-500" : ""}
              />
              <ErrorMessage name="reputationLeadMax" />
            </div>

            <div className="space-y-2">
              <label htmlFor="reputationAvg" className="block text-sm font-medium text-slate-700">
                Average reputation of all underwriters
              </label>
              <Input
                id="reputationAvg"
                type="number"
                placeholder="Enter average reputation"
                {...form.register("reputationAvg")}
                required
                className={form.formState.errors.reputationAvg ? "border-red-500" : ""}
              />
              <ErrorMessage name="reputationAvg" />
            </div>

            <div className="space-y-2">
              <label htmlFor="nPatents" className="block text-sm font-medium text-slate-700">
                Count of patents granted at time of IPO (0-10000)
              </label>
              <Input
                id="nPatents"
                type="number"
                min="0"
                max="10000"
                placeholder="Enter count of patents (0-10000)"
                {...form.register("nPatents")}
                required
                className={form.formState.errors.nPatents ? "border-red-500" : ""}
              />
              <ErrorMessage name="nPatents" />
            </div>

            <div className="space-y-2">
              <label htmlFor="ipoSize" className="block text-sm font-medium text-slate-700">
                IPO size in USD
              </label>
              <Input
                id="ipoSize"
                type="number"
                placeholder="Enter IPO size"
                {...form.register("ipoSize")}
                required
                className={form.formState.errors.ipoSize ? "border-red-500" : ""}
              />
              <ErrorMessage name="ipoSize" />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <>
            <div className="space-y-2">
              <label htmlFor="additionalInfo" className="block text-sm font-medium text-slate-700">
                Additional Information for Risk Analysis
              </label>
              <Textarea
                id="additionalInfo"
                placeholder="Provide any additional information that might help with risk assessment"
                className="min-h-[150px]"
                {...form.register("additionalInfo")}
              />
            </div>

            <div className="flex items-start space-x-3 p-4 border rounded-md">
              <input
                type="checkbox"
                id="uploadPdf"
                {...form.register("uploadPdf")}
                className="h-4 w-4 mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div className="space-y-1 leading-none">
                <label htmlFor="uploadPdf" className="block text-sm font-medium text-slate-700">
                  Upload PDF Documents
                </label>
                <p className="text-sm text-slate-500">
                  Check this if you want to upload additional documents for analysis
                </p>
              </div>
            </div>

            {form.watch("uploadPdf") && (
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="dropzone-file"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-3 text-slate-500" />
                    <p className="mb-2 text-sm text-slate-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-slate-500">PDF (MAX. 10MB)</p>
                  </div>
                  <input id="dropzone-file" type="file" className="hidden" accept=".pdf" />
                </label>
              </div>
            )}
          </>
        )}

        <div className="flex justify-between pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0 || disabled}
            className="px-4 py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>

          <div className="space-x-2">
            {currentStep === 2 && (
              <Button
                type="button"
                variant="outline"
                onClick={handleSkip}
                disabled={disabled}
                className="px-4 py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Skip
              </Button>
            )}

            <Button
              type="button"
              onClick={handleNext}
              disabled={disabled}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-sm text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-blue-600"
            >
              {disabled && currentStep === steps.length - 1 ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  {currentStep === steps.length - 1 ? "Submit" : "Next"} <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
