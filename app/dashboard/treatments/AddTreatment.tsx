"use client";
import React, { useState } from "react";
import SaveButton from "../components/SaveButton";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

// Function for Captical First
function toCapitalFirst(sentence: string): string {
  return sentence.replace(/\b\w/g, (match) => match.toUpperCase()).toLowerCase();
}

// Client-side component to add a treatment
export default function AddTreatmentForm({ dentistryId }: { dentistryId: string }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter(); // Next.js router for refresh

  const maxLimit = 200;

  // Function to limit text area
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Prevent input beyond the max limit
    if (e.target.value.length <= maxLimit) {
      setDescription(e.target.value);
    }
  }

  // Function to handle the form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const supabase = createClient();

    // Insert new treatment
    const { data: treatmentData, error: treatmentError } = await supabase
      .from("treatments")
      .insert([{
        title: toCapitalFirst(title),
        description
      }])
      .select("treatment_id")
      .single();

    if (treatmentError) {
      console.error("Error adding treatment:", treatmentError);
      return;
    }

    // Get the max rank for the treatments associated with the dentistry
    const { data: maxRankData, error: rankError } = await supabase
      .from("dentistry_treatments")
      .select("rank")
      .eq("dentistry_id", dentistryId)
      .order("rank", { ascending: false })
      .limit(1)
      .single();

    let nextRank = 1; // Default to 1 if no treatments exist

    if (maxRankData) {
      nextRank = maxRankData.rank + 1; // Increment rank if there is data
    } else if (rankError && rankError.code !== "PGRST116") {
      // Only log if the error is something other than no rows found (PGRST116)
      console.error("Error fetching max rank:", rankError);
      return;
    }

    // Link the new treatment to the dentistry
    const { error: linkError } = await supabase
      .from("dentistry_treatments")
      .insert([
        { dentistry_id: dentistryId, treatment_id: treatmentData.treatment_id, rank: nextRank },
      ]);

    if (linkError) {
      console.error("Error linking treatment:", linkError);
      return;
    }

    // Ensure page refresh after successful submission
    try {
      window.location.reload(); // Hard refresh fallback
    } catch (error) {
      console.error("Soft refresh failed, performing hard reload:", error);
      window.location.reload(); // Hard refresh fallback
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 mt-10">
      <h2 className="text-lg font-semibold mb-3">Add new treatment</h2>
      <div className="mb-3">
        <input
          name="title"
          className="w-full p-2 rounded-[26px] py-2 text-base px-3 placeholder:text-neutral-500 text-neutral-800 placeholder:font-normal"
          placeholder="Treatment Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <textarea
          name="description"
          className="w-full p-2 resize-none focus:outline-none rounded-[26px] py-2 text-base px-3 placeholder:text-neutral-500 text-neutral-800 placeholder:font-normal min-h-40"
          placeholder="Treatment Description"
          value={description}
          onChange={handleTextChange}
          required
        />
        <div className='text-right text-gray-500'>{description.length}/{maxLimit}</div>
      </div>
      <div className="w-full flex justify-end">
        <SaveButton text={"Add treatment"} />
      </div>
    </form>
  );
}