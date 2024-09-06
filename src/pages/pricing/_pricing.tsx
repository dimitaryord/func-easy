import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

export default function PricingPage() {
  const tiers = [
    {
      name: "Starter",
      price: "$9",
      description: "Perfect for small projects and individual developers.",
      features: [
        "5 Cloud Functions",
        "100,000 Invocations/month",
        "1GB Outbound Data Transfer",
        "Basic Monitoring",
        "Community Support"
      ]
    },
    {
      name: "Pro",
      price: "$29",
      description: "Ideal for growing teams and applications.",
      features: [
        "25 Cloud Functions",
        "1,000,000 Invocations/month",
        "10GB Outbound Data Transfer",
        "Advanced Monitoring",
        "Email Support",
        "Custom Domains"
      ]
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large-scale applications and teams.",
      features: [
        "Unlimited Cloud Functions",
        "Unlimited Invocations",
        "Unlimited Outbound Data Transfer",
        "Premium Monitoring & Analytics",
        "24/7 Priority Support",
        "Custom Integrations",
        "Dedicated Account Manager"
      ]
    }
  ]

  return (
    <div className="bg-background min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-primary sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-xl text-secondary">
            Choose the plan that's right for you and your project
          </p>
        </div>
        <div className="mt-16 grid gap-8 lg:grid-cols-3 lg:gap-x-8">
          {tiers.map((tier) => (
            <Card key={tier.name} className="flex flex-col justify-between">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-primary">{tier.name}</CardTitle>
                <CardDescription className="text-4xl font-extrabold mt-2 text-primary">
                  {tier.price}
                  {tier.price !== "Custom" && <span className="text-xl font-normal text-secondary">/month</span>}
                </CardDescription>
                <p className="text-xl font-bold text-primary mt-7">{tier.description}</p>
              </CardHeader>
              <CardContent>
                <ul className="mt-6 space-y-4">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <div className="flex-shrink-0">
                        <Check className="h-6 w-6 text-accent" />
                      </div>
                      <p className="ml-3 text-sm text-white">{feature}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant={tier.name === "Pro" ? "default" : "outline"}>
                  {tier.name === "Enterprise" ? "Contact Sales" : "Get Started"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}