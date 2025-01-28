"use client";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import React, { useState } from "react";

import { Manrope } from "next/font/google";

const manrope = Manrope({ subsets: ["latin"] });


export default function PricingTable() {
  const [billingCycle, setBillingCycle] = useState("monthly");

  const toggleBillingCycle = () => {
    setBillingCycle(billingCycle === "monthly" ? "annually" : "monthly");
  };

  const plans = [
    {
      name: "FREE",
      price: billingCycle === "monthly" ? "£0" : "£0",
      description: "Free for life :)",
      features: [
        "Reg No.",
        "About me",
        "Work: Single location",
        "Profile photo",
        "Unlimited links",
        "Link thumbnails",
        "Social icons",
      ],
      orangeFeatures: [],
      cta: "Sign up",
      mostPopular: false,
    },
    {
      name: "PRO",
      price: billingCycle === "monthly" ? "£10" : "£100",
      description:
        billingCycle === "monthly" ? "Per month" : "Each year, save £20",
      features: [
        "Reg No.",
        "About me",
        "Work: Multi-location",
        "Profile photo",
        "Unlimited links",
        "Link thumbnails",
        "Social icons",
        "Blogging (SEO)",
        "Gallery",
        "Videos tab",
        "Shop tab",
        "Blue tick verification",
      ],
      orangeFeatures: [
        "Blogging (SEO)",
        "Gallery",
        "Videos tab",
        "Shop tab",
        "Blue tick verification",
      ],
      cta: "Sign up",
      mostPopular: true,
    },
    {
      name: "PREMIUM PRO",
      price: billingCycle === "monthly" ? "£25" : "£210",
      description:
        billingCycle === "monthly" ? "Per month" : "Each year, save £40",
      features: [
        "Reg No.",
        "About me",
        "Work: Multi-location",
        "Profile photo",
        "Unlimited links",
        "Link thumbnails",
        "Social icons",
        "Blogging (SEO)",
        "Gallery",
        "Videos tab",
        "Shop tab",
        "Blue tick verification",
        "Custom Domain Integration",
        "White-Label Branding",
        "Priority Support",
      ],
      orangeFeatures: [
        "Blogging (SEO)",
        "Gallery",
        "Videos tab",
        "Shop tab",
        "Blue tick verification",
        "Custom Domain Integration",
        "White-Label Branding",
        "Priority Support",
      ],
      cta: "Sign up",
      mostPopular: false,
    },
  ];


  return (
    <div className="max-w-screen-2xl relative w-full px-5 md:px-18 lg:px-20 mt-16" id="pricing">
      <div className="flex justify-between items-center mb-10 md:mb-20 mt-10 max-w-6xl mx-auto">
        <h2 className={`${manrope.className} z-[99999] text-3xl md:text-5xl font-semibold text-center`}>
          Pricing
        </h2>

        <div className="flex justify-center gap-3 z-[99999]">
          <button
            className={`${
              billingCycle === "annually"
                ? " text-dark"
                : " text-white bg-primary-1"
            } py-2 md:py-3 border-primary-1 px-3 md:px-6 rounded-lg border`}
            onClick={toggleBillingCycle}
          >
            Monthly
          </button>
          <button
            className={`${
              billingCycle === "monthly"
                ? " text-dark"
                : " text-white bg-primary-1"
            } py-2 md:py-3 border-primary-1 px-3 md:px-6 rounded-lg border`}
            onClick={toggleBillingCycle}
          >
            Annually
          </button>
        </div>
      </div>

      <div className="blured-bg-1 mx-auto"></div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        <AnimatePresence mode="wait">
          {plans.map((plan, index) => (
            <motion.div
              key={billingCycle + plan.name} // key to trigger animation
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className={`relative border border-neutral-200 md:border-white shadow-xl md:shadow-none h-min z-[99999] bg-white rounded-xl p-8 ${
                plan.mostPopular ? "" : " "
              }`}
            >
              {plan.mostPopular && (
                <div className="absolute -top-5 right-5 font-medium rounded-lg px-3 py-3 bg-[#d46466] text-white text-sm">
                  Most popular
                </div>
              )}
              <div className="text-left flex flex-col">
                <h3 className="text-lg font-normal uppercase text-primary-orange-1">
                  {plan.name}
                </h3>
                <div className="text-5xl font-semibold">{plan.price}</div>
                <p className="text-primary-orange-1">{plan.description}</p>
              </div>
              <hr className="my-6" />
              <ul className="text-sm space-y-2">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <img
                      src={`https://cdn.prod.website-files.com/66b92aaf42a15fc71d286344/66b92aaf42a15fc71d286${
                        plan.orangeFeatures.includes(feature)
                          ? "467_Orange"
                          : "468_Blue"
                      }%20Check.svg`}
                      alt="check"
                      className="w-5 h-5 mr-3"
                    />
                    <span
                      className={`${
                        plan.orangeFeatures.includes(feature)
                          ? "text-primary-orange-1"
                          : ""
                      } text-lg font-medium`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-10">
                <Link
                  href="register"
                  className="flex justify-between text-[22px] items-center w-full text-center bg-gradient-to-r from-[#e7b274] to-[#d46466] text-white py-3 px-6 rounded-full font-medium hover:opacity-90 transition"
                >
                  {plan.cta}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="size-7"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                    />
                  </svg>
                </Link>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
